import axios from 'axios';

export async function sendError({ endpoint, errorLocation, errorCode='', errorMessage }){
    try{
        await axios.get(`http://localhost:1236/error?endpoint=${endpoint}&errorLocation=${errorLocation}&errorCode=${errorCode}&errorMessage=${errorMessage}`,{
            timeout: 5000 // 5 segundos
        })
    }
    catch(error){
        console.log('REVENTO TELEGRAM API -- ERROR')
    }
}