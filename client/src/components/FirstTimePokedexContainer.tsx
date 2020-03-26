import * as React from 'react';
import { Button } from '@material-ui/core';


interface Props 
{
    joinPokedex: (pokedexID: string) => Promise<void>
    createPokedex: (pokedexID: string) => Promise<void>

}

export default class AuthenticationContainer extends React.Component<Props>
{
    pokedexID:any
    constructor(props)
    {
        super(props);
        this.pokedexID = React.createRef();
    }
    render()
    {
        return(
            <>
                <Button onClick={async () => await this.props.createPokedex(this.pokedexID.current.value)}>Create Pokedex</Button>
                <br />
                <Button onClick={async()=>await this.props.joinPokedex(this.pokedexID.current.value)}>Join Pokedex</Button>
                <br />
                <input type="text" ref={this.pokedexID}></input>
                <br />
            </>
        )
    }
}