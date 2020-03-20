import ActionTypes from './actionTypes';
import PokemonData from '../models/PokemonData'
import { PokedexDatabase } from '../services/DatabaseService';

//Asyncs processes work here

export function UpdateCaughtPokemon(pokemonData:PokemonData)
{
    //Add app logic here if needed    
    return{
        pokemonData,
        type: ActionTypes.UpdateCaughtPokemon
    }
}

export async function SetPokedexData(pokedexID:string,user:firebase.User,database:PokedexDatabase)
{
    const pokedexData = await database.getPokedex(pokedexID,user);
    pokedexData.id=pokedexID;
    return{
        pokedex:pokedexData,
        type: ActionTypes.SetPokedexData
    }
}

export function SetPokedexDatabaseObject(database: PokedexDatabase)
{
    return{
        database: database,
        type: ActionTypes.SetDatabase
    }
}

export function SetAuthenticationObject(auth: firebase.auth.Auth) {
    return {
        auth: auth,
        type: ActionTypes.SetAuth
    }
}

export function LoginUser(user:firebase.User)
{

    return{
        user: user,
        type: ActionTypes.LoginUser
    }
}

export function LogoutUser() 
{
    return {
        type: ActionTypes.LogOutUser
    }
}


export async function CreatePokedex(pokedexName:string, user:firebase.User, database:PokedexDatabase)
{
        
    const pokedex = await database.createPokedex(pokedexName,user);
    if(pokedex)
    {
        console.log('Created Pokedex');
        return {
            pokedex,
            type: ActionTypes.SetPokedexData
        }   
    }
    else 
    {
        console.log('Error creating pokedex in the database');
        
        return {type:null}
    }
    
}

export async function JoinPokedex(pokedexID: string,user:firebase.User, database: PokedexDatabase)
{
    const pokedex = await database.joinPokedex(pokedexID,user);
    if(pokedex)
    {
        console.log('Joined Pokedex Succesfully');
        return {
            pokedex,
            type: ActionTypes.SetPokedexData
        }
    }
    else
    {
        console.log('Error joining pokedex');
        return{
            name: null,
            type: null
        }
    }

    
}