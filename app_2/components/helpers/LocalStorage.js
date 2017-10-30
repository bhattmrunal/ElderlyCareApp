import { AsyncStorage,} from 'react-native';
import {
    Alert,
} from 'react-native';

export async function store(keyID, data)
{
    try{
        await AsyncStorage.setItem(keyID, data);
    }
    catch(error)
    {
        console.log("Error storing data:", error.toString());
    }
}

export async function fetch(keyID)
{
    try {
        const value = await AsyncStorage.getItem(keyID);
        if (value !== null){
            // We have data!!
            Alert.alert('Value=> '+value.toString());
            return value;
        }
    } catch (error) {
        console.log("Error fetching data:", error.toString());
    }
}
