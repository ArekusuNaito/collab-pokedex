import ActionTypes from './actionTypes';

export function CatchPokemon()
{
    //Add app logic here if needed
    return{
        type: ActionTypes.CatchPokemon
    }
}

export function MakeItExpensive()
{
    return{
        type: ActionTypes.ReleasePokemon
    }
}
