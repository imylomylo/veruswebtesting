<template>
    <div class="p-2">
        <h2 class="pb-1"> LP Basket: {{ fullyQualifiedName }}</h2>
        <h3> Blocks:
            <a class="link-info" v-if="explorerLink" :href="explorerLink" target="_blank">{{ bestHeight }}</a>
            <span v-else>{{ bestHeight }}</span> |
            Supply:
            <a class="link-info" v-if="webLink" :href="webLink" target="_blank">{{ supply }}</a>
            <span v-else>{{ supply }}</span>
        </h3>
        <div v-if="pureBasketPriceTbtcVrsc" class="pt-1 pb-1">
            Show Reserve/tBTC <input type="checkbox" value="showPriceTbtc" @change="togglePriceTbtc()" class="toggle" /> (relative to Pure Basket)
        </div>
        <div class="p-2 overflow-x-auto">
            <table class="table table-md">
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
                        <td v-if="showPriceTbtc">{{ getPriceReserveTbtc(reserveCurrencies,currencyBase) }}</td>
                        <td v-for="(currencyRel, colIndex) in reserveCurrencies" :key="colIndex"
                            :class="getCellClass(currencyBase, currencyRel)">
                            {{ getReservePrice(reserveCurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
                        </td>
                        <td>{{ parseFloat(currencyBase.priceinreserve.toFixed(8)) }}
                            {{ getTickerByCurrencyId(currencyBase.currencyid) }}
                        </td>
                        <td>{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
                        <td>{{ currencyBase.weight }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-if="isExtras()">
            Send:
            <select v-model="sendCurrency">
                <option disabled value="">Please select one</option>
                <option v-for="option in reserveCurrencies" :value="option.currencyid">
                    {{ getCurrencyTicker(option) }}
                </option>
                <option :value="fullyQualifiedName">
                    {{ fullyQualifiedName }}
                </option>
            </select>
            Amount: <input v-model="amount" placeholder="edit me" />
            Receive:
            <select v-model="receiveCurrency">
                <option disabled value="">Please select one</option>
                <option v-for="option in reserveCurrencies" :value="option.currencyid">
                    {{ getCurrencyTicker(option) }}
                </option>
                <option :value="fullyQualifiedName">
                    {{ fullyQualifiedName }}
                </option>
            </select>
        </p>
        <p v-if="isExtras()"> <button @click="evaluate()">Evaluate</button>
            {{ receiveMessage }}
        </p>
        <p v-if="isExtras()"> <button @click="clear()">Clear</button> Only clears green/red - useful for chaining
            together what-if.
            For reset,
            refresh page.
        </p>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';

export default {
    props: [
        'fullyQualifiedName',//: String, //'fullyQualifiedName',
        'reserveCurrencies', //: [Object] //'reserveCurrencies',
        'supply', // String
        'bestHeight',
        'explorerLink',
        'webLink',
        'currencyDictionary',
        'pureBasketPriceTbtcVrsc'
    ],

    setup(props) {
        const sendCurrency = ref()
        const receiveCurrency = ref()
        const amount = ref()
        const operationsBasketSend = ref([])
        const operationsBasketReceive = ref([])
        const relativeOperationsBasketSend = ref([])
        const relativeOperationsBasketReceive = ref([])
        const receiveMessage = ref()
        const showPriceTbtc = ref(false)
        return {
            amount,
            sendCurrency,
            receiveCurrency,
            operationsBasketSend,
            operationsBasketReceive,
            relativeOperationsBasketSend,
            relativeOperationsBasketReceive,
            receiveMessage,
            showPriceTbtc
        }
    },
    data() {
        return {
            something: 'blah'
        }
    },
    methods: {
        isExtras() {
            return parseInt(import.meta.env.VITE_EXTRAS)
        },
        togglePriceTbtc(){
            this.showPriceTbtc = !this.showPriceTbtc
        },
        getPriceReserveTbtc(reserveCurrencies, currency){
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
            if (currencyRel === this.fullyQualifiedName) {
                // sending currency will always be 'add'
                // receiving currency will always be 'remove'
                // untested with lp currency as receive
                // return this.operationsBridgeVethSend[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBridgeVethSend[currencyBase.currencyid] === 'remove' ? 'light-green' : this.operationsBridgeVethReceive[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
                return this.operationsBasketSend[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBasketReceive[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
            }

            // the row is the base currency, it devalues when sendCurrency
            if (this.operationsBasketSend[currencyBase.currencyid]) {
                return this.relativeOperationsBasketSend[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsBasketSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }
            if (this.operationsBasketReceive[currencyBase.currencyid]) {
                return this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }

            // rel is sendCurrency, operation of adding to basket, means it is green when in rel column
            if (this.operationsBasketSend[currencyRel.currencyid]) {
                return this.operationsBasketSend[currencyRel.currencyid] === 'add' ? 'light-green' : ''//this.operationsBridgeVethSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }
            if (this.operationsBasketReceive[currencyRel.currencyid]) {
                return this.operationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
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
            let usingBC = false
            if (this.amount == 0 || this.amount === undefined || this.receiveCurrency.length == 0 || this.sendCurrency === this.receiveCurrency) {
                console.log("nothing to evaluate")
                return
            }
            // workaround for prop in render
            if (this.sendCurrency === this.fullyQualifiedName) {
                this.sendCurrency = this.getCurrencyIdByTicker(this.fullyQualifiedName)
                usingBC = true
            }
            // workaround for prop in render
            if (this.receiveCurrency === this.fullyQualifiedName) {
                this.receiveCurrency = this.getCurrencyIdByTicker(this.fullyQualifiedName)
                usingBC = true
            }
            this.clear()
            let operationsSend = Array()
            let relativeOperationsSend = Array()
            let operationsReceive = Array()
            let relativeOperationsReceive = Array()
            operationsSend[this.sendCurrency] = "add"
            operationsReceive[this.receiveCurrency] = "remove"
            const relativeArraySend = {}
            const relativeArrayReceive = {}
            this.reserveCurrencies.forEach(currency => {
                if (currency.currencyid != this.sendCurrency) {
                    relativeArraySend[currency.currencyid] = "remove";
                }
                if (currency.currencyid != this.receiveCurrency) {
                    relativeArrayReceive[currency.currencyid] = "add";
                }
            });

            // if statement checking send/receive currency not equal to getCurrencyIdByTicker(fullyQualifiedName)
            let reservesAdd = this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).reserves
            let reserveWeight = this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).weight
            let reservesNewAmount = parseFloat(reservesAdd) + parseFloat(this.amount)
            let generatedLP = this.amount / (reservesNewAmount * 1 / reserveWeight) * this.supply
            this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).reserves = reservesNewAmount
            let newPriceInReserve = (reservesNewAmount * 1 / reserveWeight) / this.supply
            this.reserveCurrencies.find(item => item.currencyid == this.sendCurrency).priceinreserve = newPriceInReserve

            let lpPriceInReserveReceiveCurrency = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).priceinreserve
            let amountReceived = lpPriceInReserveReceiveCurrency * generatedLP
            let reservesRemove = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).reserves
            reserveWeight = this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).weight
            reservesNewAmount = parseFloat(reservesRemove) - parseFloat(amountReceived)
            this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).reserves = reservesNewAmount
            newPriceInReserve = (reservesNewAmount * 1 / reserveWeight) / this.supply
            this.reserveCurrencies.find(item => item.currencyid == this.receiveCurrency).priceinreserve = newPriceInReserve
            const sendCurrencyTicker = this.getTickerByCurrencyId(this.sendCurrency)
            const receiveCurrencyTicker = this.getTickerByCurrencyId(this.receiveCurrency)
            this.receiveMessage = "You receive approx " + parseFloat(amountReceived.toFixed(6)) + " " + receiveCurrencyTicker + "( Summary: " + sendCurrencyTicker + " price goes down & " + receiveCurrencyTicker + " price goes up )"

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
