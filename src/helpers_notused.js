
export function getDaiReserves() {
    const dai = this.bridgevethreservecurrencies.find(item => item.currencyid == "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM")
    if (dai) {
        return dai.reserves
    }
}

export function getVrscReserves() {
    const dai = this.bridgevethreservecurrencies.find(item => item.currencyid == "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV")
    if (dai) {
        return dai.reserves
    }
}

export function getMkrReserves() {
    const dai = this.bridgevethreservecurrencies.find(item => item.currencyid == "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4")
    if (dai) {
        return dai.reserves
    }
}

export function getEthReserves() {
    const dai = this.bridgevethreservecurrencies.find(item => item.currencyid == "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X")
    if (dai) {
        return dai.reserves
    }
}

export function getPureTbtcReserves() {
    const dai = this.purereservecurrencies.find(item => item.currencyid == "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU")
    if (dai) {
        return dai.reserves
    }
}

export function getPureVrscReserves() {
    const dai = this.purereservecurrencies.find(item => item.currencyid == "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV")
    if (dai) {
        return dai.reserves
    }
}

export function getBridgeVarrrTbtcReserves() {
    const dai = this.bridgevarrrreservecurrencies.find(item => item.currencyid == "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU")
    if (dai) {
        return dai.reserves
    }
}

export function getBridgeVarrrVrscReserves() {
    const dai = this.bridgevarrrreservecurrencies.find(item => item.currencyid == "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV")
    if (dai) {
        return dai.reserves
    }
}

export function getBridgeVarrrVarrrReserves() {
    const dai = this.bridgevarrrreservecurrencies.find(item => item.currencyid == "iExBJfZYK7KREDpuhj6PzZBzqMAKaFg7d2")
    if (dai) {
        return dai.reserves
    }
}

export function getBridgeVarrrBridgeVethReserves() {
    const dai = this.bridgevarrrreservecurrencies.find(item => item.currencyid == "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx")
    if (dai) {
        return dai.reserves
    }
}

export function getReserveDaiPrice(reserves) {
    return parseFloat((this.getDaiReserves() / reserves).toFixed(6))
}

export function getReserveVrscPrice(reserves) {
    return parseFloat((this.getVrscReserves() / reserves).toFixed(6))
}

export function getReserveMkrPrice(reserves) {
    return parseFloat((this.getMkrReserves() / reserves).toFixed(6))
}

export function getReserveEthPrice(reserves) {
    return parseFloat((this.getEthReserves() / reserves).toFixed(6))
}

export function getPureReserveTbtcPrice(reserves) {
    return parseFloat((this.getPureTbtcReserves() / reserves).toFixed(6))
}

export function getPureReserveVrscPrice(reserves) {
    return parseFloat((this.getPureVrscReserves() / reserves).toFixed(6))
}

export function getBridgeVarrrReserveTbtcVethPrice(reserves) {
    return parseFloat((this.getBridgeVarrrTbtcReserves() / reserves).toFixed(6))
}

export function getBridgeVarrrReserveVrscPrice(reserves) {
    return parseFloat((this.getBridgeVarrrVrscReserves() / reserves).toFixed(6))
}

export function getBridgeVarrrReserveVarrrPrice(reserves) {
    return parseFloat((this.getBridgeVarrrVarrrReserves() / reserves).toFixed(6))
}

export function getBridgeVarrrReserveBridgeVethPrice(reserves) {
    return parseFloat((this.getBridgeVarrrBridgeVethReserves() / reserves).toFixed(6))
}

export function getrawmempool() {
    const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
            method: 'getrawmempool',
            params: [],
            id: 2
        }
    };
    this.sendRequestRPC(requestData)
        .then((response) => {
            this.mempool_res = response.data.result
            this.mempool_count = mempool_res.length
            // if( this.mempool_res.length > 0){
            this.rawtransaction = this.getrawtransaction(this.mempool_res[0])
            this.decodedrawtransaction = this.decoderawtransaction(this.rawtransaction)
            // }
        })
        .catch((error) => {
            this.mempool = error
        })
}

export function getTickerByCurrencyId(currencyId) {
    const currency = this.arr_currencies.find(item => item.currencyid === currencyId);
    if (currency) {
        return currency.ticker;
    }
    // If the currency ID is not found, you can return a default value or handle the situation accordingly.
    return "Currency not found";
}

export function fetchTransactionData(transactionId) {
    const requestConfigGetRawTransaction = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: { method: 'getrawtransaction', params: [], id: 1 }
    };

    requestConfigGetRawTransaction.data.params = [transactionId];
    return this.sendAxiosRequest(
        requestConfigGetRawTransaction.method,
        requestConfigGetRawTransaction.url,
        requestConfigGetRawTransaction.headers,
        requestConfigGetRawTransaction.data
    )
        .then((response) => {
            const requestConfigDecodeRawTransaction = {
                method: 'post',
                url: 'https://rpc.vrsc.komodefi.com/',
                headers: { 'Content-Type': 'application/json' },
                data: { method: 'decoderawtransaction', params: [], id: 1 }
            };
            requestConfigDecodeRawTransaction.data.params = [response.data.result];
            return this.sendAxiosRequest(
                requestConfigDecodeRawTransaction.method,
                requestConfigDecodeRawTransaction.url,
                requestConfigDecodeRawTransaction.headers,
                requestConfigDecodeRawTransaction.data
            ).then((response) => {
                return response.data.result;
            });
        });
}

export function sendRequest() {
    const requestConfigGetInfo = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: { method: 'getinfo', params: [], id: 1 }
    };
    this.sendAxiosRequest(
        requestConfigGetInfo.method,
        requestConfigGetInfo.url,
        requestConfigGetInfo.headers,
        requestConfigGetInfo.data
    )
        .then((response) => {
            const longestChain = response.data.result.longestchain;
            this.fetchBlockHash(longestChain);
        })
        .catch((error) => {
            console.error(error);
        });
}
export function getExplorerLink(blockHeight) {
    // Replace this URL with the actual explorer URL pattern
    const explorerBaseUrl = 'https://first.sink.cakeshop.dev/api/block/';
    return `${explorerBaseUrl}${blockHeight}`;
}

export function fetchBlockHash(longestChain) {
    const blockHeight = longestChain;
    const requestConfigGetBlockhash = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: { method: 'getblockhash', params: [blockHeight], id: 1 }
    };
    this.sendAxiosRequest(
        requestConfigGetBlockhash.method,
        requestConfigGetBlockhash.url,
        requestConfigGetBlockhash.headers,
        requestConfigGetBlockhash.data
    )
        .then((response) => {
            const blockHash = response.data.result;
            this.fetchBlocksAndProcess(this.processBlocks, blockHash);
        })
        .catch((error) => {
            console.error('Error fetching block hash:', error);
        });
}

export function fetchBlocksAndProcess(numBlocks, blockhash) {
    let currentBlockHash = blockhash;
    let blocksProcessed = 0;
    const requestConfigGetBlock = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: { method: 'getblock', params: [], id: 1 }
    };

    function processNextBlock() {
        if (blocksProcessed >= numBlocks) {
            return;
        }
        requestConfigGetBlock.data.params = [currentBlockHash, true];
        this.sendAxiosRequest(
            requestConfigGetBlock.method,
            requestConfigGetBlock.url,
            requestConfigGetBlock.headers,
            requestConfigGetBlock.data
        )
            .then((response) => {
                const block = response.data.result;
                const validationType = block.validationtype;
                if (validationType === 'stake') {

                    this.processStakeBlock(block);
                    blocksProcessed++;
                }

                currentBlockHash = block.previousblockhash;
                processNextBlock.call(this);
                // Call it with the correct this context
            })
            .catch((error) => {
                console.error('Error fetching block data:', error);
            });
    }

    processNextBlock.call(this); // Initial call
}

export function processStakeBlock(block) {
    const transactions = block.tx;
    let coinbaseRewardAddress = null;
    let stakingAmount = null;

    transactions.forEach((transactionId) => {
        this.fetchTransactionData(transactionId)
            .then((transaction) => {
                if (!coinbaseRewardAddress) {
                    const coinbaseReward = this.processTransactionCoinbase(transaction);
                    if (coinbaseReward) {
                        coinbaseRewardAddress = coinbaseReward.address;
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching transaction data:', error);
            });
    });

    transactions.forEach((transactionId) => {
        this.fetchTransactionData(transactionId)
            .then((transaction) => {
                if (coinbaseRewardAddress) {
                    const stakingReward = this.processTransactionStaking(
                        transaction,
                        coinbaseRewardAddress
                    );
                    if (stakingReward) {
                        stakingAmount = stakingReward.amount;
                        const blockReward = block.reward;
                        const newBlock = {
                            blockHeight: block.height,
                            blockHash: block.hash,
                            validationType: block.validationtype,
                            coinbaseRewardAddress: coinbaseRewardAddress,
                            stakingAmount: stakingAmount,
                            stakingAddress: stakingReward.address,
                            blockRewards: blockReward
                        };
                        this.blocks.push(newBlock);
                        console.log(newBlock);
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching transaction data:', error);
            });
    });
}

export function processTransactionCoinbase(transaction) {
    const vin = transaction.vin;
    const vout = transaction.vout;
    const isCoinbase = vin.length === 1 && vin[0].coinbase;

    if (isCoinbase) {
        let coinbaseRewardAddress = '';
        if (
            vout[0].scriptPubKey.addresses[0] === 'RCG8KwJNDVwpUBcdoa6AoHqHVJsA1uMYMR'
        ) {
            coinbaseRewardAddress = vout[0].scriptPubKey.addresses[1];
        } else {
            coinbaseRewardAddress = vout[0].scriptPubKey.addresses[0];
        }
        return { address: coinbaseRewardAddress };
    }
    return null;
}

export function processTransactionStaking(transaction, coinbaseRewardAddress) {
    const vin = transaction.vin;
    const vout = transaction.vout;

    try {
        const matchingVin = vin.find((v) => v.address === coinbaseRewardAddress);
        const matchingVout = vout.find((v) =>
            v.scriptPubKey.addresses.includes(coinbaseRewardAddress)
        );

        if (matchingVin && matchingVout) {
            const stakingAmount = matchingVout.value;
            return { amount: stakingAmount, address: coinbaseRewardAddress };
        }
    } catch (error) {
        for (const vinEntry of vin) {
            for (const voutEntry of vout) {
                if (
                    vinEntry.valueSat === voutEntry.valueSat &&
                    vinEntry.addresses &&
                    voutEntry.scriptPubKey.addresses &&
                    vinEntry.addresses.length === 1 &&
                    voutEntry.scriptPubKey.addresses.length === 1 &&
                    vinEntry.addresses[0] === voutEntry.scriptPubKey.addresses[0]
                ) {
                    return {
                        amount: vinEntry.value,
                        address: voutEntry.scriptPubKey.addresses[0]
                    };
                }
            }
        }
    }
    return null;
}

export function getrawtransaction(txid) {
    console.log("BLAH")
    const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
            method: 'getrawtransaction',
            params: [txid],
            id: 2
        }
    };
    this.sendRequestRPC(requestData)
        .then((response) => {
            console.log(response)
            this.res = response.data.result
        })
        .catch((error) => {
            return error
        })
}

export function decoderawtransaction(hex) {
    const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
            method: 'decoderawtransaction',
            params: [hex],
            id: 2
        }
    };
    this.sendRequestRPC(requestData)
        .then((response) => {
            this.decodedrawtransaction = response.data.result
        })
        .catch((error) => {
            this.mempool = error
        })
}

export default {

}