<template>    
    <div class="p-2">
        <h2 class="pb-1"> LP Basket: {{ fullyQualifiedName }}</h2>
        <div v-if="marketNote">
            <p class="pt-2 pb-2">
                {{ marketNote }}
            </p>
        </div>
        <div class="text-xl"> Blocks:
            <a class="link-info" v-if="explorerLink" :href="explorerLink" target="_blank">{{ bestHeight }}</a>
            <span v-else>{{ bestHeight }}</span> |
            Supply:
            <a class="link-info" v-if="webLink" :href="webLink" target="_blank">{{ newSupply ? newSupply : supply }}</a>
            <span v-else>{{ newSupply ? newSupply : supply }}</span> |


            <span v-if="typeof chartLink !== 'undefined' && chartLink.length !== 0">Chart mirrors:
                <template v-for="mirror in chartLink">
                    <div class="badge badge-lg badge-ghost"><a class="link-info" :href="mirror.link" target="_blank">{{
                        mirror.title }}</a></div>
                </template>
            </span>
            <span v-else>Chart not available</span> |


            <span v-if="typeof recentTransfersLink !== 'undefined' && recentTransfersLink.length !== 0">Recent transfers mirrors:
                <template v-for="mirror in recentTransfersLink">
                    <div class="badge badge-lg badge-ghost"><a class="link-info" v-if="mirror.link" :href="mirror.link"
                            target="_blank">{{ mirror.title }}</a></div>
                </template>
            </span>
            <span v-else>Recent conversions not available</span>

        </div>
        <div v-if="pureBasketPriceTbtcVrsc" class="pt-1 pb-1">
            Show Reserve/tBTC <input type="checkbox" value="showPriceTbtc" @change="togglePriceTbtc()" class="toggle" />
            (relative to Pure Basket)
        </div>
        <div class="p-2 overflow-x-auto">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Reserve Currency</th>
                        <th v-if="showPriceTbtc">Reserve/tBTC</th>
                        <th v-for="(currency) in reserveCurrencies">
                            Reserve / <span :class="getCellClass(currency, fullyQualifiedName)">
                                {{ getTickerByCurrencyId(currency.currencyid) }} </span>
                        </th>
                        <th>LP / Reserve</th>
                        <th>Reserves</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(currencyBase, rowIndex) in reserveCurrencies" :key="rowIndex" class="hover">
                        <td :class="getCellClass(currencyBase, fullyQualifiedName)">
                            {{ getCurrencyTicker(currencyBase) }}
                        </td>
                        <td v-if="showPriceTbtc">{{ getPriceReserveTbtc(reserveCurrencies, currencyBase) }}</td>
                        <td v-for="(currencyRel, colIndex) in reserveCurrencies" :key="colIndex"
                            :class="getCellClass(currencyBase, currencyRel)">
                            {{ getReservePrice(reserveCurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
                        </td>
                        <td>
                            {{ newSupply ? parseFloat(currencyBase.reserves/newSupply * 1 / currencyBase.weight).toFixed(8) : parseFloat(currencyBase.priceinreserve.toFixed(8)) }}

                            {{ getTickerByCurrencyId(currencyBase.currencyid) }}
                        </td>
                        <td>{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
                        <td>{{ currencyBase.weight }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    props: [
        'fullyQualifiedName',//: String, //'fullyQualifiedName',
        //'reserveCurrencies', //: [Object] //'reserveCurrencies',
        //'supply', // String
        'rpcUrl',
        'chartLink',
        'recentTransfersLink',
        'marketNote',
        //'bestHeight',
        'explorerLink',
        'webLink',
        'currencyDictionary',
        'pureBasketPriceTbtcVrsc'
    ],

    setup(props) {
        const verusSyncOK = ref(false)
        const bestHeight = ref()
        const reserveCurrencies = ref()
        const supply = ref()
        // new stuff above
        const sendCurrency = ref()
        const receiveCurrency = ref()
        const amount = ref()
        const operationsBasketSend = ref([])
        const operationsBasketReceive = ref([])
        const relativeOperationsBasketSend = ref([])
        const relativeOperationsBasketReceive = ref([])
        const receiveMessage = ref()
        const showPriceTbtc = ref(false)
        const newSupply = ref(0)
        const newPriceInReserve = ref(0)
        return {
            verusSyncOK,
            bestHeight,
            reserveCurrencies,
            supply,
            amount,
            sendCurrency,
            receiveCurrency,
            operationsBasketSend,
            operationsBasketReceive,
            relativeOperationsBasketSend,
            relativeOperationsBasketReceive,
            receiveMessage,
            showPriceTbtc,
            newSupply,
            newPriceInReserve
        }
    },
    data() {
        return {
            something: 'blah'
        }
    },
    async mounted() {
            this.getLatestBlock()
            this.getCurrency()
    },
    methods: {
        getLatestBlock() {
            const requestData = {
                method: 'post',
                url: this.rpcUrl,
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
                const blocks = response.data.result.blocks
                const veruslongestchain = response.data.result.longestchain
                this.verusBlocksRemaining = veruslongestchain - blocks
                if (blocks == veruslongestchain) {
                    this.verusSyncOK = true
                    // console.log(this.verusSyncOK)
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
        getCurrency() {
            const requestData = {
                method: 'post',
                url: this.rpcUrl,
                headers: { 'Content-Type': 'application/json' },
                data: {
                    method: 'getcurrency',
                    params: [this.fullyQualifiedName],
                    id: 1
                }
            };
            this.sendRequestRPC(requestData)
                .then((response) => {
                this.reserveCurrencies = response.data.result.bestcurrencystate.reservecurrencies
                this.bestHeight = response.data.result.bestheight
                this.supply = response.data.result.bestcurrencystate.supply
            })
            .catch((error) => {
                this.currencies = error
            })
        },
        isExtras() {
            return parseInt(import.meta.env.VITE_EXTRAS)
        },
        togglePriceTbtc() {
            this.showPriceTbtc = !this.showPriceTbtc
        },
        getPriceReserveTbtc(reserveCurrencies, currency) {
            const vrscCurrencyId = this.getCurrencyIdByTicker("VRSC")
            const vrscCurrency = reserveCurrencies.find(item => item.currencyid == vrscCurrencyId)
            const priceInVrsc = this.getReservePrice(reserveCurrencies, currency, vrscCurrency)
            return parseFloat(priceInVrsc / this.pureBasketPriceTbtcVrsc).toFixed(8)
        },
        getCurrencyTicker(currency) {
            return this.currencyDictionary.find(item => item.currencyid === currency.currencyid).ticker
        },
        getCurrencyIdByTicker(ticker) {
            return this.currencyDictionary.find(item => item.ticker === ticker).currencyid
        },
        getTickerByCurrencyId(currencyId) {
            const currency = this.currencyDictionary.find(item => item.currencyid === currencyId);
            if (currency) {
                return currency.ticker;
            }
            // If the currency ID is not found, you can return a default value or handle the situation accordingly.
            return "Currency not found";
        },
        getCellClass(currencyBase, currencyRel) {
            if (this.operationsBasketReceive == 'undefined' || this.operationsBasketSend == 'undefined') {
                return ''
            }
            if (currencyBase.currencyid === currencyRel.currencyid) {
                return ''
            }
            // rel is bridge for the table cell with the ticker.
            // when using this with actual bridge receiving...need some logic change
            if (currencyRel === this.fullyQualifiedName || currencyBase === this.fullyQualifiedName) { // TESTING HERE 20241015
                // sending currency will always be 'add'
                // receiving currency will always be 'remove'
                // untested with lp currency as receive
                // return this.operationsBridgeVethSend[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBridgeVethSend[currencyBase.currencyid] === 'remove' ? 'light-green' : this.operationsBridgeVethReceive[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
                return this.operationsBasketSend[currencyBase.currencyid] === 'add' ? 'text-red-300' : this.operationsBasketReceive[currencyBase.currencyid] === 'remove' ? 'text-green-300' : ''
            }


            // the row is the base currency, it devalues when sendCurrency
            if (this.operationsBasketSend[currencyBase.currencyid]) {
                return this.relativeOperationsBasketSend[currencyRel.currencyid] === 'add' ? 'text-green-300' : this.relativeOperationsBasketSend[currencyRel.currencyid] === 'remove' ? 'text-red-300' : ''
            }
            if (this.operationsBasketReceive[currencyBase.currencyid]) {
                return this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'add' ? 'text-green-300' : this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'text-red-300' : ''
            }

            // rel is sendCurrency, operation of adding to basket, means it is green when in rel column
            if (this.operationsBasketSend[currencyRel.currencyid]) {
                return this.operationsBasketSend[currencyRel.currencyid] === 'add' ? 'text-green-300' : ''//this.operationsBridgeVethSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }
            if (this.operationsBasketReceive[currencyRel.currencyid]) {
                return this.operationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'text-red-300' : ''
            }
        },
        getReservePrice(reserveCurrencies, currency, targetCurrency) {
            // console.log(this.bridgevethreservecurrencies)
            // console.log(targetCurrency)
            const currencyReserves = reserveCurrencies.find(item => item.currencyid == currency.currencyid)
            // console.log(currencyReserves)
            const targetCurrencyReserves = reserveCurrencies.find(item => item.currencyid == targetCurrency.currencyid)
            // console.log(targetCurrencyReserves)
            // return parseFloat((targetCurrencyReserves.reserves / currencyReserves.reserves).toFixed(6))
            return parseFloat(((targetCurrencyReserves.reserves * 1 / targetCurrencyReserves.weight) / (currencyReserves.reserves * 1 / currencyReserves.weight)).toFixed(8))
        },
        clear() {
            this.operationsBasketSend = []
            this.operationsBasketReceive = []
            this.relativeOperationsBasketSend = []
            this.relativeOperationsBasketReceive = []
        },
        evaluate() {
            this.clear()
            let operationsSend = Array()
            let relativeOperationsSend = Array()
            let operationsReceive = Array()
            let relativeOperationsReceive = Array()
            const relativeArraySend = {}
            const relativeArrayReceive = {}
            let usingBC = false
            let generatedLP = 0
            let amountReceived = 0
            let receiveCurrencyTicker = 0
            let sendCurrencyTicker = 0 
            if (this.amount == 0 || this.amount === undefined || this.receiveCurrency.length == 0 || this.sendCurrency === this.receiveCurrency) {
                console.log("nothing to evaluate")
                return
            }
            // workaround for prop in render
            if (this.sendCurrency === this.fullyQualifiedName) {
                this.sendCurrency = this.getCurrencyIdByTicker(this.fullyQualifiedName)
                usingBC = true
                relativeArrayReceive[this.sendCurrency] = "add"
            }
            // workaround for prop in render
            if (this.receiveCurrency === this.fullyQualifiedName) {
                this.receiveCurrency = this.getCurrencyIdByTicker(this.fullyQualifiedName)
                usingBC = true
                relativeArraySend[this.receiveCurrency] = "remove"
            }

            operationsSend[this.sendCurrency] = "add"
            operationsReceive[this.receiveCurrency] = "remove"
            this.reserveCurrencies.forEach(currency => {
                if (currency.currencyid != this.sendCurrency) {
                    relativeArraySend[currency.currencyid] = "remove";
                }
                if (currency.currencyid != this.receiveCurrency) {
                    relativeArrayReceive[currency.currencyid] = "add";
                }
            });

            // if statement checking send/receive currency not equal to getCurrencyIdByTicker(fullyQualifiedName)
            if (this.sendCurrency != this.getCurrencyIdByTicker(this.fullyQualifiedName)) {
                let reservesAdd = this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).reserves
                let reserveWeight = this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).weight
                let reservesNewAmount = parseFloat(reservesAdd) + parseFloat(this.amount)
                generatedLP = this.amount / (reservesNewAmount * 1 / reserveWeight) * this.supply
                // console.log(generatedLP)
                this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).reserves = reservesNewAmount
                let newPriceInReserve = (reservesNewAmount * 1 / reserveWeight) / this.supply
                this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).priceinreserve = newPriceInReserve
            }
            else {
                generatedLP = this.amount
                console.log(generatedLP)
                this.newSupply ? this.newSupply -= generatedLP : this.newSupply = this.supply - generatedLP
                console.log(this.newSupply)
                for ( const i in this.reserveCurrencies){
                    console.log("Before:" + this.reserveCurrencies[i].priceinreserve)
                    this.reserveCurrencies[i].priceinreserve = this.reserveCurrencies[i].reserves * 1 / this.reserveCurrencies[i].weight / this.newSupply
                    console.log("After:" + this.reserveCurrencies[i].priceinreserve)
                }
                sendCurrencyTicker = this.fullyQualifiedName
            }

            if (this.receiveCurrency != this.getCurrencyIdByTicker(this.fullyQualifiedName)) {
                console.log(this.receiveCurrency)
                console.log(this.reserveCurrencies)
                let lpPriceInReserveReceiveCurrency = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).priceinreserve
                // let lpPriceInReserveReceiveCurrency = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).reserves

                console.log(lpPriceInReserveReceiveCurrency)
                if( this.sendCurrency == this.fullyQualifiedName){
                    amountReceived = lpPriceInReserveReceiveCurrency * generatedLP
                    print(amountReceived)
                    let reservesRemove = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).reserves
                    let reserveWeight = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).weight
                    let reservesNewAmount = parseFloat(reservesRemove) - parseFloat(amountReceived)
                    this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).reserves = reservesNewAmount
                    let newPriceInReserve = (reservesNewAmount * 1 / reserveWeight) / this.newSupply
                    this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).priceinreserve = newPriceInReserve
                }
                else{
                    amountReceived = lpPriceInReserveReceiveCurrency * generatedLP
                    let reservesRemove = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).reserves
                    let reserveWeight = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).weight
                    let reservesNewAmount = parseFloat(reservesRemove) - parseFloat(amountReceived)
                    this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).reserves = reservesNewAmount
                    let newPriceInReserve = (reservesNewAmount * 1 / reserveWeight) / this.supply
                    this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).priceinreserve = newPriceInReserve
                }

            }
            else {
                amountReceived = generatedLP
                // console.log(amountReceived)
                this.newSupply ? this.newSupply += generatedLP : this.newSupply = this.supply + generatedLP
                // console.log(this.newSupply)
                // console.log(this.reserveCurrencies)
                for( const i in this.reserveCurrencies){
                    // console.log(i)
                    this.reserveCurrencies[i].priceinreserve = this.newSupply / this.reserveCurrencies[i].reserves
                }
                receiveCurrencyTicker = this.fullyQualifiedName
            }
            if ( sendCurrencyTicker == 0 ){
                sendCurrencyTicker =this.getTickerByCurrencyId(this.sendCurrency)
            }
            if ( receiveCurrencyTicker == 0){
                receiveCurrencyTicker = this.getTickerByCurrencyId(this.receiveCurrency)
            }
            this.receiveMessage = "You receive approx " + parseFloat(amountReceived.toFixed(6)) + " " + receiveCurrencyTicker + "(Tip: " + sendCurrencyTicker + " weakens  when converted/sold into the basket)"

            // save the (relative)operations for css class evaluation
            this.operationsBasketSend = operationsSend
            this.relativeOperationsBasketSend = relativeArraySend
            this.operationsBasketReceive = operationsReceive
            this.relativeOperationsBasketReceive = relativeArrayReceive
        }


    },
}
</script>
<style scoped>
/* :root {

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
} */

/* body {
    margin: 550;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
} */

/* h2 {
    font-size: 3.2em;
    line-height: 1.1;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
} */

.light-green {
    background-color: lightgreen;
    /* color: blue; */
}

.light-red {
    background-color: lightcoral;
    /* color: orange; */
}

.light-grey {
    background-color: lightgrey;
}
</style>






<!-- <script>
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
      BRIDGEVDEX: 'Bridge.vDEX',
      PURE: 'Pure',
      SWITCH: 'Switch',
      KAIJU: 'Kaiju',
      NATI: 'NATI',
      NATIOWL: 'NATI.Owl',
      SUPERVRSC: 'SUPERVRSC',
      CYBERMONEY: "Cybermoney",
      explorertx: "https://insight.verus.io/tx/",
      veruslatestblock: ref(),
      veruslongestchain: ref(),
      verusSyncOK: ref(false),
      verusBlocksRemaining: ref(0),
      bridgevethreservecurrencies: ref(),
      bridgevethbestheight: ref(),
      bridgevethsupply: ref(),
      bridgevethwebsite: "https://verus.io/eth-bridge",
      bridgevethchart: [
        {"link": "https://bridgeveth.eu1.verus.trading/view/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "EU1"},
        {"link": "https://bridgeveth.us1.verus.trading/view/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "US1"}
      ],
      bridgevethrecenttransfers: [
        {"link": "https://bridgeveth.eu1.verus.trading/transfers/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "EU1"},
        {"link": "https://bridgeveth.us1.verus.trading/transfers/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "US1"}
      ],
      verusexplorer: "https://insight.verus.io",
      purereservecurrencies: ref(),
      purebestheight: ref(),
      puresupply: ref(),
      purechart: [
        {"link": "https://pure.eu1.verus.trading/view/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "EU1"},
        {"link": "https://pure.us1.verus.trading/view/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "US1"}
      ],

      purerecenttransfers: [
        {"link": "https://pure.eu1.verus.trading/transfers/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "EU1"},
        {"link": "https://pure.us1.verus.trading/transfers/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "US1"}
      ],
      bridgevarrrreservecurrencies: ref(),
      bridgevarrrbestheight: ref(),
      bridgevarrrsupply: ref(),
      bridgevarrrwebsite: "https://varrr.piratechain.com",
      bridgevarrrchart: [
        {"link": "https://bridgevarrr.eu1.verus.trading/view/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "EU1"},
        {"link": "https://bridgevarrr.us1.verus.trading/view/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "US1"}
      ],
      bridgevarrrrecenttransfers: [
        {"link": "https://bridgevarrr.eu1.verus.trading/transfers/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "EU1"},
        {"link": "https://bridgevarrr.us1.verus.trading/transfers/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "US1"}
      ],
      varrrexplorer: "https://varrrexplorer.piratechain.com",
      switchreservecurrencies: ref(),
      switchbestheight: ref(),
      switchsupply: ref(),
      switchchart: [
        {"link": "https://switch.eu1.verus.trading/view/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "EU1"},
        {"link": "https://switch.us1.verus.trading/view/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "US1"}
      ],
      switchrecenttransfers: [
        {"link": "https://switch.eu1.verus.trading/transfers/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "EU1"},
        {"link": "https://switch.us1.verus.trading/transfers/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "US1"}
      ],
      kaijureservecurrencies: ref(),
      kaijubestheight: ref(),
      kaijusupply: ref(),
      kaijuchart: [
        {"link": "https://kaiju.eu1.verus.trading/view/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "EU1"},
        {"link": "https://kaiju.us1.verus.trading/view/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "US1"}
      ],
      kaijurecenttransfers: [
        {"link": "https://kaiju.eu1.verus.trading/transfers/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "EU1"},
        {"link": "https://kaiju.us1.verus.trading/transfers/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "US1"}
      ],
      bridgevdexreservecurrencies: ref(),
      bridgevdexbestheight: ref(),
      bridgevdexsupply: ref(),
      bridgevdexchart: [
        {"link": "https://bridgevdex.eu1.verus.trading/view/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "EU1"},
        {"link": "https://bridgevdex.us1.verus.trading/view/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "US1"}
      ],
      bridgevdexrecenttransfers: [
        {"link": "https://bridgevdex.eu1.verus.trading/transfers/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "EU1"},
        {"link": "https://bridgevdex.us1.verus.trading/transfers/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "US1"}
      ],
      bridgevdexexplorer: "https://explorer.vdex.to",
      supervrscreservecurrencies: ref(),
      supervrscbestheight: ref(),
      supervrscsupply: ref(),
      supervrscchart: [],
      supervrscrecenttransfers: [],      
      natireservecurrencies: ref(),
      natibestheight: ref(),
      natisupply: ref(),
      natichart: [
        {"link": "https://nati.eu1.verus.trading/view/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "EU1"},
        {"link": "https://nati.us1.verus.trading/view/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "US1"}
      ],
      natirecenttransfers: [
        {"link": "https://nati.eu1.verus.trading/transfers/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "EU1"},
        {"link": "https://nati.us1.verus.trading/transfers/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "US1"}
      ],
      natimarketnote: "NATI.vETH = 10k IlluminatiCoin on Eth",
      natiowlreservecurrencies: ref(),
      natiowlbestheight: ref(),
      natiowlsupply: ref(),
      natiowlchart: [
        {"link": "https://natiowl.eu1.verus.trading/view/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "EU1"}, 
        {"link": "https://natiowl.us1.verus.trading/view/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "US1"}
      ],
      natiowlrecenttransfers: [
        {"link": "https://natiowl.eu1.verus.trading/transfers/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "EU1"}, 
        {"link": "https://natiowl.us1.verus.trading/transfers/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "US1"}
      ],
      cybermoneyreservecurrencies: ref(),
      cybermoneybestheight: ref(),
      cybermoneysupply: ref(),
      cybermoneychart: [
        {"link": "https://cybermoney.eu1.verus.trading/view/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "EU1"},
        {"link": "https://cybermoney.us1.verus.trading/view/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "US1"}
      ],
      cybermoneyrecenttransfers: [
        {"link": "https://cybermoney.eu1.verus.trading/transfers/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "EU1"},
        {"link": "https://cybermoney.us1.verus.trading/transfers/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "US1"}
      ],
      cybermoneymarketnote: "**WARNING** Cybermoney contains junk token named bitcoins, not real bitcoins, however, this is still useful for cheap VerusIDs like verustrading.bitcoins@",
      pureTbtcVrsc: ref(),
      res: ref([]),
      binance_btcusd: ref(),
      binance_ethusd: ref(),
      binance_mkrusd: ref(),
      binance_ethbtc: ref(),
      binance_mkrbtc: ref(),
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
        { "currencyid": "i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "ticker": "Bridge.vDEX"},
        { "currencyid": "iHog9UCTrn95qpUBFCZ7kKz7qWdMA8MQ6N", "ticker": "vDEX"},
        { "currencyid": "iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "ticker": "NATI"},
        { "currencyid": "iL62spNN42Vqdxh8H5nrfNe8d6Amsnfkdx", "ticker": "NATI.vETH"},
        { "currencyid": "iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "ticker": "Bridge.vARRR"},
        { "currencyid": "i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "ticker": "cybermoney"},
        { "currencyid": "i7ekXxHYzXW7uAfu5BtWZhd1MjXcWU5Rn3", "ticker": "bitcoins"},
        { "currencyid": "iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "ticker": "NATI owl"},
        { "currencyid": "i6SapneNdvpkrLPgqPhDVim7Ljek3h2UQZ", "ticker": "SUPERNET"},
        { "currencyid": "iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X", "ticker": "SUPERVRSC"}
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
    getBridgeVdexCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vdex.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['Bridge.vDEX'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.bridgevdexreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.bridgevdexbestheight = response.data.result.bestheight
          this.bridgevdexsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getNatiCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['NATI'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.natireservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.natibestheight = response.data.result.bestheight
          this.natisupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getSuperVrscCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['SUPERVRSC'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.supervrscreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.supervrscbestbestheight = response.data.result.bestheight
          this.supervrscsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getNatiOwlCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.natiowlreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.natiowlbestheight = response.data.result.bestheight
          this.natiowlsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getCybermoneyCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['cybermoney'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.cybermoneyreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.cybermoneybestheight = response.data.result.bestheight
          this.cybermoneysupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
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
  async mounted() {
    // this.sendRequest();
    this.getLatestBlock()
    this.getBridgeVethCurrency()
    this.getPureCurrency()
    this.getBridgeVarrrCurrency()
    this.getSwitchCurrency()
    this.getKaijuCurrency()
    this.getBridgeVdexCurrency()
    this.getNatiCurrency()
    this.getNatiOwlCurrency()
    this.getSuperVrscCurrency()
    this.getCybermoneyCurrency()
    this.getBinancePrices()
  }
};
</script>
<style></style> -->
