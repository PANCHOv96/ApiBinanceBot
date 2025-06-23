import express, { json } from 'express'
import cors from 'cors'
import { mainRoutes } from '../ApiBinanceBot/routes/main.js';
import { OnlineConnection } from './routes/online.js';
import { TestConnection } from './routes/test.js';
import { errorRoutes } from '../ApiBinanceBot/routes/error.js';

export function createAPP({string}){
    const server = express();
    server.use(json())
    
    server.use(cors())
    server.get('/',mainRoutes)
    
    server.use('/online',OnlineConnection)
    server.use('/test',TestConnection)
    
    server.get('/*',errorRoutes)

    const PORT = process.env.PORT ?? 1234
    server.listen(PORT,()=>{
        console.log(string)
    })
}

createAPP({string:'API-BINANCE-BOT FUNCIONANDO'})
