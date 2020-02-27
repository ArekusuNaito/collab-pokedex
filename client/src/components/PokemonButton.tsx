import * as React from "react";
import Button from '@material-ui/core/Button';
import PokemonData from '../models/PokemonData'


//https://medium.com/innovation-and-technology/deciphering-typescripts-react-errors-8704cc9ef402
interface PokemonButtonProps   
{
    dexNumber: number,
    caught: boolean
    onClick: (Function:PokemonData)=>any
}

interface PokemonButtonState
{
    caught:boolean
}


export default class PokemonButton extends React.Component<PokemonButtonProps,PokemonButtonState>
{
    
    constructor(props)
    {
        super(props);
        
        this.internalClick = this.internalClick.bind(this);
        this.state=
        {
            caught:this.props.caught
        }
    }

    internalClick(event:any)
    {
        this.setState({caught:!this.state.caught},()=>this.props.onClick({dexNumber:this.props.dexNumber,caught:this.state.caught}));
        
    }
    render()
    {
        return <div>
            <h1>{this.state.caught.toString()}</h1>
            <Button variant="contained" color="primary" onClick={this.internalClick}>{this.props.dexNumber}</Button>
        </div>
    }
}