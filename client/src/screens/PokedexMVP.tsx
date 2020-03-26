import * as React from "react";
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import PokemonCard from '../components/PokemonCard';
import { UpdateCaughtPokemon,SetPokedexData, UpdatePokemonCompletion } from '../redux/actions'
import { LogoutUser } from '../redux/actions'
//models
import PokemonData from '../models/PokemonData'
import { PokedexDatabase } from '../services/DatabaseService';
import PokedexAppBar from '../components/PokedexAppBar';
import HamburgerMenu from '../components/HamburgerMenu';
// 
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

//Research use-effect, use-state in react


interface State
{
    openMenu:boolean
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
        this.logOut = this.logOut.bind(this)
        
        this.state=
        {
            openMenu:false,
            pokemonList:[]
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

    async logOut()
    {        
        this.props.dispatch(LogoutUser());
        this.props.auth.signOut();
        this.props.history.push('/sign');
    }

    async componentDidMount()
    {
        console.log('PokedexMVP Did mount');
        
        
        await this.getKantoPokemonData();
        //The callback function is called whenever the value on the pokedex completion changes!
        this.props.database.pokemonDataObservable(this.props.storeState.pokedex.id,snapshot=>
        {
            try
            {
                // console.log('Algo ha cambiado',snapshot.val());
                this.props.dispatch(UpdatePokemonCompletion(snapshot.val()))
                
            }catch(error)
            {
                console.error(`Can't update database`,error);
                
            }
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
            
            return (
                <Grid className={"width: 25%"} item key={"grid" + dexNumber} xs={this.getRowSize()}>
                    {/* <PokemonButton caught={caughtState} onClick={this.updatePokemonData} key={dexNumber} dexNumber={dexNumber} /> */}
                    <PokemonCard onClick={this.updatePokemonData} key={dexNumber} dexNumber={dexNumber} />
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

    openHamburgerMenu()
    {
        console.warn('Opening Ham!');
        this.setState((prevState)=>
        {
            return { openMenu: !prevState.openMenu };
            
        })

        
    }

    onClose(event: React.MouseEvent)
    {
        this.setState((prevState) => {
            return { openMenu: false };

        })
    }

    render()
    {
        const endSection = <Typography variant="h5">
            {`Caught:${this.props.storeState.pokedex.pokemon.caught}/151`}
        </Typography>
        const logoutButton = 
            <IconButton onClick={null} edge="start" color="inherit" aria-label="menu">
                <ExitToAppIcon />
            </IconButton>
    
        return( 
        <>
            <HamburgerMenu open={this.state.openMenu}
                onClose={this.onClose.bind(this)}
            />
            <PokedexAppBar title="Pokedex"
                openHamburgerMenu={this.openHamburgerMenu.bind(this)}
                enableHamburgerMenu={true}
                endSection={endSection}
            />
            <Grid
                container
                direction="row"
                spacing={3}>
                {this.createPokemonButtons()}
            </Grid>
        </>)
        
        
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