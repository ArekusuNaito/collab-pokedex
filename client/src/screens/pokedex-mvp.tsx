import * as React from "react";
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import PokemonButton from '../components/PokemonButton';
import { UpdateCaughtPokemon,OverridePokemonState } from '../redux/actions'
//actions
//models
import PokemonData from '../models/PokemonData'

// import io from 'socket.io-client';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8888'


interface State
{
    pokemonList:number[],
}

interface Props
{
    //Important to add an interface to the store state in another file
    storeState?:{pokemon:{completion:{},caught:number}}
    pokemonPerRow:number,
    dispatch?: Function,
    socket: SocketIOClient.Socket;
}


class PokedexScreenMVP extends React.Component<Props,State>
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
        // const socket = io('http://localhost:8888');
        console.log(this.props);
        
        
    }
    

    async getKantoPokemonData()
    {
        const response = await axios.get(`/pokedex/kanto-la`);
        const serverState = response.data;
        console.log('axios pokedex',serverState);
        this.props.dispatch(OverridePokemonState(serverState.pokemon))
        let pokedexData:number[] = []
        for (let dexNumber = 1; dexNumber <= 151; dexNumber++) 
        {
            pokedexData.push(dexNumber);
        }
        this.setState({pokemonList: pokedexData})
        
    }

    async componentDidMount()
    {
        await this.getKantoPokemonData();
        //Socket listeners
        this.props.socket.on('pokemonUpdated',(pokemonData:PokemonData)=>
        {
            console.log(`Que crees que updatearon un Pokemondongo`, pokemonData);
            this.props.dispatch(UpdateCaughtPokemon(pokemonData))
            
        });
        this.props.socket.on('updateError',errorData=>
        {
            console.error(errorData);
        })
    }

    getRowSize():number
    {
        return 12/this.props.pokemonPerRow;
    }

    createPokemonButtons()
    {

        return this.state.pokemonList.map(dexNumber=>
        {
            const caughtState = (this.props.storeState.pokemon.completion.hasOwnProperty(dexNumber)) ? this.props.storeState.pokemon.completion[dexNumber]:false;

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
        this.props.socket.emit('updatePokemon',pokemonData);        
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

function mapStateToProps(state, ownProps) 
{
    return {
        storeState: state,
        socket: ownProps.socket
    }
}

export default connect(mapStateToProps)(PokedexScreenMVP);