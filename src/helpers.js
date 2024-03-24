import axios from 'axios'

const RPCHOST = 'https://rpc.vrsc.komodefi.com'
async function sendAxiosRequest(method, url, headers, data) {
    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data
    })
}

export async function sendRequest(daemonMethod, methodParams = [], methodId = 1) {
    const requestConfigGetInfo = {
        method: 'post',
        url: RPCHOST,
        headers: { 'Content-Type': 'application/json' },
        data: { method: daemonMethod, params: methodParams, id: methodId }
    };
    try{
    sendAxiosRequest(
        requestConfigGetInfo.method,
        requestConfigGetInfo.url,
        requestConfigGetInfo.headers,
        requestConfigGetInfo.data
    )
        .then((response) => {
            // console.log(response)
            return response
            // const longestChain = response.data.result.longestchain;
            // this.fetchBlockHash(longestChain);
        })
        .catch((error) => {
            console.error(error);
        });
    } catch(error){
        console.log("error")
    }
}

export function getCurrency(currencyName) {
    const res = sendRequest("getcurrency", [currencyName])
    console.log(res)
    return res
    // return res.result.bestcurrencystate.reservecurrencies
}

export default {
    getCurrency
}