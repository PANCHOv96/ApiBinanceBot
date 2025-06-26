import axios from 'axios';

export async function sendLogger({ endpoint, loggerLocation, loggerMessage, symbol}){
    try{
        axios.get(`http://localhost:1236/logger?endpoint=${endpoint}&loggerLocation=${loggerLocation}&loggerMessage=${loggerMessage}&symbol=${symbol}`)
    }
    catch(error){
        console.log('REVENTO TELEGRAM API -- LOGGER')
    }
}
