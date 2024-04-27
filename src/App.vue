<template>
  <div id="verusvueapp">
    <div class="p-2">
      Dark/Light <input type="checkbox" value="garden" class="toggle theme-controller" />
    </div>
    <!-- <PriceInTbtc v-if="isExtras()" :pureTbtcReserves="pureTbtcReserves" :priceVrscDai="priceVrscDai"
      :pricesRelVrsc="pricesRelVrsc" /> -->

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="BRIDGEVETH" v-bind:webLink="bridgevethwebsite"
      v-bind:explorerLink="verusexplorer" v-bind:supply="bridgevethsupply" v-bind:bestHeight="bridgevethbestheight"
      v-bind:reserveCurrencies="bridgevethreservecurrencies" v-bind:currencyDictionary="currencyDictionary"
      v-bind:pureBasketPriceTbtcVrsc="pureTbtcVrsc"/>
    <p v-else>{{ BRIDGEVETH }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="KAIJU"
      v-bind:explorerLink="verusexplorer" v-bind:supply="kaijusupply" v-bind:bestHeight="kaijubestheight"
      v-bind:reserveCurrencies="kaijureservecurrencies" v-bind:currencyDictionary="currencyDictionary"/>
    <p v-else>{{ KAIJU }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-bind:fullyQualifiedName="BRIDGEVARRR" v-bind:webLink="bridgevarrrwebsite"
      v-bind:explorerLink="varrrexplorer" v-bind:supply="bridgevarrrsupply" v-bind:bestHeight="bridgevarrrbestheight"
      v-bind:reserveCurrencies="bridgevarrrreservecurrencies" v-bind:currencyDictionary="currencyDictionary" />

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="PURE" v-bind:explorerLink="verusexplorer"
      v-bind:supply="puresupply" v-bind:bestHeight="purebestheight" v-bind:reserveCurrencies="purereservecurrencies"
      v-bind:currencyDictionary="currencyDictionary" />
    <p v-else>{{ PURE }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }} blocks
        to go</span></p>

    <div class="divider"></div>


    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="SWITCH" v-bind:explorerLink="verusexplorer"
      v-bind:supply="switchsupply" v-bind:bestHeight="switchbestheight"
      v-bind:reserveCurrencies="switchreservecurrencies" v-bind:currencyDictionary="currencyDictionary" />
    <p v-else>{{ SWITCH }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import VerusBasket from './VerusBasket.vue'
import PriceInTbtc from './PriceInTbtc.vue'


export default {
  components: {
    VerusBasket,
    PriceInTbtc
  },
  data() {
    return {
      BRIDGEVETH: 'Bridge.vETH',
      BRIDGEVARRR: 'Bridge.vARRR',
      PURE: 'Pure',
      SWITCH: 'Switch',
      KAIJU: 'Kaiju',
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
      kaijureservecurrencies: ref(),
      kaijubestheight: ref(),
      kaijusupply: ref(),
      pureTbtcVrsc: ref(),
      res: ref([]),
      currencyDictionary: [
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
        { "currencyid": "iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "ticker": "Pure" },
        { "currencyid": "i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "ticker": "Kaiju"},
        { "currencyid": "i9oCSqKALwJtcv49xUKS2U2i79h1kX6NEY", "ticker": "vUSDT.vETH"},
      ]
    };
  },
  methods: {
    isExtras() {
      console.log(import.meta.env.VITE_EXTRAS)
      return parseInt(import.meta.env.VITE_EXTRAS)
    },
    prettySupply(lp) {
      if (lp === this.BRIDGEVETH) {
        return this.responseBridgeVethBestCurrencyState.supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    clear(lp) {
      if (lp === this.PURE) {
        this.operationsPure = []
        this.relativeOperationsPure = []
      }
      else if (lp === this.SWITCH) {
        console.log(this.SWITCH)
      }
      else if (lp === this.BRIDGEVETH) {
        this.operationsBridgeVethSend = []
        this.relativeOperationsBridgeVethSend = []
        this.operationsBridgeVethReceive = []
        this.relativeOperationsBridgeVethReceive = []
        this.receiveMessage = ''
      }
      else if (lp === this.BRIDGEVARRR) {
        this.operationsBridgeVarrr = []
        this.relativeOperationsBridgeVarrr = []
      }
    },
    getCurrencyTicker(lpcurrencies, currency) {
      return lpcurrencies.find(item => item.currencyid === currency.currencyid).ticker
    },
    getCellClassSwitch(currencyBase, currencyRel) {
      if (currencyBase.currencyid === currencyRel.currencyid) {
        return ''
      }

      if (currencyRel === this.SWITCH) {
        return this.operationsSwitch[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsSwitch[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
      }

      // the row is the base currency, it devalues when 
      if (this.operationsSwitch[currencyBase.currencyid]) {
        if (this.relativeOperationsSwitch[currencyRel.currencyid] != '') {
          return this.relativeOperationsSwitch[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsSwitch[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
        }
      }
      // rel currency e.g. dai price of asset
      if (this.operationsSwitch[currencyRel.currencyid]) {
        return this.operationsSwitch[currencyRel.currencyid] === 'add' ? 'light-green' : this.operationsSwitch[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
      }
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
          const vrscReserves = this.purereservecurrencies.find(item => item.currencyid == "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV").reserves
          const tbtcReserves = this.purereservecurrencies.find(item => item.currencyid == "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU").reserves
          this.pureTbtcVrsc = parseFloat(vrscReserves / tbtcReserves)
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
    getKaijuCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['Kaiju'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.kaijureservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.kaijubestheight = response.data.result.bestheight
          this.kaijusupply = response.data.result.bestcurrencystate.supply
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
    this.getKaijuCurrency()
  }
};
</script>
<style></style>