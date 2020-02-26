const storeKey:string = 'store'
export function saveState(state:any)
{
    try
    {
        localStorage.setItem(storeKey,JSON.stringify(state))
    }catch(error){console.error('Error Saving data',error)}
}

export function loadState():{}
{
    try
    {
        const loadedStringState = localStorage.getItem(storeKey);
        if(loadedStringState)
        {
            return JSON.parse(loadedStringState);
        }
        else return undefined;
    } catch (error) { console.error('Error Loading data', error) }
}