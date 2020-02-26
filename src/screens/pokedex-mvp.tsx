import * as React from "react";
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import PokemonButton from '../components/PokemonButton';
import { UpdateCaughtPokemon } from '../redux/actions'
//actions
//models
import PokemonData from '../models/PokemonData'

interface State
{
    pokemonList:number[]
}

interface Props
{
    //Important to add an interface to the store state in another file
    storeState:{pokemon:{completion:{},caught:number}}
    pokemonPerRow:number,
    dispatch: Function
}

export default class PokedexScreenMVP extends React.Component<Props,State>
{
    constructor(props)
    {
        super(props)   
        this.createPokemonButtons = this.createPokemonButtons.bind(this);
        this.updatePokemonData = this.updatePokemonData.bind(this);
        this.state=
        {
            "pokemonList":[]
        }
        
    }
    

    getKantoPokemonData()
    {
        // console.log("Getting Pokemon data...");
        let pokedexData:number[] = []
        for (let dexNumber = 1; dexNumber <= 151; dexNumber++) 
        {
            pokedexData.push(dexNumber);
        }
        this.setState({pokemonList: pokedexData})
        
    }

    componentDidMount()
    {
        this.getKantoPokemonData();
    }

    getRowSize():number
    {
        return 12/this.props.pokemonPerRow;
    }

    createPokemonButtons()
    {

        return this.state.pokemonList.map(dexNumber=>
        {
            const caughtState = (this.props.storeState.pokemon.completion.hasOwnProperty(dexNumber))?this.props.storeState.pokemon.completion[dexNumber]:false;

            return (
                <Grid item key={"grid" + dexNumber} xs={this.getRowSize()}>
                    <PokemonButton caught={caughtState} onClick={this.updatePokemonData} key={dexNumber} dexNumber={dexNumber} />
            </Grid>)

        });
    }

    updatePokemonData(pokemonData:PokemonData)
    {
        console.log('Button State',pokemonData.caught,pokemonData.dexNumber);
        this.props.dispatch(UpdateCaughtPokemon(pokemonData))
    }


    render()
    {
        return( 
        <div>
            <h1>Caught:{this.props.storeState.pokemon.caught}/151</h1>
            <Grid
                container
                direction="row"
                alignItems="center"
                spacing={2}>
                {this.createPokemonButtons()}
            </Grid>
        </div>)
        
        
    }
}