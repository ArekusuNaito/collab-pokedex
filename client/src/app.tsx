import * as React from "react";
import {render}  from 'react-dom'
import {HashRouter,Route,Switch} from 'react-router-dom';
//React redux
import initialState from './initialState.json'
import {Provider} from 'react-redux';
import {connect} from 'react-redux';
//UI
import PokedexScreenMVP from './screens/pokedex-mvp'
//Redux
import { createStore } from 'redux'
import appCombinedReducers from './redux/reducers';
//Storage
import {loadState,saveState} from './services/persistence-service';
//Sockets
// import io from 'socket.io-client';
//IMPORTANT NOTE: For some reason I needed to install punycode in order for this to work on the client
const serverURL = 'localhost:8888/'
const socket = connectToSocketServer();

function connectToSocketServer()
{
    
    const socket = io(serverURL); //Connect to the server
    console.log('Connect to sockets...');
    return socket;
}

//Don't forget, that thanks to the provider, you can connect your props to your components

function Error404()
{
    return (
        <h1>404: THERE ARE NOT SECRETS HERE!</h1>
    )
}

// const store = createStore(appCombinedReducers,loadState())
// const store = createStore(appCombinedReducers,initialState)
const store = createStore(appCombinedReducers,initialState)
//Subscribe listeners
// store.subscribe(()=>console.info('New Store State:',store.getState()))

console.log('Initial State', store.getState(),initialState);
store.subscribe(() => console.info('New Store State:', store.getState()))

//Saving data: Still unsure if this is the best place to do it.
store.subscribe(()=>
{
    console.info('Saving State to localStorage');
    saveState(store.getState());
})

function createPokedexMVP(socket)
{
    return <PokedexScreenMVP socket={socket} pokemonPerRow={3}/>
}

//If you want to use your own render component, you have to use the render prop for the Route Component
const pokedex = createPokedexMVP(socket);

//Using the hash router because of electron
render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                {/* <Route exact path='/' component={PokedexScreenMVP} /> */}
                <Route exact path='/' render={(props) => pokedex} /> 
                <Route path='*' component={Error404}/>
            </Switch>
        </HashRouter>
    </Provider>, document.getElementById("app"));

