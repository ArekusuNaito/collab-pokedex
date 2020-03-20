import * as React from 'react';
import List  from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

interface Props
{
    items:Object
    onItemClick:(pokedex:{id:string,name:string})=>void
}

export default class SelectPokedexContainer extends React.Component<Props>
{
    constructor(props)
    {
        super(props)        
    }
    render()
    {
        const createListItems = (items:Object)=>
        {
            const listItems = []
            for(const pokedexID in items)
            {
                console.log(pokedexID,items[pokedexID]);
                const pokedexName:string = items[pokedexID];
                listItems.push(
                    <ListItem button key={pokedexID} onClick={() => this.props.onItemClick({id:pokedexID,name:pokedexName})}>
                        <ListItemText primary={[pokedexName]} />
                    </ListItem>
                );
            }
            return listItems;
        }
        const items = createListItems(this.props.items)
        return (
        <>
            <h1>hey</h1>
            <List component="nav">
                {items}
            </List>
        </>
        )
        
    }
}