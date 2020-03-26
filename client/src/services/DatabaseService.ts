import PokemonData from '../models/PokemonData';

//Facade/Proxy for the Firebase Database
export class PokedexDatabase 
{
    private firebaseDatabase:firebase.database.Database;
    private usersPath = 'users'
    private pokedexesPath = "pokedexes";
    private usersRef:firebase.database.Reference
    private pokedexesRef: firebase.database.Reference
    private emptyPokedexTemplate =
    {
        id:null,
        name: "<EMPTY>",
        pokemon:
        {
            caught: 1,
            completion: {"4":true}
        },
        users: []
    }
    constructor()
    {
        // super()
    }
    setDatabase(database:firebase.database.Database)
    {
        this.firebaseDatabase=database;
        this.usersRef = this.firebaseDatabase.ref(`${this.usersPath}`);
        this.pokedexesRef = this.firebaseDatabase.ref(`${this.pokedexesPath}`);
    }
    async createUser(user:firebase.User):Promise<boolean>
    {
        return new Promise<boolean>(async resolve=>
        {
            console.assert(user, `User doesn't exist`);
            const userExists = await this.userExists(user);
            if (!userExists) {
                const userRef = this.firebaseDatabase.ref(`${this.usersPath}/${user.uid}`);
                const userData =
                {
                    email: user.email
                }
                await userRef.set(userData);
                console.log('User creation complete');
                resolve(true)

            }
            else {
                console.error('User already exists');
                resolve(false)
                //User already exists for some reason
                //Handle it when this problem surges
            }
        })
        
    }

    async getPokedex(pokedexID:string,user:firebase.User)
    {
        return new Promise<any>(async (resolve,reject)=>
        {
            try
            {
                const snapshot = await this.pokedexesRef.child(pokedexID).once('value');
                if(snapshot.exists())
                {
                    resolve(snapshot.val())
                }
                else 
                {
                    console.log(`The Pokedex Data ${pokedexID} doesn't exist`);
                    
                    resolve(null)
                }

            }catch(error)
            {
                console.error(`Can't retrieve Pokedex Data ${pokedexID}: ${error}`);
                
            }
        })
    }

    //Use this function if you are doing all the update on the client and you just want to update the Pokemon Object
    async updateCaughtPokemonClient(pokedexID:string,pokemonObject:Object,user:firebase.User)
    {
        return new Promise<boolean>(async (resolve, reject) => 
        {
            try 
            {
                await this.pokedexesRef.child(`${pokedexID}/pokemon`).set(pokemonObject);    
                resolve(true);
            }
            catch (error) 
            {
                resolve(false)
            }

        }); 
    }

    async updateCaughtPokemonServer(pokedexID:string,pokemonData:PokemonData,user:firebase.User)
    {
        return new Promise<boolean>(async (resolve,reject)=>
        {
            try
            {
                const snapshot = await this.pokedexesRef.child(pokedexID).once('value');
                if (snapshot.exists()) {
                    //pokedex: {id,name,pokemon{caught,completion:{}}}
                    const pokedexRef = snapshot.ref;
                    const completionRef = pokedexRef.child(`pokemon/completion`);
                    if (pokemonData.caught) //add it as true
                    {

                        await completionRef.child(`${pokemonData.dexNumber}`).set(true);
                    }
                    else //delete it from the database
                    {
                        await completionRef.child(`${pokemonData.dexNumber}`).remove();
                    }
                    const newCompletion:Object = (await completionRef.once('value')).val()
                    const count = Object.keys(newCompletion).length; 
                    await pokedexRef.child(`pokemon/caught`).set(count);
                    resolve(true);
                }
            }
            catch(error)
            {
                resolve(false)
            }
            
        }); 
    }

    async getUserPokedexesIDs(user:firebase.User)
    {
        return new Promise<any>(async (resolve,reject) => 
        {
            try
            {
                const snapshot = await this.usersRef.child(`${user.uid}/pokedexes`).once('value');
                if(snapshot.exists())
                {
                    const pokedexes = snapshot.val(); //=> { {}, {} }
                    resolve(snapshot.val());    
                }
                resolve({}) //send empty array
                
            }catch(error)
            {
                reject(`User doesn't have any pokedex ${error}`)
            }
        })
    }

    private async userExists(user:firebase.User):Promise<boolean>
    {
        const userRef = this.firebaseDatabase.ref(`${this.usersPath}/${user.uid}`);
        const userSnapshot =  await userRef.once('value');
        const exists = userSnapshot.exists();
        
        
        return new Promise((resolve) => resolve(exists));
        
    }
    async joinPokedex(pokedexID:string,user:firebase.User):Promise<any>
    {
        console.assert(pokedexID,'No Pokedex Name');
        console.assert(user, 'No User Name');
        return new Promise<any>(async resolve=>
        {
            try
            {
                const userExists = await this.userExists(user);
                if (userExists) {
                    //Get the pokedexName to add it to the user's table/doc
                    const pokedexName = await (await this.pokedexesRef.child(`${pokedexID}/name`).once('value')).val()
                    const addedSuccessfully = await this.addPokedexToUserObject(pokedexID, pokedexName, user);
                    if (addedSuccessfully) {
                        //Now add the user to the pokedex user list
                        const pokedexRef = this.pokedexesRef.child(`${pokedexID}`)
                        const pokedexSnapshot = await pokedexRef.once('value');
                        const pokedexExists = pokedexSnapshot.exists();
                        if (pokedexExists) {
                            const userList: string[] = pokedexSnapshot.child('users').val();
                            //But, are you already in this pokedex?
                            const joinedAlready = userList.some(userEmail => userEmail === user.email);
                            if (!joinedAlready) //Cool, we just add it
                            {
                                userList.push(user.email);
                                await pokedexRef.child('users').set(userList);
                                let pokedex = (await pokedexRef.once('value')).val();
                                pokedex.id = pokedexID;
                                resolve(pokedex);
                            }
                            else //Huh. You can't join the same pokedex, dude.
                            {
                                resolve(null);
                            }
                        }
                        else //Doesn't exist error
                        {
                            resolve(null);
                        }

                    }
                    else {
                        resolve(null);
                    }

                }
                else {
                    resolve(null); //How can you join if the user doesn't exist?
                }
            }catch(error)
            {
                resolve(null)
            }
        })
    }

    pokemonDataObservable(pokedexID:string, callback:(snapshot:firebase.database.DataSnapshot)=>void):void
    {
        this.pokedexesRef.child(`${pokedexID}/pokemon`).on('value',callback);
    }

    private async addPokedexToUserObject(pokedexKey:string,pokedexName:string,user:firebase.User):Promise<boolean>
    {
        return new Promise<boolean>(async resolve=>
        {
            //Should we consider that the user has already been checked?
            //---
            const userPokedexesRef = this.firebaseDatabase.ref(`${this.usersPath}/${user.uid}/pokedexes`)
            const userPokedexesSnapshop = await userPokedexesRef.once('value')
            //Pre-create the object we will push
            let newPokedexValue={}
            newPokedexValue[pokedexKey] = pokedexName; //{"-Mhagbsn1gg":"My KantoDex"}
            //If there's no list of pokedexes then, then cool, we can add this without any issues
            if (!userPokedexesSnapshop.exists()) 
            {

                
                userPokedexesRef.set(newPokedexValue);
                resolve(true);
            }
            else //Okay, let's check every entry if we know already
            {
                const pokedexes: Object = userPokedexesSnapshop.val();
                
                if (!pokedexes.hasOwnProperty(pokedexKey)) //we can join
                {
                    await userPokedexesRef.set({...pokedexes,...newPokedexValue}); //{ {"jasdhasd":"my pokedex"} , {"ahsjasd","My second pokedex"} }
                    resolve(true);
                }
                else //If exists, then we should not RE-Join
                {
                    resolve(false)
                }
            }
        })
    }

    async createPokedex(pokedexName:string,user:firebase.User):Promise<any>
    {
        return new Promise<any>(async resolve=>
        {
            //Does this pokedex exists already?            
            const pokedexExists = await this.pokedexExists(pokedexName);
            if (!pokedexExists) 
            {
                //Time to create it
                const emptyPokedex = {...this.emptyPokedexTemplate};
                emptyPokedex.name = pokedexName; //Override the name to the template
                emptyPokedex.users.push(user.email); //NoSQL likes redundancy
                const newPokedexRef = await this.pokedexesRef.push(emptyPokedex);
                const pokedexKey = newPokedexRef.key;
                emptyPokedex.id = pokedexKey; //also set the ID, since its very important
                //Now that we created it, we have to add it to the users object
                const didItWork = await this.addPokedexToUserObject(pokedexKey,pokedexName,user);
                if(didItWork)
                {
                    resolve(emptyPokedex);
                }
                else resolve(null);
                //if it didn't work, should we rollback/delete?
                
            }
            else //there's nothing to do
            {
                console.log('Database.CreatePokedex.Pokedex Already exists in the database');
                resolve(null);
            }
        })
        
    }

    private async pokedexExists(pokedexName:string):Promise<boolean>
    {
        return new Promise<boolean>(async resolve=>
        {
            
            const neededPokedexRef = this.pokedexesRef.child(pokedexName);
            const pokedexSnapshot = await neededPokedexRef.once('value');
            const exists = pokedexSnapshot.exists();
            return resolve(exists);
        })
    }

}

export default new PokedexDatabase();

