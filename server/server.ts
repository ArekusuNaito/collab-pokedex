//Read about: https://ejs.co/ ~ Embedded JavaScript templating.
//ts-node 	Use to run TypeScript files directly.
//shelljs 	Use to execute shell commands such as to copy files and remove directories.
//nodemon 	A handy tool for running Node.js in a development environment.Nodemon watches files for changes and automatically restarts the Node.js application when changes are detected.No more stopping and restarting Node.js!

import fs from 'fs';
import bodyParser, { json } from "body-parser";
import socket from "socket.io";
import cors from 'cors';
import express, { request, response } from 'express'
import { emit } from 'cluster';
const app = express();
const port = 8888;

app.use(cors());
app.use(bodyParser.json());

const expressServer = app.listen(port,()=>
{
    console.log(`Server has started on port: ${port}`);
});

const databasePath = `./database`;

const io = socket(expressServer)
io.on('connection',socket=>
{
    console.log('User connected',socket.client.id,socket.rooms);
    socket.on('updatePokemon',async (pokemonData:PokemonData)=>
    {
        pokemonData.pokedexID='kanto-la';
        console.log(`Received: ${pokemonData.dexNumber}:${pokemonData.caught}`);
        //Is it neccesary to update the database here?
        //How would it be better? Maybe on a disconnect or something?
        //It works but it's a thought to know if this is a right way to do it
        const isFileOK = await handleUpdatePokemon(pokemonData);
        if (isFileOK) io.emit('pokemonUpdated',pokemonData);
        else io.emit('updateError',{errorMessage:`Error Updating the server database`,pokemonData})
        
    });
    socket.on('disconnect',()=>
    {
        console.log(`${socket.client.id} disconnected`);
        
    });
});


async function handleGetPokedex(pokedexID:string):Promise<any>
{
    return new Promise((resolve, reject) => 
    {
        const pokedexPath:string = `${databasePath}/${pokedexID}.json`
        fs.readFile(pokedexPath,`utf-8`,(error,fileContents)=>
        {
            resolve(fileContents);
        })
    })
}

app.get(`/pokedex/:id`, async (request, response)=>
{
    console.log(`/pokedex/`,request.params);
    const pokedexData = await handleGetPokedex(request.params.id);
    response.status(200).send(JSON.parse(pokedexData));
    
});



app.get('/ping',(request,response)=>
{
    console.log('Ping!');
    response.status(200).send('Pong!')
    
});

//Update json file
//Not being used for now as this has been moved to the socket
app.put('/update/pokemon',async (request,response)=>
{
    const pokemonData:PokemonData = request.body;
    const isFileOK:boolean = await handleUpdatePokemon(pokemonData);
    if(isFileOK)
    {
        response.sendStatus(200);
    }
    else
    {
        response.sendStatus(500);
    }
})

async function handleUpdatePokemon(pokemonData:PokemonData):Promise<any>
{
    //Given the pokemonData, it must update the specific pokedex-file
    console.log(pokemonData.pokedexID);
    const pokedexPath = `./database/${pokemonData.pokedexID}.json`;
    const encoding = 'utf-8'
    return new Promise((resolve, reject) => 
    {
        try
        {
            fs.readFile(pokedexPath, encoding, (error, fileContents) => 
            {
                
                if (error) resolve(false);
                else 
                {
                    let pokedex: Pokedex = JSON.parse(fileContents);
                    //We either set it to true, or we delete the key to save a bit of storage space
                    if(pokemonData.caught)
                    {
                        pokedex.pokemon.completion[pokemonData.dexNumber] = true;
                    }
                    else delete pokedex.pokemon.completion[pokemonData.dexNumber]; 
                    pokedex.pokemon.caught = Object.keys(pokedex.pokemon.completion).length;
                    //Then write the contents of the file
                    fs.writeFile(pokedexPath, JSON.stringify(pokedex, null, '\t'), () => 
                    {
                        
                        resolve(true);
                    })

                }
            });
        }catch(error)
        {
            reject(false);
        }
        
    })
    
}   

interface Pokedex
{
    users:[]
    pokemon:
    {
        completion:{},
        caught:number
    }
}

interface PokemonData
{
    pokedexID?:string,
    dexNumber: number
    caught: boolean
}