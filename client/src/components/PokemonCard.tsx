import * as React from "react";

import PokemonData from '../models/PokemonData'
// 
import Button from '@material-ui/core/Button';
// Card
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Card from '@material-ui/core/Card';
// 
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';

// CSS
import { createStyles,withStyles } from '@material-ui/core/styles';

const styles = createStyles(
{
    root:
    {
        // maxWidth: "25%"
    },
    media:
    {
        // An auto-resize
        height: 0,
        paddingTop: '56.25%'  //This makes it 16:9
    }
})

//https://medium.com/innovation-and-technology/deciphering-typescripts-react-errors-8704cc9ef402
interface PokemonButtonProps   
{
    dexNumber: number, //float dexNumber
    caught: boolean
    onClick: (Function:PokemonData)=>any
    classes: any
}

interface PokemonButtonState
{
    caught:boolean
}


class PokemonCard extends React.Component<PokemonButtonProps,PokemonButtonState>
{
    
    constructor(props)
    {
        super(props);
        // console.log('props',this.props);        
        this.internalClick = this.internalClick.bind(this);
    }

    internalClick(event:any)
    {
        this.props.onClick({dexNumber:this.props.dexNumber,caught:!this.props.caught});
    }
    render()
    {
        // if(this.props.caught)
        // {   
        //     return( <div>
        //         <h1 style={{color:"red"}}>{"Caught"}</h1>
        //         <Button variant="contained" color="primary" onClick={this.internalClick}>{this.props.dexNumber}</Button>
        //     </div>)
        // }
        // else
        // {
        //     return (<div>
        //         <h1 style={{ color: "grey" }}>{"Not Caught"}</h1>
        //         <Button variant="contained" color="primary" onClick={this.internalClick}>{this.props.dexNumber}</Button>
        //     </div>)
        // }
        return this.createButton();

        
    }

    private createButton()
    {
        return (
        <Card className={this.props.classes.root}>
            <CardActionArea onClick={this.internalClick}>
                    {this.createHeader()}
                    {this.createMedia()}
                    {this.createContent()}    
            </CardActionArea>
            {/* Card Actions */}
        </Card>)
    }
    private createMedia()
    {
        return(
            <CardMedia
                className={this.props.classes.media}
                // Place holder image 👇
                image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
                // image="/assets/images/ball.png"
                title="A Pokemon"
            />
        );
    }
    private createHeader()
    {
        //Probably a better idea is to use display:none
        const caughtIcon = (this.props.caught)?<CheckIcon/>:<></>;
        return(
            <CardHeader
             title = "Charmander"
             action={caughtIcon}

            /> 
        )
    }
    private createContent()
    {
        return (
            <CardContent>

            </CardContent>
        )
    }
}

//Remember this function executes everytime the state changes
function mapStateToProps(state, ownProps) 
{
    let caughtValue=false;
    if(state.pokedex.pokemon.completion) //Check if there's an empty pokedex
    {
        caughtValue = (state.pokedex.pokemon.completion.hasOwnProperty(ownProps.dexNumber)) ? true : false
    }
    return {
        caught: caughtValue,
    }
}

const styledComponent = withStyles(styles)(PokemonCard);
const connectedComponent = connect(mapStateToProps)(styledComponent)
export default connectedComponent;