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
            // Looks good without the margin. If needed, use it again. Just in case
            // marginRight: theme.spacing(10),
        },
        title: 
        {
            flexGrow: 1,
            textAlign: "center"
        },
        offset: theme.mixins.toolbar,
    }),
);


//Logic

interface Props
{
    
    title: string
    openHamburgerMenu?:()=>void
    enableHamburgerMenu?:boolean
    endSection?: JSX.Element
    
}
//On purpose doing this as a function component; to reinfornce my knowledge.
export default function PokedexAppBar(props:Props)
{
    //defaults
    const styles = useStyles();
    props.enableHamburgerMenu=(props.enableHamburgerMenu)?true:false
    props.endSection = props.endSection?props.endSection:<></>
    //Create Hamburger Menu
    let hamburgerMenuIcon = <IconButton className={styles.menuButton}  onClick={props.openHamburgerMenu} edge="start" color="inherit" aria-label="menu">
        <MenuIcon />
    </IconButton>
    return(
        <div className={styles.appBar}>
            <AppBar position="fixed" className={styles.appBar}>
                <Toolbar>
                    {props.enableHamburgerMenu && hamburgerMenuIcon}
                    <Typography className={styles.title} variant="h5">
                        {props.title}
                    </Typography>
                    {props.endSection}
                </Toolbar>
            </AppBar>
            {/* The following 👇 adds an empty space for the fixed appbar */}
            <div className={styles.offset} /> 
        </div>
    );
}