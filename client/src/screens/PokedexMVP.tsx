import * as React from "react";
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import PokemonButton from '../components/PokemonButton';
import { UpdateCaughtPokemon,SetPokedexData } from '../redux/actions'
import { LogoutUser } from '../redux/actions'
//models
import PokemonData from '../models/PokemonData'
import { PokedexDatabase } from '../services/DatabaseService';
//Research use-effect, use-state in react


interface State
{
    pokemonList:number[],
}

interface Props
{
    //Important to add an interface to the store state in another file
    storeState?: { user?:firebase.User, pokedex?: { id?: string, name?:string, pokemon?: { completion?: {}, caught: number }}}
    pokemonPerRow:number,
    dispatch?: Function,
    database: PokedexDatabase
    history: any,
    auth: firebase.auth.Auth
}


class PokedexScreenMVP extends React.Component<Props,State>
{
    constructor(props)
    {
        super(props)   
        this.createPokemonButtons = this.createPokemonButtons.bind(this);
        this.updatePokemonData = this.updatePokemonData.bind(this);
        this.testButtonClick = this.testButtonClick.bind(this)
        this.state=
        {
            "pokemonList":[]
        }
        // console.log(this.props);
        
        
    }
    

    async getKantoPokemonData()
    {
        let pokedexData:number[] = []
        for (let dexNumber = 1; dexNumber <= 151; dexNumber++) 
        {
            pokedexData.push(dexNumber);
        }
        this.setState({pokemonList: pokedexData})
        
    }

    async testButtonClick()
    {        
        this.props.dispatch(LogoutUser());
        this.props.auth.signOut();
        this.props.history.push('/sign');
    }

    async componentDidMount()
    {
        await this.getKantoPokemonData();
        
        
    }

    getRowSize():number
    {
        return 12/this.props.pokemonPerRow;
    }

    createPokemonButtons()
    {

        return this.state.pokemonList.map(dexNumber=>
        {
            
            return (
                <Grid item key={"grid" + dexNumber} xs={this.getRowSize()}>
                    {/* <PokemonButton caught={caughtState} onClick={this.updatePokemonData} key={dexNumber} dexNumber={dexNumber} /> */}
                    <PokemonButton onClick={this.updatePokemonData} key={dexNumber} dexNumber={dexNumber} />
                </Grid>)           

        });
    }

    async updatePokemonData(pokemonData:PokemonData)
    {
        console.log('Button State',pokemonData.caught,pokemonData.dexNumber);
        //TODO: Check if async functionality is not messing with flow
        this.props.dispatch(UpdateCaughtPokemon(pokemonData))
        await this.props.database.updateCaughtPokemonClient(this.props.storeState.pokedex.id,this.props.storeState.pokedex.pokemon,this.props.storeState.user);
        //What happens when there's no completion here
        // console.log(this.props.storeState.pokedex.pokemon.caught);
        // this.props.database
        // if (pokemonData.caught) 
        // {
           
        //     await this.props.database.ref(`${this.props.storeState.pokedexID}/pokemon/completion/${pokemonData.dexNumber}`).set(true);

        // }
        // else 
        // {
        //     await this.props.database.ref(`${this.props.storeState.pokedexID}/pokemon/completion/${pokemonData.dexNumber}`).remove();
        // }
        // this.props.dispatch(UpdateCaughtPokemon(pokemonData))
        // await this.props.database.ref(`${this.props.storeState.pokedexID}/pokemon/caught`).set(this.props.storeState.pokemon.caught);
    }



    render()
    {
        return( 
        <div>
                <h1>Caught:{this.props.storeState.pokedex.pokemon.caught}/151</h1>
                <button onClick={this.testButtonClick}>Logout</button>
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

function mapStateToProps(state, ownProps) 
{
    return {
        storeState: state,
        database: state.database
    }
}

export default connect(mapStateToProps)(PokedexScreenMVP);