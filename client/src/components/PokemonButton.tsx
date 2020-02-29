import * as React from "react";
import Button from '@material-ui/core/Button';
import PokemonData from '../models/PokemonData'
import { connect } from 'react-redux';


//https://medium.com/innovation-and-technology/deciphering-typescripts-react-errors-8704cc9ef402
interface PokemonButtonProps   
{
    dexNumber: number, //float dexNumber
    caught: boolean
    onClick: (Function:PokemonData)=>any
}

interface PokemonButtonState
{
    caught:boolean
}


class PokemonButton extends React.Component<PokemonButtonProps,PokemonButtonState>
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
        if(this.props.caught)
        {   
            return( <div>
                <h1 style={{color:"red"}}>{"Caught"}</h1>
                <Button variant="contained" color="primary" onClick={this.internalClick}>{this.props.dexNumber}</Button>
            </div>)
        }
        else
        {
            return (<div>
                <h1 style={{ color: "grey" }}>{"Not Caught"}</h1>
                <Button variant="contained" color="primary" onClick={this.internalClick}>{this.props.dexNumber}</Button>
            </div>)
        }

        
    }
}

//Remember this function executes everytime the state changes
function mapStateToProps(state, ownProps) 
{
    let caughtValue = (state.pokemon.completion.hasOwnProperty(ownProps.dexNumber))?true:false   
    return {
        caught: caughtValue,
    }
}

export default connect(mapStateToProps)(PokemonButton)