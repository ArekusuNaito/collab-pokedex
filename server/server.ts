//Read about: https://ejs.co/ ~ Embedded JavaScript templating.
//ts-node 	Use to run TypeScript files directly.
//shelljs 	Use to execute shell commands such as to copy files and remove directories.
//nodemon 	A handy tool for running Node.js in a development environment.Nodemon watches files for changes and automatically restarts the Node.js application when changes are detected.No more stopping and restarting Node.js!

import fs from 'fs';
import bodyParser, { json } from "body-parser";
import cors from 'cors';
import express from 'express'
const app = express();
const port = 8888;

app.use(cors());
app.use(bodyParser.json());

app.listen(port,()=>
{
    console.log(`Server has started on port: ${port}`);
    
});

app.get('/ping',(request,response)=>
{
    console.log('Ping!');
    response.status(200).send('Pong!')
    
});

//Update json file
app.put('/update/pokemon',async (request,response)=>
{
    const pokemonData:PokemonRequestBody = request.body;
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

async function handleUpdatePokemon(pokemonData:PokemonRequestBody):Promise<any>
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
                console.log(error);
                
                if (error) resolve(false);
                else {
                    let pokedex: Pokedex = JSON.parse(fileContents);
                    pokedex.pokemon.completion[pokemonData.dexNumber] = pokemonData.caught;
                    //Count how many pokkemon you've caught
                    let caught = 0;
                    for (let dexNumber in pokedex.pokemon.completion) {
                        const pokemon: boolean = pokedex.pokemon.completion[dexNumber];
                        if (pokemon) caught++
                    }
                    pokedex.pokemon.caught = caught; //Finally set it
                    //Then write the contents of the file
                    fs.writeFile(pokedexPath, JSON.stringify(pokedex, null, '\t'), () => {
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

interface PokemonRequestBody
{
    pokedexID?:string,
    dexNumber: number
    caught: boolean
}