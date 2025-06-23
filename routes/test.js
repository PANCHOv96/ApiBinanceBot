import { Router } from "express";
import { DATA } from '../utils/data.js';
import { signedRequest } from '../utils/firmaBinance.js'

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
        if (req.query.symbol){
            const params = {
            symbol: req.query.symbol // Por ejemplo, "BTCUSD"
        };
        const nameContract = req.query.nameContract;
        const result = await signedRequest(
            'GET',
            data_base,
            base_url,
            DATA.url[nameContract].obtenerPrecio, 
            params
            );
        res.status(200).json(
            {
                result: {
                    symbol: result.symbol,
                    price: parseFloat(result.price) 
                }
            }
        )
        }else{
            res.status(404).send({ error: 'envio de datos incorrectos'})
        }
    }
    catch(error){
        console.log(`/obtener-precio ERROR: ${error}`)
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
            // if (result) {
            //     console.log(`Se creo la posicion del par ${params.symbol} correctamete`);
            // }
            res.status(200).json(
                {
                    result: 'OK'
                }
            )
        }else{
            res.status(404).send({ error: 'envio de datos incorrectos' })
        }
    }
    catch(error){
        console.log(`/iniciar-trade-nuevo ERROR: ${error}`)
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
            // if (result) {
            //     console.log(`El balance de la cuenta actualmentes es: `, result);
            // }
            res.status(200).json(
                {
                    result: 'OK'
                }
            )
        }else{
            res.status(404).send({ error: 'envio de datos incorrectos' })
        }
    }
    catch(error){
        console.log(`/eliminar-reducir-trade ERROR: ${error}`)
        res.status(404).send({ error: 'envio de datos incorrectos'})
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
            // const deletes = await signedRequest(
            //     'DELETE',
            //     data_base,
            //     DATA.tesnet.url.cerrarOrdenes, 
            //     {
            //         symbol: params.symbol
            //     }
            //     );
            const result = await signedRequest(
                'POST',
                data_base,
                base_url,
                DATA.url[nameContract].ordenes, 
                params
                );
            // if (result) {
            //     console.log(`El precio del trailing se del par ${params.symbol} modifico correctamente`);
            // }
            res.status(200).json(
                {
                    result: result
                }
            )
        }else{
            res.status(404).send({ error: 'envio de datos incorrectos' })
        }
    }
    catch(error){
        console.log(`/trailingstop-trade ERROR: ${error}`)
        res.status(404).send({ error: 'envio de datos incorrectos'})
    }
})

// ✅ Cerrar todas Ordenes de un par COIN-M
TestConnection.delete('/cerrar-ordenes',async (req,res)=>{  
    try{
        if (req.body.symbol){
            const params = {
                symbol: req.body.symbol // Por ejemplo, "BTCUSD"
            };
            const nameContract = req.body.nameContract;
            const result = await signedRequest(
                'DELETE',
                data_base,
                base_url,
                DATA.url[nameContract].cerrarOrdenes, 
                params
                );
            // if (result) {
            //     console.log(`Ordenes canceladas del par ${params.symbol}`);
            // }
            res.status(200).json(
                {
                    result: 'OK'
                }
            )
        }else{
            res.status(404).send({ error: 'envio de datos incorrectos' })
        }
    }
    catch(error){
        console.log(`/cerrar-ordenes ERROR: ${error}`)
        res.status(404).send({ error: 'envio de datos incorrectos'})
    }
})

// ✅ Posiciones abiertas de un par COIN-M
TestConnection.get('/posiciones-abiertas',async (req,res)=>{
    try{
        if (req.query.symbol){
            const params = {
                symbol: req.query.symbol // Por ejemplo, "BTCUSD"
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
            // if (result) {
            //     console.log(`Cantidad de posiciones abiertas en el par ${params.symbol}: `, 
            //     resultado ? Math.abs(parseFloat(resultado.positionAmt)) : 0);
            // }
            res.status(200).json(
                {
                    result: resultado ? parseFloat(resultado.positionAmt) : 0
                }
            )
        }else{
            res.status(404).send({ error: 'envio de datos incorrectos' })
        }
    }
    catch(error){
        console.log(`/posiciones-abiertas ERROR: ${error}`)
        res.status(404).send({ error: 'envio de datos incorrectos'})
    }
})
