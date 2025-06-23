import 'dotenv/config.js'
const { 
  API_KEY_TESNET, 
  API_SECRET_TESNET, 
  API_KEY_ONLINE,
  API_SECRET_ONLINE
} = process.env

export const DATA = {
    online:{
      API_KEY:API_KEY_ONLINE, 
      API_SECRET:API_SECRET_ONLINE, 
      base_url:{
        USDM: 'https://fapi.binance.com',
        COINM: 'https://dapi.binance.com'
      }
    },
    tesnet:{
      API_KEY:API_KEY_TESNET, 
      API_SECRET:API_SECRET_TESNET, 
      base_url: 'https://testnet.binancefuture.com',
    },
    url:{
        USDM:{
          obtenerPrecio: '/fapi/v1/ticker/price',
          ordenes: '/fapi/v1/order',
          cerrarOrdenes: '/fapi/v1/allOpenOrders',
          posicionesAbiertas: '/fapi/v3/positionRisk'
        },
        COINM:{
          obtenerPrecio: '/dapi/v2/ticker/price',
          ordenes: '/dapi/v1/order',
          cerrarOrdenes: '/dapi/v1/allOpenOrders',
          posicionesAbiertas: '/dapi/v1/positionRisk'
        }
    },
}
