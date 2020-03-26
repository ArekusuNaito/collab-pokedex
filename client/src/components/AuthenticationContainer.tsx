import * as React from 'react';
import { Button, withStyles, createStyles} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography'
//Icons
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';





const childStyle =
{
    // backgroundColor: "tomato", //debug
    alignSelf: "center",
    // padding: "10px 5px",
    width: "100%",
    margin: "1%"
}
let styles = createStyles(
{
    parent:
    {
        display: "flex",
        margin: "10% 25%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
        "& > *": childStyle,
    },
    title:
    {
        
    }
    // child: childStyle
    
})

interface Props
{
    signIn: (email:string,password:string)=>void
    createUser: (email:string,password:string)=>void
    classes: any
}

class AuthenticationContainer extends React.Component<Props>
{
    email: any
    password: any
    constructor(props)
    {
        super(props)
        this.email=React.createRef();
        this.password = React.createRef();
    }
    handleSubmit(event:Event)
    {
        event.preventDefault();
        this.executeSignIn()
    }
    executeSignIn()
    {
        this.props.signIn(this.email.current.value, this.password.current.value)
    }
    createEmailInput():JSX.Element
    {        
        return(
            <FormControl>
                <InputLabel htmlFor="emailInput">Email</InputLabel>
                <Input
                    id="emailInput"
                    inputMode="email"
                    inputRef={this.email}
                    defaultValue="naito@kernel.com"
                    startAdornment={
                        <InputAdornment position="start">
                            <EmailIcon />
                        </InputAdornment>
                    }
                />
            </FormControl>
        )
    }
    createPasswordInput(): JSX.Element
    {
       return  (
            <FormControl>
            <InputLabel htmlFor="passwordInput">Password</InputLabel>
            <Input
                id="passwordInput"
                type='password'
                defaultValue='momonga'
                inputRef={this.password}
                       startAdornment={
                           <InputAdornment position="start">
                               <LockIcon />
                           </InputAdornment>
                       }
                // endAdornment={
                //     <InputAdornment position="end">
                //         <IconButton
                //             aria-label="toggle password visibility"
                //             onClick={handleClickShowPassword}
                //             onMouseDown={handleMouseDownPassword}
                //         >
                //             {values.showPassword ? <Visibility /> : <VisibilityOff />}
                //         </IconButton>
                //     </InputAdornment>
                
            />
        </FormControl>
        )
    }
    
    render()
    {
        
        return(
            <form onSubmit={this.handleSubmit.bind(this)} noValidate className={this.props.classes.parent}>
                <Typography align="center" variant="h4">Authenticate</Typography>
                {this.createEmailInput()}
                {this.createPasswordInput()}
                <Button color="secondary" variant="contained" type="submit" onClick={this.executeSignIn.bind(this)}>Sign In</Button>
                <Button color="secondary" variant="contained" onClick={() =>this.props.createUser(this.email.current.value, this.password.current.value)}>Sign Up</Button>
            </form>
        )
    }
}

export default withStyles(styles)(AuthenticationContainer);