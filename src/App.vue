<template>
  <div id="verusvueapp">
    <h2> Bridge.vETH</h2>
    <v-table class="custom-font">
      <thead>
        <tr>
          <th>Reserve Currency</th>
          <th>Reserve / DAI</th>
          <th>Reserve / VRSC </th>
          <th>Reserve / MKR </th>
          <th>Reserve / ETH </th>
          <th>Bridge / Reserve</th>
          <th>Reserves</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(currency, index) in reservecurrencies" :key="index">
          <td>{{ getTickerByCurrencyId(currency.currencyid) }}</td>
          <td>{{ new Intl.NumberFormat().format(getReserveDaiPrice(currency.reserves)) }} DAI</td>
          <td>{{ new Intl.NumberFormat().format(getReserveVrscPrice(currency.reserves)) }} VRSC</td>
          <td>{{ getReserveMkrPrice(currency.reserves) }} MKR</td>
          <td>{{ getReserveEthPrice(currency.reserves) }} ETH</td>
          <td>{{ parseFloat(currency.priceinreserve.toFixed(6)) }}</td>
          <td>{{ new Intl.NumberFormat().format(parseFloat(currency.reserves.toFixed(3))) }}</td>
          <td>{{ currency.weight }}</td>
        </tr>
      </tbody>
    </v-table>
    <!-- <div>
      Latest block: {{ latestblock }}
    </div> -->
    <h3>VRSC Mempool: Unconfirmed transactions</h3>
    <div v-if="mempool_res.length > 0">
      <ul>
        <v-list-item v-for="res in mempool_res"><a :href="explorertx + res">{{ res }}</a> | <a target="_blank" :href="explorertx + res">new tab</a></v-list-item>
      </ul>
    </div>
    <div v-else>
      No transactions waiting.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
export default {
  data() {
    return {
      explorertx: "https://insight.verus.io/tx/",
      latestblock: ref([]),
      reservecurrencies: ref([]),
      mempool: ref([]),
      mempool_res: ref([]),
      rawtransaction: ref([]),
      decodedrawtransaction: ref([]),
      mempool_count: ref(0),
      res: ref([]),
      arr_currencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
        { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH" },
        { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH" }
      ]

    };
  },

  methods: {
    getLatestBlock() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getinfo',
          params: [],
          id: 3
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          console.log(response.data.result.blocks)
          // return response.data.result.blocks
          this.latestblock = response.data.result.blocks
        })
        .catch((error) => {
          this.latestblock = error
        })

    },
    getDaiReserves() {
      const dai = this.reservecurrencies.find(item => item.currencyid == "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM")
      if (dai) {
        return dai.reserves
      }
    },
    getVrscReserves() {
      const dai = this.reservecurrencies.find(item => item.currencyid == "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV")
      if (dai) {
        return dai.reserves
      }
    },
    getMkrReserves() {
      const dai = this.reservecurrencies.find(item => item.currencyid == "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4")
      if (dai) {
        return dai.reserves
      }
    },
    getEthReserves() {
      const dai = this.reservecurrencies.find(item => item.currencyid == "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X")
      if (dai) {
        return dai.reserves
      }
    },
    getReserveDaiPrice(reserves) {
      return parseFloat((this.getDaiReserves() / reserves).toFixed(6))
    },
    getReserveVrscPrice(reserves) {
      return parseFloat((this.getVrscReserves() / reserves).toFixed(6))
    },
    getReserveMkrPrice(reserves) {
      return parseFloat((this.getMkrReserves() / reserves).toFixed(6))
    },
    getReserveEthPrice(reserves) {
      return parseFloat((this.getEthReserves() / reserves).toFixed(6))
    },
    getTickerByCurrencyId(currencyId) {
      const currency = this.arr_currencies.find(item => item.currencyid === currencyId);
      if (currency) {
        return currency.ticker;
      }
      // If the currency ID is not found, you can return a default value or handle the situation accordingly.
      return "Currency not found";
    },
    sendRequestRPC(requestData) {
      return axios({
        method: requestData.method,
        url: requestData.url,
        headers: requestData.headers,
        data: requestData.data
      });
    },
    decoderawtransaction(hex) {
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
    },
    getrawtransaction(txid) {
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
          this.res =  response.data.result
        })
        .catch((error) => {
          return error
        })
    },
    getrawmempool() {
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
    },
    getbridgecurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['Bridge.vETH'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.reservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    sendRequest() {
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
    },
    getExplorerLink(blockHeight) {
      // Replace this URL with the actual explorer URL pattern
      const explorerBaseUrl = 'https://first.sink.cakeshop.dev/api/block/';
      return `${explorerBaseUrl}${blockHeight}`;
    },
    fetchBlockHash(longestChain) {
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
    },
    fetchBlocksAndProcess(numBlocks, blockhash) {
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
    },
    fetchTransactionData(transactionId) {
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
    },
    processStakeBlock(block) {
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
    },
    processTransactionCoinbase(transaction) {
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
    },
    processTransactionStaking(transaction, coinbaseRewardAddress) {
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
    },
    sendAxiosRequest(method, url, headers, data) {
      return axios({
        method: method,
        url: url,
        headers: headers,
        data: data
      });
    }

  },
  mounted() {
    // this.sendRequest();
    this.getbridgecurrency();
    this.getrawmempool()
  }
};
</script>
<style scoped>
:root {

  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.custom-font{
  font-family: sans-serif;
  font-size: 15px;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #777;
}

body {
  margin: 550;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h2 {
  font-size: 3.2em;
  line-height: 1.1;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.card {
  padding: 2em;
}


#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}


@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }

  a:hover {
    color: #747bff;
  }

  button {
    background-color: #f9f9f9;
  }
}
</style>