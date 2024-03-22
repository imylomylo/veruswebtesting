<template>
  <div id="verusvueapp">
    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="BRIDGEVETH" v-bind:webLink="bridgevethwebsite"
      v-bind:explorerLink="verusexplorer" v-bind:supply="bridgevethsupply" v-bind:bestHeight="bridgevethbestheight"
      v-bind:reserveCurrencies="bridgevethreservecurrencies" />
    <p v-else>{{ BRIDGEVETH }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <VerusBasket v-bind:fullyQualifiedName="BRIDGEVARRR" v-bind:webLink="bridgevarrrwebsite"
      v-bind:explorerLink="varrrexplorer" v-bind:supply="bridgevarrrsupply" v-bind:bestHeight="bridgevarrrbestheight"
      v-bind:reserveCurrencies="bridgevarrrreservecurrencies" />

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="PURE" v-bind:explorerLink="verusexplorer"
      v-bind:supply="puresupply" v-bind:bestHeight="purebestheight" v-bind:reserveCurrencies="purereservecurrencies" />
    <p v-else>{{ PURE }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }} blocks
        to go</span></p>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="SWITCH" v-bind:explorerLink="verusexplorer"
      v-bind:supply="switchsupply" v-bind:bestHeight="switchbestheight"
      v-bind:reserveCurrencies="switchreservecurrencies" />
    <p v-else>{{ SWITCH }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import VerusBasket from './VerusBasket.vue'
export default {
  components: {
    VerusBasket
  },
  data() {
    return {
      BRIDGEVETH: 'Bridge.vETH',
      BRIDGEVARRR: 'Bridge.vARRR',
      PURE: 'Pure',
      SWITCH: 'Switch',
      explorertx: "https://insight.verus.io/tx/",
      veruslatestblock: ref(),
      veruslongestchain: ref(),
      verusSyncOK: ref(false),
      verusBlocksRemaining: ref(0),
      bridgevethreservecurrencies: ref(),
      bridgevethbestheight: ref(),
      bridgevethsupply: ref(),
      bridgevethwebsite: "https://verus.io/eth-bridge",
      verusexplorer: "https://insight.verus.io",
      purereservecurrencies: ref(),
      purebestheight: ref(),
      puresupply: ref(),
      bridgevarrrreservecurrencies: ref(),
      bridgevarrrbestheight: ref(),
      bridgevarrrsupply: ref(),
      bridgevarrrwebsite: "https://varrr.piratechain.com",
      varrrexplorer: "https://varrrexplorer.piratechain.com",
      switchreservecurrencies: ref(),
      switchbestheight: ref(),
      switchsupply: ref(),
      mempool: ref([]),
      mempool_res: ref([]),
      rawtransaction: ref([]),
      decodedrawtransaction: ref([]),
      mempool_count: ref(0),
      res: ref([]),
      operationsBridgeVeth: [],
      relativeOperationsBridgeVeth: [],
      operationsBridgeVarrr: [],
      relativeOperationsBridgeVarrr: [],
      operationsPure: [],
      relativeOperationsPure: [],
      PURE: "PURE",
      BRIDGEVETH: "Bridge.vETH",
      BRIDGEVARRR: "Bridge.vARRR",
      arr_currencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
        { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH" },
        { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH" },
        { "currencyid": "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU", "ticker": "tBTC" },
        { "currencyid": "iExBJfZYK7KREDpuhj6PzZBzqMAKaFg7d2", "ticker": "vARRR" },
        { "currencyid": "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "ticker": "Bridge.vETH" },
        { "currencyid": "i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "ticker": "Switch" },
        { "currencyid": "i61cV2uicKSi1rSMQCBNQeSYC3UAi9GVzd", "ticker": "vUSDC.vETH" },
        { "currencyid": "iC5TQFrFXSYLQGkiZ8FYmZHFJzaRF5CYgE", "ticker": "EURC.vETH" },
        { "currencyid": "iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "ticker": "Pure" }
      ]

    };
  },
  methods: {
    clear(lp) {
      if( lp === this.PURE ){
        this.operationsPure = []
        this.relativeOperationsPure = []
      }
      else if( lp === this.BRIDGEVETH ){
        this.operationsBridgeVeth = []
        this.relativeOperationsBridgeVeth = []
      }
      else if( lp === this.BRIDGEVARRR ){
        this.operationsBridgeVarrr = []
        this.relativeOperationsBridgeVarrr = []
      }
    },
    getCurrencyTicker(lpcurrencies, currency) {
      return lpcurrencies.find(item => item.currencyid === currency.currencyid).ticker
    },
    getCellClassPure(currencyBase, currencyRel) {
      if (currencyBase.currencyid === currencyRel.currencyid) {
        return ''
      }

      if(currencyRel === this.PURE){
        return this.operationsPure[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsPure[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
      }

      // the row is the base currency, it devalues when 
      if (this.operationsPure[currencyBase.currencyid]) {
        if (this.relativeOperationsPure[currencyRel.currencyid] != '') {
          return this.relativeOperationsPure[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsPure[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
        }
      }
      // rel currency e.g. dai price of asset
      if (this.operationsPure[currencyRel.currencyid]) {
        return this.operationsPure[currencyRel.currencyid] === 'add' ? 'light-green' : this.operationsPure[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
      }
    },
    getCellClassBridgeVarrr(currencyBase, currencyRel) {
      if (currencyBase.currencyid === currencyRel.currencyid) {
        return ''
      }

      if(currencyRel === this.BRIDGEVARRR){
        return this.operationsBridgeVarrr[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBridgeVarrr[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
      }

      // the row is the base currency, it devalues when 
      if (this.operationsBridgeVarrr[currencyBase.currencyid]) {
        if (this.relativeOperationsBridgeVarrr[currencyRel.currencyid] != '') {
          return this.relativeOperationsBridgeVarrr[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsBridgeVarrr[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
        }
      }
      // rel currency e.g. dai price of asset
      if (this.operationsBridgeVarrr[currencyRel.currencyid]) {
        return this.operationsBridgeVarrr[currencyRel.currencyid] === 'add' ? 'light-green' : this.operationsBridgeVarrr[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
      }
    },
    getCellClassBridgeVeth(currencyBase, currencyRel) {
      if (currencyBase.currencyid === currencyRel.currencyid) {
        return ''
      }

      if(currencyRel === this.BRIDGEVETH){
        return this.operationsBridgeVeth[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBridgeVeth[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
      }

      // the row is the base currency, it devalues when added
      if (this.operationsBridgeVeth[currencyBase.currencyid]) {
        if (this.relativeOperationsBridgeVeth[currencyRel.currencyid] != '') {
          return this.relativeOperationsBridgeVeth[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsBridgeVeth[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
        }
      }
      // rel currency e.g. increases when base is added
      if (this.operationsBridgeVeth[currencyRel.currencyid]) {
        return this.operationsBridgeVeth[currencyRel.currencyid] === 'add' ? 'light-green' : this.operationsBridgeVeth[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
      }
    },
    getCellClass(currencyBase, currencyRel) {
      if (currencyBase.currencyid === currencyRel.currencyid) {
        return ''
      }

      // the row is the base currency, it devalues when 
      if (this.operations[currencyBase.currencyid]) {
        if (this.relativeOperations[currencyRel.currencyid] != '') {
          return this.relativeOperations[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperations[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
        }
      }
      // rel currency e.g. dai price of asset
      if (this.operations[currencyRel.currencyid]) {
        return this.operations[currencyRel.currencyid] === 'add' ? 'light-green' : this.operations[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
      }
    },
    getOperation(currencyid) {
      // console.log(currencyid)
      // console.log(this.operations)
      // console.log(this.relativeOperations)
      if (this.relativeOperations[currencyid] != '') {
        return this.relativeOperations[currencyid] === 'add' ? 'light-green' : this.relativeOperations[currencyid] === 'remove' ? 'light-red' : ''
      }
      else if (this.operations[currencyid] != '') {
        return this.operations[currencyid] === 'add' ? 'light-green' : this.operations[currencyid] === 'remove' ? 'light-red' : ''
      }
    },
    evaluateChanges(lp, reserveCurrenciesFromBCS, basketsCurrencies, addOrRemove, liquidityReserve, liquidityAmount) {
      if (addOrRemove.length == 0 || liquidityAmount.length == 0 || liquidityReserve.length == 0) {
        return
      }
      this.clear(lp)
      let operations = Array()
      let relativeOperations = Array()
      if (addOrRemove === "add") {
        operations[liquidityReserve] = "add"
        const relativeArray = {};
        basketsCurrencies.forEach(currency => {
          if (currency.currencyid !== liquidityReserve) {
            relativeArray[currency.currencyid] = "remove";
          }
        });

        relativeOperations = relativeArray
        basketsCurrencies.find(item => item.currencyid == liquidityReserve)
        let reservesAdd = reserveCurrenciesFromBCS.find(item => item.currencyid == liquidityReserve).reserves
        let reservesNewAmount = parseFloat(reservesAdd) + parseFloat(liquidityAmount)
        reserveCurrenciesFromBCS.find(item => item.currencyid == liquidityReserve).reserves = reservesNewAmount
      }
      else if (addOrRemove === "remove") {
        operations[liquidityReserve] = "remove"
        const relativeArray = {};
        basketsCurrencies.forEach(currency => {
          if (currency.currencyid !== liquidityReserve) {
            relativeArray[currency.currencyid] = "add";
          }
        });

        relativeOperations = relativeArray
        basketsCurrencies.find(item => item.currencyid == liquidityReserve)
        let reservesAdd = reserveCurrenciesFromBCS.find(item => item.currencyid == liquidityReserve).reserves
        let reservesNewAmount = parseFloat(reservesAdd) - parseFloat(liquidityAmount)
        reserveCurrenciesFromBCS.find(item => item.currencyid == liquidityReserve).reserves = reservesNewAmount
      }
      if( lp === "PURE" ){
        console.log("it is PURE")
        this.purereservecurrencies = reserveCurrenciesFromBCS
        this.operationsPure = operations
        this.relativeOperationsPure = relativeOperations
      }
      else if ( lp === "Bridge.vETH" ){
        this.bridgevethreservecurrencies = reserveCurrenciesFromBCS
        this.operationsBridgeVeth = operations
        this.relativeOperationsBridgeVeth = relativeOperations
      }
      else if ( lp === "Bridge.vARRR" ){
        this.bridgevarrrreservecurrencies = reserveCurrenciesFromBCS
        this.operationsBridgeVarrr = operations
        this.relativeOperationsBridgeVarrr = relativeOperations
      }
    },
    evaluateBridgeVeth() {
      this.evaluateChanges(this.BRIDGEVETH, this.bridgevethreservecurrencies, this.bridgevethcurrencies, this.addOrRemoveLiquidityBridgeVeth, this.liquidityBridgeVethReserve, this.liquidityBridgeVethAmount)
    },
    evaluatePure() {
      this.evaluateChanges(this.PURE, this.purereservecurrencies, this.purecurrencies, this.addOrRemoveLiquidityPure, this.liquidityPureReserve, this.liquidityPureAmount)
    },
    evaluateBridgeVarrr() {
      this.evaluateChanges(this.BRIDGEVARRR, this.bridgevarrrreservecurrencies, this.bridgevarrrcurrencies, this.addOrRemoveLiquidityBridgeVarrr, this.liquidityBridgeVarrrReserve, this.liquidityBridgeVarrrAmount)
    },
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
          console.log(this.verusSyncOK)
          // return response.data.result.blocks
          this.veruslatestblock = response.data.result.blocks
          this.veruslongestchain = response.data.result.longestchain
          this.verusBlocksRemaining = this.veruslongestchain - this.veruslatestblock
          if (this.veruslatestblock == this.veruslongestchain) {
            this.verusSyncOK = true
            console.log(this.verusSyncOK)

          }
        })
        .catch((error) => {
          this.veruslatestblock = error
        })

    },
    sendRequestRPC(requestData) {
      return axios({
        method: requestData.method,
        url: requestData.url,
        headers: requestData.headers,
        data: requestData.data
      });
    },
    getBridgeVethCurrency() {
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
          this.bridgevethreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.bridgevethbestheight = response.data.result.bestheight
          this.bridgevethsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getPureCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['Pure'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.responsePureBestCurrencyState = response.data.result.bestcurrencystate
          this.purereservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.purebestheight = response.data.result.bestheight
          this.puresupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getBridgeVarrrCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.varrr.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['Bridge.vARRR'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.responseBridgeVarrrBestCurrencyState = response.data.result.bestcurrencystate
          this.bridgevarrrreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.bridgevarrrbestheight = response.data.result.bestheight
          this.bridgevarrrsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getSwitchCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['Switch'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.switchreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.switchbestheight = response.data.result.bestheight
          this.switchsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
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
  async mounted() {
    // this.sendRequest();
    this.getLatestBlock()
    this.getBridgeVethCurrency()
    this.getPureCurrency()
    this.getBridgeVarrrCurrency()
    this.getSwitchCurrency()
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

.custom-font {
  font-family: sans-serif;
  font-size: 15px;
}

.light-green {
  background-color: lightgreen;
}

.light-red {
  background-color: lightcoral;
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