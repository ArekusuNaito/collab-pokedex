
//When using electron you can use fs in your code.
//But you have to add the 
//target: "electron@esnext", electron target in the fuse file.
//If not, use browser.
let fs = require('fs');
console.log(fs);
//
import * as React from "react";
import {render}  from 'react-dom'
import {HashRouter,Route,Switch} from 'react-router-dom';
//React redux
import {Provider} from 'react-redux';
import {connect} from 'react-redux';





//Redux
import { createStore } from 'redux'
import appReducer from './redux/reducers';
//Redux actions
import { CatchPokemon } from './redux/actions';

//Don't forget, that thanks to the provider, you can connect your props to your components

function mapStateToProps(state)
{
    console.log('Mapping  state to props!',state);
    return{
        isThisAwesome: state.isEverythingCool   
    }
}


//Actual code starts here
let initialState =
{
    isEverythingCool: false,
    isExpensive: false   
}

function JustAComponent(props)
{
    //You can see the HashRouter history is here.
    //You can access the history,location,match
    console.log(props); //
    
    return(
        <h1>Well, apparently this works!!</h1>
    )
}

function Error404()
{
    return (
        <h1>404: THERE ARE NOT SECRETS HERE!</h1>
    )
}

let mappedAndConnectedComponent = connect(mapStateToProps)(JustAComponent);


const store = createStore(appReducer,initialState)



//Using the hash router because of electron
render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path='/' component={mappedAndConnectedComponent} />
                <Route path='*' component={Error404}/>
            </Switch>
        </HashRouter>
    </Provider>, document.getElementById("app"));

