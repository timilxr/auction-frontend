// import { json } from 'body-parser';
import {useState} from 'react';


const useLocalStorage = (name, item) => {
    const [storedValue, setStoredValue] = useState(()=>{
        try {
            const result = localStorage.getItem(name);
            return result ? JSON.parse(result) : item;
        } catch (error) {
            console.log(`Error using localstorage: ${error.message}`);
        }
    });

    const saveItem = (value) => {
        try {
            const valueToStore =
        value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(name, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(`Error using localstorage: ${error.message}`);
        }
    }

    return [storedValue, saveItem];
    // localStorage.getItem(name);
}

export default useLocalStorage;