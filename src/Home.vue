<template>
  <!-- <router-link to="/bridge-veth">bridge.veth link</router-link> -->
  <div class="p-2">
    Dark/Light <input type="checkbox" value="garden" class="toggle theme-controller" />
  </div>
  <div class="p-2">Binance prices: BTCUSD: {{ parseFloat(binance_btcusd).toFixed(2) }} , ETHUSD: {{
    parseFloat(binance_ethusd).toFixed(2) }} , MKRUSD: {{ parseFloat(binance_mkrusd).toFixed(2) }} , ETHBTC: {{
      parseFloat(binance_ethbtc).toFixed(6) }} , MKRBTC: {{ parseFloat(binance_mkrbtc).toFixed(6) }}</div>
  <div class="p-2">Donations: <a class="link link-info" target="_blank"
      href="https://insight.verus.io/address/VERUSTRADING@">VERUSTRADING@</a> and <a class="link link-info"
      target="_blank" href="https://insight.verus.io/address/verus%20coin%20foundation@">Verus Coin Foundation@</a>
    Staking =>
    <span v-for="chain in chains">{{ chain.toUpperCase() }}: {{ stakingsupply[chain] }} || </span>
  </div>

  <div class="tabs tabs-border">
    <input type="radio" name="my_tabs_2" class="tab" aria-label="Mainnet" checked="checked" />
    <div class="tab-content border-base-300 bg-base-100 p-10">
      <VerusBasket v-for="basket of baskets" v-bind:fullyQualifiedName="basket.ticker" v-bind:webLink="basket.website"
        v-bind:chartLink="basket.chart" v-bind:recentTransfersLink="basket.recenttransfers"
        v-bind:marketNote="basket.marketnote" v-bind:explorerLink="basket.explorer" v-bind:supply="basket.supply"
        v-bind:bestHeight="basket.bestheight" v-bind:reserveCurrencies="basket.reservecurrencies"
        v-bind:currencyDictionary="currencyDictionary" v-bind:isExtrasOverride="false" v-bind:isPreconvert="basket.isPreconvert" />


    </div>

    <input type="radio" name="my_tabs_2" class="tab" aria-label="VRSCTEST" />
    <div class="tab-content border-base-300 bg-base-100 p-10">
      <VerusBasket v-for="basket of vrsctest_baskets" v-bind:fullyQualifiedName="basket.ticker"
        v-bind:webLink="basket.website" v-bind:chartLink="basket.chart"
        v-bind:recentTransfersLink="basket.recenttransfers" v-bind:marketNote="basket.marketnote"
        v-bind:explorerLink="basket.explorer" v-bind:supply="basket.supply" v-bind:bestHeight="basket.bestheight"
        v-bind:reserveCurrencies="basket.reservecurrencies" v-bind:currencyDictionary="vrsctest_currencyDictionary"
        v-bind:isExtrasOverride="false" />
    </div>
  </div>




  <!-- <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="BRIDGEVETH" v-bind:webLink="bridgevethwebsite"
      v-bind:chartLink="bridgevethchart" v-bind:recentTransfersLink="bridgevethrecenttransfers" v-bind:marketNote="bridgevethmarketnote"
      v-bind:explorerLink="verusexplorer" v-bind:supply="bridgevethsupply" v-bind:bestHeight="bridgevethbestheight"
      v-bind:reserveCurrencies="bridgevethreservecurrencies" v-bind:currencyDictionary="currencyDictionary"
      v-bind:pureBasketPriceTbtcVrsc="pureTbtcVrsc"/>
    <p v-else>{{ BRIDGEVETH }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div> -->

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
      chains: ['vrsc', 'varrr', 'vdex', 'chips'],
      explorertx: "https://insight.verus.io/tx/",
      veruslatestblock: ref(),
      veruslongestchain: ref(),
      verusSyncOK: ref(false),
      verusBlocksRemaining: ref(0),


      pureTbtcVrsc: ref(),
      res: ref([]),
      binance_btcusd: ref(),
      binance_ethusd: ref(),
      binance_mkrusd: ref(),
      binance_ethbtc: ref(),
      binance_mkrbtc: ref(),
      stakingsupply: ref([]),
      vrsc_staking: ref(),
      varrr_staking: ref(),
      vdex_staking: ref(),
      chips_staking: ref(),
      currencyDictionary: [],
      baskets: ref([]),
      vrsctest_currencyDictionary: [],
      vrsctest_baskets: ref([])
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
    getStakingSupply(chain) {
      const requestData = {
        method: 'post',
        url: 'https://rpc.' + chain + '.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getmininginfo',
          params: [],
          id: 999
        }
      }
      // console.log(requestData)
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.stakingsupply[chain] = Math.trunc(response.data.result.stakingsupply)
          // console.log(this.stakingsupply[chain])
        })
        .catch((error) => {
          this.stakingsupply[chain] = error
        })
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
          // console.log(response.data.result.blocks)
          // console.log(this.verusSyncOK)
          // return response.data.result.blocks
          this.veruslatestblock = response.data.result.blocks
          this.veruslongestchain = response.data.result.longestchain
          this.verusBlocksRemaining = this.veruslongestchain - this.veruslatestblock
          if (this.veruslatestblock == this.veruslongestchain) {
            this.verusSyncOK = true
            // console.log(this.verusSyncOK)

          }
        })
        .catch((error) => {
          this.veruslatestblock = error
        })
    },
    async sendRequestRPC(requestData) {
      return await axios({
        method: requestData.method,
        url: requestData.url,
        headers: requestData.headers,
        data: requestData.data
      });
    },
    async getCurrencyDetails(rpcUrl, currencyid) {
      const requestData = {
        method: 'post',
        url: rpcUrl,
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: [currencyid],
          id: 1
        }
      };
      const response = await this.sendRequestRPC(requestData)
      const result = response.data.result
      return {
        reservecurrencies: result.bestcurrencystate.reservecurrencies,
        bestheight: result.bestheight,
        supply: result.bestcurrencystate.supply
      }
    },
    // getPureCurrency() {
    //   const requestData = {
    //     method: 'post',
    //     url: 'https://rpc.vrsc.komodefi.com',
    //     headers: { 'Content-Type': 'application/json' },
    //     data: {
    //       method: 'getcurrency',
    //       params: ['Pure'],
    //       id: 1
    //     }
    //   };
    //   this.sendRequestRPC(requestData)
    //     .then((response) => {
    //       this.responsePureBestCurrencyState = response.data.result.bestcurrencystate
    //       this.purereservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
    //       this.purebestheight = response.data.result.bestheight
    //       this.puresupply = response.data.result.bestcurrencystate.supply
    //       const vrscReserves = this.purereservecurrencies.find(item => item.currencyid == "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV").reserves
    //       const tbtcReserves = this.purereservecurrencies.find(item => item.currencyid == "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU").reserves
    //       this.pureTbtcVrsc = parseFloat(vrscReserves / tbtcReserves)
    //     })
    //     .catch((error) => {
    //       this.currencies = error
    //     })
    // },

    getBinancePrices() {
      axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT").then(res =>
        this.binance_btcusd = res.data.price
      )
      axios.get("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT").then(res =>
        this.binance_ethusd = res.data.price
      )
      axios.get("https://api.binance.com/api/v3/ticker/price?symbol=MKRUSDT").then(res =>
        this.binance_mkrusd = res.data.price
      )
      axios.get("https://api.binance.com/api/v3/ticker/price?symbol=ETHBTC").then(res =>
        this.binance_ethbtc = res.data.price
      )
      axios.get("https://api.binance.com/api/v3/ticker/price?symbol=MKRBTC").then(res =>
        this.binance_mkrbtc = res.data.price
      )
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
  async created() {
    try {
      const [response1, response2, response3, response4] = await Promise.all([
        fetch('/currencies.json'),
        fetch('/baskets.json'),
        fetch('/vrsctest_currencies.json'),
        fetch('/vrsctest_baskets.json')
      ]);

      const data1 = await response1.json()
      const data2 = await response2.json()
      const data3 = await response3.json()
      const data4 = await response4.json()


      this.currencyDictionary = data1
      this.baskets = data2
      this.vrsctest_currencyDictionary = data3
      this.vrsctest_baskets = data4
    } catch (error) {
      console.log(error)
    }

    try {
      // Fetch details for each basket and update the array
      const fetchPromises = this.baskets.map(async (basket, index) => {
        const details = await this.getCurrencyDetails(basket.rpc, basket.currencyid);
        if (details) {
          console.log(`Updating basket ${basket.ticker} with:`, details);
          // Update the basket in place
          this.baskets[index] = {
            ...basket,
            reservecurrencies: details.reservecurrencies,
            supply: details.supply,
            bestheight: details.bestheight,
          }
        }
        else {
          console.warn('No details fetch for ${basket.currencyid}')
        }
      })

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);
    } catch (error) {
      console.error('Error loading JSON files or fetching details:', error);
    }


    try {
      // Fetch details for each basket and update the array
      const fetchPromises = this.vrsctest_baskets.map(async (basket, index) => {
        const details = await this.getCurrencyDetails(basket.rpc, basket.currencyid);
        if (details) {
          console.log(`Updating basket ${basket.ticker} with:`, details);
          // Update the basket in place
          this.vrsctest_baskets[index] = {
            ...basket,
            reservecurrencies: details.reservecurrencies,
            supply: details.supply,
            bestheight: details.bestheight,
          }
        }
        else {
          console.warn('No details fetch for ${basket.currencyid}')
        }
      })

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);
    } catch (error) {
      console.error('Error loading JSON files or fetching details:', error);
    }

  },
  async mounted() {
    this.getLatestBlock()
    // this.getPureCurrency()
    this.getBinancePrices()
    this.chains.forEach(chain => this.getStakingSupply(chain))
  }
};
</script>
<style></style>
