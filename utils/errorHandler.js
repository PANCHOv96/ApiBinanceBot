import axios from 'axios';

export async function sendError({ endpoint, errorLocation, errorCode='', errorMessage }){
    try{
        axios.get(`http://localhost:1236/error?endpoint=${endpoint}&errorLocation=${errorLocation}&errorCode=${errorCode}&errorMessage=${errorMessage}`)
    }
    catch(error){
        console.log('REVENTO TELEGRAM API -- ERROR')
    }
}