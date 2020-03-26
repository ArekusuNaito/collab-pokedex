import * as React from "react";
import {render}  from 'react-dom'
import {BrowserRouter,Route,Switch,Redirect,Link} from 'react-router-dom';
//React redux
import initialState from './initialState.json'
import {Provider} from 'react-redux';
//UI
import PokedexScreenMVP from './screens/PokedexMVP'
import AuthenticationScreen from './screens/AuthScreen'
//Redux
import { createStore, applyMiddleware } from 'redux'
import appCombinedReducers from './redux/reducers';
import promiseMiddleware from 'redux-promise'
import {SetAuthenticationObject, SetPokedexDatabaseObject} from './redux/actions'
//Firebase
import * as firebase from "firebase"; //probably fuse-box requires to not have the "* as" import
import pokedexDatabase from './services/DatabaseService';

connectToFirebase()
pokedexDatabase.setDatabase(firebase.database());
const auth = firebase.auth();
function connectToFirebase()
{
    const firebaseConfig = {
        //Private data
    };
    firebase.initializeApp(firebaseConfig); 
    
    
}

function Error404()
{
    return (
        <h1>404: THERE ARE NOT SECRETS HERE!</h1>
    )
}

// const store = createStore(appCombinedReducers,loadState())
// const store = createStore(appCombinedReducers,initialState)
const store = createStore(appCombinedReducers, initialState, applyMiddleware(promiseMiddleware))
//Subscribe listeners
// store.subscribe(()=>console.info('New Store State:',store.getState()))

console.log('Initial State', store.getState(),initialState);
store.subscribe(() => console.info('New Store State:', store.getState()))
//Add the authentication and database immediatly to the store so they can be available
store.dispatch(SetAuthenticationObject(auth));
store.dispatch(SetPokedexDatabaseObject(pokedexDatabase));

//Create and test private routing and auto-redirect

const PrivatePokedexRoute = ({...rest }) =>
{
    return <Route {...rest} render={(props) => 
    {
        //props.location: {hash,pathname,search,state}
        //props.history: {push}
        
        if (auth.currentUser) 
        {            
            return <PokedexScreenMVP {...props} pokemonPerRow={3} />
        }
        else 
        {
            return <Redirect to='/sign' />
        }
    }}/>
} 
    
    


render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/sign" render={(props) => <AuthenticationScreen {...props} />}/>
                <PrivatePokedexRoute path='/home' />
                {/* <Route exact path='/home' render={(props) => <PokedexScreenMVP {...props} pokemonPerRow={3} />} />  */}
                <Route path='*' component={Error404}/>
            </Switch>
        </BrowserRouter>
    </Provider>, document.getElementById("app"));

