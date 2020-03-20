import * as React from 'react';
import {Button} from '@material-ui/core';

interface Props
{
    signIn: (email:string,password:string)=>void
    createUser: (email:string,password:string)=>void
}

export default class AuthenticationContainer extends React.Component<Props>
{
    email: any
    password: any
    constructor(props)
    {
        super(props)
        this.email=React.createRef();
        this.password = React.createRef();
    }
    render()
    {
        return(
        <>
            <h1>Authentication</h1>
            <label>email</label>
            <input type="text" ref={this.email} defaultValue="naito@kernel.com"></input>
            <label>password</label>
            <input type="password"  ref={this.password} defaultValue="momonga"></input>
            <Button onClick={()=>this.props.signIn(this.email.current.value,this.password.current.value)}>Sign In</Button>
            <Button onClick={() =>this.props.createUser(this.email.current.value, this.password.current.value)}>Sign Up</Button>
            <br />
            <br />
        </>
        )
    }
}