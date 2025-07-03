import axios from 'axios';

export async function sendLogger({ endpoint, loggerLocation, loggerMessage, symbol}){
    try{
        await axios.get(`http://localhost:1236/logger?endpoint=${endpoint}&loggerLocation=${loggerLocation}&loggerMessage=${loggerMessage}&symbol=${symbol}`,{
            timeout: 5000 // 5 segundos
        })
    }
    catch(error){
        console.log('REVENTO TELEGRAM API -- LOGGER')
    }
}
