import {combineReducers} from 'redux';
import Actions from './actionTypes';
import PokemonData from "../models/PokemonData";

//Usually you name the reducer with the name of the value of the keys in your store
//The store is almost like a state of the essential data of your app.

//Reducers specify how the application's state changes in response to actions sent to the store. 
//Remember that actions only describe what happened, but don't describe 
//how the application's state changes.

//Things you should never do inside a reducer:

// Mutate its arguments;
// Perform side effects like API calls and routing transitions;
// Call non - pure functions, e.g.Date.now() or Math.random().

interface PokedexModel
{
  id?:string
  name?:string
  pokemon?:
  {
    completion?: {},
    caught?: number
  }
  
}

const pokedex = (state:PokedexModel={},action)=>
{
  switch(action.type)
  {
    case Actions.UpdateCaughtPokemon:
      {
        //Add typescript check for action.pokemonData
        const pokemonData: PokemonData = action.pokemonData;
        console.log('Data to update', pokemonData);

        //Clone it to manipulate it
        let newState = { ...state };
        if (!newState.pokemon.completion) {
          newState.pokemon.completion = {}

        }
        if (pokemonData.caught == false) {
          console.log('before', newState);
          delete newState.pokemon.completion[pokemonData.dexNumber];
          // newState.completion[pokemonData.dexNumber]=false;
          console.log('after', newState)

        }
        else newState.pokemon.completion[pokemonData.dexNumber] = true
        //Get the key count, that's how many pokemon we have
        newState.pokemon.caught = Object.keys(newState.pokemon.completion).length || 0;
        return { ...newState }
      }
    case Actions.SetPokedexData:
      {
        console.log('dbPokedex',action.pokedex);
        
        return { ...state,...action.pokedex }
      }
    case Actions.UpdatePokemonCompletionWithObservable:
      {
        const pokedex = {...state};
        pokedex.pokemon = action.pokemon;
        return pokedex;
      }


    default: return state
  }
}



//TODO: Refactor the set/remove actions for specific things

const user = (state={},action)=>
{
  switch(action.type)
  {
    case Actions.LoginUser:
    {
      return {...action.user};
    }
    case Actions.LogOutUser:
    {
      return null;
    }
    default: return state;
  }
  
}

const database = (state=null,action)=>
{
  switch(action.type)
  {
    case Actions.SetDatabase:
    {
        return action.database;
    }
    default: return state; 
  }
}

const auth = (state=null,action)=>
{
  switch(action.type)
  {
    case Actions.SetAuth:
    {
      return action.auth 
    }
    default: return state;
  }
}


export default combineReducers(
  {
    pokedex,
    user,
    auth,
    database
  }
)
