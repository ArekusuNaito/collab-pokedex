//Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography';
import * as React from "react";
//CSS
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles(
    {
        appBar: 
        {
            flexGrow: 1,
            display: "flex",
        },
        menuButton: 
        {
            marginRight: theme.spacing(10),
        },
        title: 
        {
            flexGrow: 1,
        },
        offset: theme.mixins.toolbar,
    }),
);


//Logic

interface Props
{
    canLogout: boolean
    title: string
    openHamburgerMenu?:()=>void
    onLogOutClick?:()=>void
    enableHamburgerMenu?:boolean
    
}
//On purpose doing this as a function component
export default function PokedexAppBar(props:Props)
{
    //defaults
    const styles = useStyles();
    props.enableHamburgerMenu=(props.enableHamburgerMenu)?true:false

    
    let logOutButton = <></>;
    //Create Hamburger Menu
    let hamburgerMenu = <IconButton className={styles.menuButton}  onClick={props.openHamburgerMenu} edge="start" color="inherit" aria-label="menu">
        <MenuIcon />
    </IconButton>
    //
    if (props.canLogout)
    {
        logOutButton = 
            <IconButton onClick={props.onLogOutClick} edge="start" color="inherit" aria-label="menu">
                <ExitToAppIcon />
            </IconButton>
            
    }
    return(
        <div className={styles.appBar}>
            <AppBar position="fixed">
                <Toolbar>
                    {props.enableHamburgerMenu && hamburgerMenu}
                    <Typography className={styles.title} variant="h5">
                        {props.title}
                    </Typography>
                    {logOutButton}
                </Toolbar>
            </AppBar>
            {/* The following 👇 adds an empty space for the fixed appbar */}
            <div className={styles.offset} /> 
        </div>
    );
}