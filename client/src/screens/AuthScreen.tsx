import * as React from "react";
import { connect } from 'react-redux';
//Custom containers
import AuthenticationContainer from '../components/AuthenticationContainer'
import FirstTimePokedexContainer from '../components/FirstTimePokedexContainer';
import SelectPokedexContainer from '../components/SelectPokedexContainer';
//Actions
//Database
import {LoginUser, LogoutUser, JoinPokedex, CreatePokedex, SetPokedexData} from '../redux/actions'
import {PokedexDatabase} from '../services/DatabaseService';
import PokedexAppBar from '../components/PokedexAppBar';
//CSS
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';

const styles=
{
    loginSection:
    {
        flexGrow: 1,
        margin: "2% 10%"
    },
}


interface Props
{
    auth:firebase.auth.Auth;
    database: PokedexDatabase
    joinPokedex: (pokedexName: string, user:firebase.User) => {}
    createPokedex: (pokedexName: string) => {}
    loginUser: (user:firebase.User)=>{}
    logoutUser: ()=>{}
    setPokedexData: (pokedexID:string)=>void
    user: firebase.User;
    pokedexID: string
    history: any
    classes: any
}
// export default class AuthenticationScreen extends React.Component<Props>
class AuthenticationScreen extends React.Component<Props>
{
    email: any
    password: any
    pokedexName:any
    pokedexDictionary:Object
    constructor(props) 
    {
        super(props)
        //Section bind this
        this.signIn = this.signIn.bind(this);
        this.createUser = this.createUser.bind(this);
        this.createPokedex = this.createPokedex.bind(this);
        this.joinPokedex = this.joinPokedex.bind(this);
        this.goToPokedexes = this.goToPokedexes.bind(this);
        //Section references
        this.pokedexName = React.createRef()
        console.warn(props);
        
    }



    async componentDidMount()
    {      
        // this.props.auth.onAuthStateChanged(async user => {
        //     if (user) 
        //     {
        //         this.pokedexDictionary = await this.props.database.getUserPokedexesIDs(user);
        //         this.props.loginUser(user);

        //     }
        //     else {
        //         console.log('Logout detected');
        //         this.props.logoutUser();
        //     }
        // })
    }

    async signIn(email:string,password:string)
    {
        
        console.warn('email',email,'password',password);
        
        this.props.auth.signInWithEmailAndPassword(email,password)
        .then(async credential=>
        {
            // console.log('then, loggeado', credential);
            this.pokedexDictionary = await this.props.database.getUserPokedexesIDs(credential.user);
            this.props.loginUser(credential.user)
            
        })
        .catch(error => 
        {
            console.log(error);

        })
        
    }

    async signOut()
    {
        this.props.logoutUser();
    }

    async createUser(email:string,password:string)
    {
        console.log('create user');
        this.props.auth.createUserWithEmailAndPassword(email,password)
        //Passwords should at least be 6 characters
        .then(async userCredential=>
        {
            await this.props.database.createUser(userCredential.user);
        })
        .catch(error=>
        {
            //User already exists
            console.error(error.message,error.code);
        })
    }

    async joinPokedex(pokedexID:string)
    {
        await this.props.joinPokedex(pokedexID,this.props.user);
        if (this.props.pokedexID) this.props.history.push('/home');
        
    }

    async createPokedex(pokedexID:string)
    {
        console.log('Auth.CreatePokedex');
        
        await this.props.createPokedex(pokedexID);
        if (this.props.pokedexID) this.props.history.push('/home');
    }

    async goToPokedexes(pokedex:{id:string,name:string})
    {

        await this.props.setPokedexData(pokedex.id);
        this.props.history.push('/home');
    }

    openHamburgerMenu()
    {
        console.log('Hamburger menu');
        
    }

    render()
    {
        let componentToRender=<></>;
        let title:string="";
        let canLogout=false;
        
        if(!this.props.user) 
        {
            title="Login"
            componentToRender = 
            <AuthenticationContainer
            signIn={this.signIn}
            createUser={this.createUser} />
        }
        else //But does this user has any pokedexes?
        {
            canLogout=true;
            if(Object.keys(this.pokedexDictionary).length>0) //
            {
                
                title="Select a Pokedex";                
                componentToRender=<SelectPokedexContainer 
                items={this.pokedexDictionary}
                onItemClick={this.goToPokedexes.bind(this)}
                />
            }
            else //You are not part of a pokedex. Let's take you to one
            {                
                title = "First Time Settings"
                componentToRender = <FirstTimePokedexContainer
                    joinPokedex={this.joinPokedex}
                    createPokedex={this.createPokedex}
                />
            }
            
        }
        
        return(
        <>
            <PokedexAppBar title={title} canLogout={canLogout} 
                onLogOutClick={this.signOut.bind(this)}
                // enableHamburgerMenu={true}
                
            />
            <>
                {componentToRender}
            </>
        </>
        )
        
    }

    


}

function mapStateToProps(state, ownProps) 
{
    return {
        auth: state.auth,
        database: state.database,
        user: state.user,
        pokedexID: state.pokedexID
    }
}

//Note: You can't use the props you created in mapStateToProps
function mapDispatchToProps(dispatch,ownProps)
{
    return{
        dispatch
    }
}

function mergeProps(propsFromState,propsFromDispatch,ownProps)
{
    const dispatch = propsFromDispatch.dispatch; //Getting the actual dispatch function to use it on the merge function
    const user = propsFromState.user;
    const database = propsFromState.database;
    return{
        loginUser: (user: firebase.User) => {
            console.assert(user, `User is not logged in`);
            if (user) {
                dispatch(LoginUser(user))
            }

        },
        logoutUser: () => dispatch(LogoutUser()),
        createPokedex: async (pokedexName: string) => 
        {            
            dispatch(await CreatePokedex(pokedexName,user,database))
        },
        joinPokedex: async (pokedexName:string)=>
        {
            dispatch(await JoinPokedex(pokedexName,user,database))
        },
        setPokedexData: async (pokedexID:string)=>dispatch(await SetPokedexData(pokedexID,user,database)),
        auth: propsFromState.auth,
        user: propsFromState.user,
        database: propsFromState.database,
        history: ownProps.history
    }
    
}

const styledComponent = withStyles(styles)(AuthenticationScreen);
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(styledComponent);


//CSS
