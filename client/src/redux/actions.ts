import ActionTypes from './actionTypes';
import PokemonData from '../models/PokemonData'

//Asyncs processes work here

export function UpdateCaughtPokemon(pokemonData:PokemonData)
{
    //Add app logic here if needed    
    return{
        pokemonData,
        type: ActionTypes.UpdateCaughtPokemon
    }
}

export function OverridePokemonState(pokemon:{})
{
    return{
        pokemon,
        type: ActionTypes.OverridePokemonState
    }
}
