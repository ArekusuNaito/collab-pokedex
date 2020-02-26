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


//Don't forget, that thanks to the provider, you can connect your props to your components

function mapStateToProps(state)
{
    // console.log('Mapping  state to props!',state);
    //Executes everytime states updates
    return{
        storeState:state,
        pokemonPerRow:3
    }
}

function Error404()
{
    return (
        <h1>404: THERE ARE NOT SECRETS HERE!</h1>
    )
}
let mappedAndConnectedScreen = connect(mapStateToProps)(PokedexScreenMVP);

const store = createStore(appCombinedReducers,loadState())
// const store = createStore(appCombinedReducers,initialState)
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


//Using the hash router because of electron
render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path='/' component={mappedAndConnectedScreen} />
                <Route path='*' component={Error404}/>
            </Switch>
        </HashRouter>
    </Provider>, document.getElementById("app"));

