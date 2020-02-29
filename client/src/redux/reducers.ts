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

interface PokemonModel
{
  completion?:{},
  caught?:number
}

const pokemon = (state:PokemonModel={},action)=>
{
  switch(action.type)
  {
    case Actions.UpdateCaughtPokemon:
    {
      //Add typescript check for action.pokemonData
      const pokemonData:PokemonData = action.pokemonData;
      console.log('Data to update',pokemonData);
      
      //Clone it to manipulate it
      let newState = {...state};
      if(pokemonData.caught==false)
      {
        console.log('before',newState);
        
        //For some reason, delete is not working....? 🤷‍♂️
        delete newState.completion[pokemonData.dexNumber];
        // newState.completion[pokemonData.dexNumber]=false;
        console.log('after',newState)
        
      }
      else newState.completion[pokemonData.dexNumber]=true
      //Get the key count, that's how many pokemon we have
      newState.caught=Object.keys(newState.completion).length;
      return {...newState}
    }
    case Actions.OverridePokemonState:
    {
      return {...action.pokemon}
    }
    default: return state
  }
}


const users = (state = [], action) => 
{
  return [...state]
}



// const isEverythingCool = (state={},action) =>
// {
//   switch(action.type)
//   {
//     case Actions.DoSomething:
//     {
//       return {...state,isEverythingCool:true};
//     }
//     default:
//     {
//       return state;
//     }
//   }
// }


export default combineReducers(
  {
    users,
    pokemon,
    // totalPokemon
  }
)
