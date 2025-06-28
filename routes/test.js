import { Router } from "express";
import { DATA } from '../utils/data.js';
import { signedRequest } from '../utils/firmaBinance.js'
import { sendLogger } from '../utils/loggerHandler.js'
import { sendError } from '../utils/errorHandler.js'

export const TestConnection = Router()

const data_base = {
                api_key:DATA.tesnet.API_KEY,
                api_secret:DATA.tesnet.API_SECRET
            }

const base_url = DATA.tesnet.base_url;

// ✅ Rutas Disponibles
TestConnection.get('/',async (req,res)=>{
    res.status(200).json(
        {
            'RUTAS DISPONIBLES':{
                "OBTENER PRECIO": "/obtener-precio", 
                "TRADE NUEVO": "/iniciar-trade-nuevo", 
                "ELIMINAR / REDUCIR POSICION": "/eliminar-reducir-trade", 
                "TRAILING STOP": "/trailingstop-trade", 
                "CERRAR ORDENES": "/cerrar-ordenes", 
                "POSICIONES ABIERTAS": "/posiciones-abiertas"
            }
        }
    )
})

// ✅ Obtener precio de un par COIN-M
TestConnection.get('/obtener-precio',async (req,res)=>{
    try{
        const symbol = req.query.symbol
        if (symbol){
            const params = {
            symbol // Por ejemplo, "BTCUSD"
        };
        const nameContract = req.query.nameContract;
        const result = await signedRequest(
            'GET',
            data_base,
            base_url,
            DATA.url[nameContract].obtenerPrecio, 
            params
            );
        sendLogger({
            endpoint:"/obtener-precio",
            loggerLocation: 'ApiBinanceBot',
            loggerMessage: 'Operación exitosa',
            symbol,
        });
        res.status(200).json(
            {
                result: {
                    symbol: result.symbol,
                    price: parseFloat(result.price) 
                }
            }
        )
        }else{
            const msg = 'envio de datos incorrectos';
            sendError({
                endpoint:"/obtener-precio",
                errorLocation: 'ApiBinanceBot',
                errorMessage: msg
            });
            res.status(404).send({ error: msg })
        }
    }
    catch(error){
        const errorMsg = JSON.parse(error.message)
        sendError({
            endpoint:"/obtener-precio",
            errorLocation: 'ApiBinanceBot',
            errorCode: errorMsg?.code || '',
            errorMessage: errorMsg?.msg || ''
        });
        res.status(404).send({ error: 'envio de datos incorrectos'})
    }
})

// ✅ New Trade de un par COIN-M
TestConnection.post('/iniciar-trade-nuevo',async (req,res)=>{
    try{
        const { nameContract, symbol, type, side, quantity} = req.body;
        if (symbol && type && side && quantity){
            const params = {
                symbol, 
                type,
                side,
                quantity
            };
            const result = await signedRequest(
                'POST',
                data_base,
                base_url,
                DATA.url[nameContract].ordenes, 
                params
                );
            sendLogger({
                endpoint:"/iniciar-trade-nuevo",
                loggerLocation: 'ApiBinanceBot',
                loggerMessage: 'Operación exitosa',
                symbol,
            });
            res.status(200).json(
                {
                    result: 'OK'
                }
            )
        }else{
            const msg = 'envio de datos incorrectos';
            sendError({
                endpoint:"/iniciar-trade-nuevo",
                errorLocation: 'ApiBinanceBot',
                errorMessage: msg
            });
            res.status(404).send({ error: msg })
        }
    }
    catch(error){
        const errorMsg = JSON.parse(error.message)
        sendError({
            endpoint:"/iniciar-trade-nuevo",
            errorLocation: 'ApiBinanceBot',
            errorCode: errorMsg?.code || '',
            errorMessage: errorMsg?.msg || ''
        });
        res.status(404).send({ error: 'envio de datos incorrectos'})
    }
})

// ✅ Eliminar/Reducir trade de un par COIN-M
TestConnection.post('/eliminar-reducir-trade',async (req,res)=>{
    try{
        const { nameContract, symbol, type, side, quantity, priceLimit} = req.body;
        if (symbol && type && side && quantity){
            const params = {
                symbol, 
                type,
                side,
                quantity,
                reduceOnly:true
            };
            if(priceLimit > 0){
                params.price = priceLimit;
                params.timeInForce= 'GTC';
            }
            const result = await signedRequest(
                'POST',
                data_base,
                base_url,
                DATA.url[nameContract].ordenes, 
                params
                );
            sendLogger({
                endpoint:"/eliminar-reducir-trade",
                loggerLocation: 'ApiBinanceBot',
                loggerMessage: 'Operación exitosa',
                symbol,
            });
            res.status(200).json(
                {
                    result: 'OK'
                }
            )
        }else{
            const msg = 'envio de datos incorrectos';
            sendError({
                endpoint:"/eliminar-reducir-trade",
                errorLocation: 'ApiBinanceBot',
                errorMessage: msg
            });
            res.status(404).send({ error: msg })
        }
    }
    catch(error){
        const errorMsg = JSON.parse(error.message)
        sendError({
            endpoint:"/eliminar-reducir-trade",
            errorLocation: 'ApiBinanceBot',
            errorCode: errorMsg?.code || '',
            errorMessage: errorMsg?.msg || ''
        });
        // throw new Error(error)
        res.status(404).json(error)
    }
})

// ✅ Reducir trailingStop de un par COIN-M
TestConnection.post('/trailingstop-trade',async (req,res)=>{
    try{
        const { nameContract, symbol, side, quantity, stopPrice} = req.body;
        if (symbol && side && quantity && stopPrice){
            const params = {
                symbol,
                type:"STOP_MARKET",
                stopPrice,
                side,
                quantity,
                closePosition: true,
            };
            const result = await signedRequest(
                'POST',
                data_base,
                base_url,
                DATA.url[nameContract].ordenes, 
                params
                );
            sendLogger({
                endpoint:"/trailingstop-trade",
                loggerLocation: 'ApiBinanceBot',
                loggerMessage: 'Operación exitosa',
                symbol,
            });
            res.status(200).json(
                {
                    result: result
                }
            )
        }else{
            const msg = 'envio de datos incorrectos';
            sendError({
                endpoint:"/trailingstop-trade",
                errorLocation: 'ApiBinanceBot',
                errorMessage: msg
            });
            res.status(404).send({ error: msg })
        }
    }
    catch(error){
        const errorMsg = JSON.parse(error.message)
        sendError({
            endpoint:"/trailingstop-trade",
            errorLocation: 'ApiBinanceBot',
            errorCode: errorMsg?.code || '',
            errorMessage: errorMsg?.msg || ''
        });
        res.status(404).send({ error: 'envio de datos incorrectos'})
    }
})

// ✅ Cerrar todas Ordenes de un par COIN-M
TestConnection.delete('/cerrar-ordenes',async (req,res)=>{  
    try{
        const symbol = req.body.symbol
        if (symbol){
            const params = {
                symbol // Por ejemplo, "BTCUSD"
            };
            const nameContract = req.body.nameContract;
            const result = await signedRequest(
                'DELETE',
                data_base,
                base_url,
                DATA.url[nameContract].cerrarOrdenes, 
                params
                );
            sendLogger({
                endpoint:"/cerrar-ordenes",
                loggerLocation: 'ApiBinanceBot',
                loggerMessage: 'Operación exitosa',
                symbol,
            });
            res.status(200).json(
                {
                    result: 'OK'
                }
            )
        }else{
            const msg = 'envio de datos incorrectos';
            sendError({
                endpoint:"/cerrar-ordenes",
                errorLocation: 'ApiBinanceBot',
                errorMessage: msg
            });
            res.status(404).send({ error: msg })
        }
    }
    catch(error){
        const errorMsg = JSON.parse(error.message)
        sendError({
            endpoint:"/cerrar-ordenes",
            errorLocation: 'ApiBinanceBot',
            errorCode: errorMsg?.code || '',
            errorMessage: errorMsg?.msg || ''
        });
        res.status(404).send({ error: 'envio de datos incorrectos'})
    }
})

// ✅ Posiciones abiertas de un par COIN-M
TestConnection.get('/posiciones-abiertas',async (req,res)=>{
    try{
        const symbol = req.query.symbol
        if (symbol){
            const params = {
                symbol // Por ejemplo, "BTCUSD"
            };
            const nameContract = req.query.nameContract;
            const result = await signedRequest(
                'GET',
                data_base,
                base_url,
                DATA.url[nameContract].posicionesAbiertas, 
                params
                );
            var resultado = result.find(x => x.symbol == params.symbol)
            sendLogger({
                endpoint:"/posiciones-abiertas",
                loggerLocation: 'ApiBinanceBot',
                loggerMessage: 'Operación exitosa',
                symbol,
            });
            res.status(200).json(
                {
                    result: resultado ? parseFloat(resultado.positionAmt) : 0
                }
            )
        }else{
            const msg = 'envio de datos incorrectos';
            sendError({
                endpoint:"/posiciones-abiertas",
                errorLocation: 'ApiBinanceBot',
                errorMessage: msg
            });
            res.status(404).json({ error: msg })
        }
    }
    catch(error){
        const errorMsg = JSON.parse(error.message)
        sendError({
            endpoint:"/posiciones-abiertas",
            errorLocation: 'ApiBinanceBot',
            errorCode: errorMsg?.code || '',
            errorMessage: errorMsg?.msg || ''
        });
        res.status(404).json({ error: 'envio de datos incorrectos'})
    }
})
