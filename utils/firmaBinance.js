import axios from 'axios'
import crypto from 'crypto'
import { sendError } from './errorHandler.js';

// FUNCIONES 
export async function signedRequest(method,data_base = {},base_url, endpoint, params = {}) {
    const timestamp = Date.now();
    params.timestamp = timestamp;

    const query = new URLSearchParams(params).toString();
    const signature = crypto
        .createHmac('sha256', data_base.api_secret)
        .update(query)
        .digest('hex');

    const url = `${base_url}${endpoint}?${query}&signature=${signature}`;
    console.log('url: ',url)

    try {
        const res = await axios({
            method,
            url,
            headers: {
                'X-MBX-APIKEY': data_base.api_key,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return res.data;
    } catch (err) {
        console.error('Error en la solicitud:', err.response?.data || err.message);
        const error = { code: err.response?.data?.code , msg: err.response?.data?.msg || err.message}
        throw new Error(JSON.stringify(error));
    }
}