<template>
    <div class="p-2">
        <h2 class="pb-1"> LP Basket: {{ fullyQualifiedName }}</h2>
        <div v-if="marketNote">
            <p class="pt-2 pb-2">
                {{ marketNote }}
            </p>
        </div>
        <div class="sm:text-sm"> Blocks:
            <a class="link-info" v-if="explorerLink" :href="explorerLink" target="_blank">{{ bestHeight }}</a>
            <span v-else>{{ bestHeight }}</span> |
            Supply:
            <a class="link-info" v-if="webLink" :href="webLink" target="_blank">{{ newSupply ? newSupply : supply }}</a>
            <span v-else>{{ newSupply ? newSupply : supply }}</span>
            
            <span class="hidden sm:inline">|</span>
            
            <div class="block sm:inline">
                <span v-if="chartLink.length != 0">Chart mirrors:
                    <template v-for="mirror in chartLink">
                        <div class="badge badge-lg badge-ghost"><a class="link-info" :href="mirror.link" target="_blank">{{
                            mirror.title }}</a></div>
                    </template>
                </span>
                <span v-else>Chart not available</span>

                <span class="hidden sm:inline">|</span>
            </div>

            <div class="block sm:inline">
                <span v-if="recentTransfersLink.length != 0">Recent transfers mirrors:
                    <template v-for="mirror in recentTransfersLink">
                        <div class="badge badge-lg badge-ghost"><a class="link-info" v-if="mirror.link" :href="mirror.link"
                                target="_blank">{{ mirror.title }}</a></div>
                    </template>
                </span>
                <span v-else>Recent conversions not available</span>
            </div>
        </div>
        <div v-if="pureBasketPriceTbtcVrsc" class="pt-1 pb-1">
            Show Reserve/tBTC <input type="checkbox" value="showPriceTbtc" @change="togglePriceTbtc()" class="toggle" />
            (relative to Pure Basket)
        </div>
        <div class="p-2 overflow-x-auto">
            <table class="table table-xs sm:table-md">
                <thead>
                    <tr>
                        <th>Reserve <span class="hidden sm:inline">Currency</span></th>
                        <th v-if="showPriceTbtc">Reserve/tBTC</th>
                        <th v-if="!isMobile" v-for="(currency, index) in reserveCurrencies" :class="{'hidden': index !== 0 && isMobile}">
                            Reserve / <span :class="getCellClass(currency, fullyQualifiedName)">
                                {{ getTickerByCurrencyId(currency.currencyid) }} </span>
                        </th>
                        <th v-else>Prices</th>
                        <th>LP / Reserve</th>
                        <th class="hidden sm:table-cell">Reserves</th>
                        <th class="hidden sm:table-cell">Weight</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(currencyBase, rowIndex) in reserveCurrencies" :key="rowIndex" class="hover">
                        <td :class="getCellClass(currencyBase, fullyQualifiedName)">
                            {{ getCurrencyTicker(currencyBase) }}
                        </td>
                        <td v-if="showPriceTbtc">{{ getPriceReserveTbtc(reserveCurrencies, currencyBase) }}</td>
                        <td v-if="!isMobile" v-for="(currencyRel, colIndex) in reserveCurrencies" :key="colIndex" 
                            :class="getCellClass(currencyBase, currencyRel)">
                            {{ getReservePrice(reserveCurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
                        </td>
                        <td v-else>
                            <div class="stacked-data">
                                <div v-for="(currencyRel, colIndex) in reserveCurrencies" :key="colIndex" 
                                    :class="getCellClass(currencyBase, currencyRel, null, forceHide=true)">
                                    {{ getReservePrice(reserveCurrencies, currencyBase, currencyRel) }} {{ getTickerByCurrencyId(currencyRel.currencyid) }}
                                </div>
                            </div>
                        </td>
                        <td>
                        <!-- :class="getCellClass(currencyBase, fullyQualifiedName)"> -->
                            {{ newSupply ? parseFloat(currencyBase.reserves/newSupply * 1 / currencyBase.weight).toFixed(8) : parseFloat(currencyBase.priceinreserve.toFixed(8)) }}

                            {{ getTickerByCurrencyId(currencyBase.currencyid) }}
                        </td>
                        <td class="hidden sm:table-cell">{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
                        <td class="hidden sm:table-cell">{{ currencyBase.weight }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="collapse collapse-plus">
            <input type="radio" name="whatif" />
            <div class="collapse-title text-xl font-medium text-info">What-if ?</div>
            <div class="collapse-content">
                <p v-if="isExtras()" class="bg-primary-content p-2">
                    Send:
                    <select class="select select-error" v-model="sendCurrency">
                        <option disabled value="">Please select one</option>
                        <option v-for="option in reserveCurrencies" :value="option.currencyid">
                            {{ getCurrencyTicker(option) }}
                        </option>
                        <option :value="fullyQualifiedName" v-if="!isPreconvert">
                            {{ fullyQualifiedName }}
                        </option>
                    </select>
                    Amount: <input class="input input-neutral input-bordered" v-model="amount" placeholder="" />
                    Receive:
                    <select class="select select-success" v-model="receiveCurrency">
                        <option disabled value="">Please select one</option>
                        <option v-for="option in reserveCurrencies" :value="option.currencyid" v-if="!isPreconvert">
                            {{ getCurrencyTicker(option) }}
                        </option>
                        <option :value="fullyQualifiedName">
                            {{ fullyQualifiedName }}
                        </option>
                    </select>
                </p>
                <p v-else>
                    What if disabled for a reason on this basket: In pre-conversion, or recently in pre-conversion and waiting for update
                </p>
                <p class="bg-primary-content p-2 text-warning" v-if="isExtras()"> <button
                        class="btn btn-outline btn-info" @click="evaluate()">Evaluate</button>
                    {{ receiveMessage }}
                </p>
                <p class="bg-primary-content p-2 text-primary" v-if="isExtras()"> <button
                        class="btn btn-outline btn-primary" @click="clear()">Continue</button> Only clears green/red -
                    useful for chaining
                    together evaluations in a what-if scenario...
                    For reset,
                    refresh page.
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';

export default {
    props: [
        'fullyQualifiedName',//: String, //'fullyQualifiedName',
        'reserveCurrencies', //: [Object] //'reserveCurrencies',
        'supply', // String
        'chartLink',
        'recentTransfersLink',
        'marketNote',
        'bestHeight',
        'explorerLink',
        'webLink',
        'currencyDictionary',
        'pureBasketPriceTbtcVrsc',
        'isExtrasOverride',
        'isPreconvert'
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
        const newSupply = ref(0)
        const newPriceInReserve = ref(0)
        // const isPreconvert = ref(false)
        return {
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
            newPriceInReserve,
            // isExtrasOverride
        }
    },
    data() {
        return {
            something: 'blah'
        }
    },
    computed: {
        isMobile() {
            return window.innerWidth < 640;
        }
    },
    methods: {
        isExtras() {
            if( this.isExtrasOverride ){
                return false
            }
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
        getCellClass(currencyBase, currencyRel, index = null, forceHide = false) {
            let classes = {}
            if (this.isMobile && currencyBase.currencyid === currencyRel.currencyid) {
                classes['hidden']; // Hide on mobile by force when base & rel the same (for prices of same currency, which is always 1)
                return 'hidden';
            }

            if (this.isMobile && index != null) {
                classes['hidden'] = index !== 0 && index != null; // Hide all but the first cell on mobile
                return 'hidden';
            }


            if (this.operationsBasketReceive == 'undefined' || this.operationsBasketSend == 'undefined') {
                return ''
                // classes['']
            }
            if (currencyBase.currencyid === currencyRel.currencyid) {
                return ''
                // classes['']
            }
            // rel is bridge for the table cell with the ticker.
            // when using this with actual bridge receiving...need some logic change
            if (currencyRel === this.fullyQualifiedName || currencyBase === this.fullyQualifiedName) { // TESTING HERE 20241015
                // sending currency will always be 'add'
                // receiving currency will always be 'remove'
                // untested with lp currency as receive
                // return this.operationsBridgeVethSend[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBridgeVethSend[currencyBase.currencyid] === 'remove' ? 'light-green' : this.operationsBridgeVethReceive[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
                return this.operationsBasketSend[currencyBase.currencyid] === 'add' ? 'text-red-300' : this.operationsBasketReceive[currencyBase.currencyid] === 'remove' ? 'text-green-300' : ''
                // classes[this.operationsBasketSend[currencyBase.currencyid] === 'add' ? 'text-red-300' : this.operationsBasketReceive[currencyBase.currencyid] === 'remove' ? 'text-green-300' : '']
            }


            // the row is the base currency, it devalues when sendCurrency
            if (this.operationsBasketSend[currencyBase.currencyid]) {
                return this.relativeOperationsBasketSend[currencyRel.currencyid] === 'add' ? 'text-green-300' : this.relativeOperationsBasketSend[currencyRel.currencyid] === 'remove' ? 'text-red-300' : ''
                // classes[this.relativeOperationsBasketSend[currencyRel.currencyid] === 'add' ? 'text-green-300' : this.relativeOperationsBasketSend[currencyRel.currencyid] === 'remove' ? 'text-red-300' : '']
            }
            if (this.operationsBasketReceive[currencyBase.currencyid]) {
                return this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'add' ? 'text-green-300' : this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'text-red-300' : ''
                // classes[this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'add' ? 'text-green-300' : this.relativeOperationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'text-red-300' : '']
            }

            // rel is sendCurrency, operation of adding to basket, means it is green when in rel column
            if (this.operationsBasketSend[currencyRel.currencyid]) {
                return this.operationsBasketSend[currencyRel.currencyid] === 'add' ? 'text-green-300' : ''//this.operationsBridgeVethSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
                // classes[this.operationsBasketSend[currencyRel.currencyid] === 'add' ? 'text-green-300' : '']//this.operationsBridgeVethSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }
            if (this.operationsBasketReceive[currencyRel.currencyid]) {
                return this.operationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'text-red-300' : ''
                // classes[this.operationsBasketReceive[currencyRel.currencyid] === 'remove' ? 'text-red-300' : '']
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
                if( this.isPreconvert) {
                    generatedLP = 0
                }
                else {
                    generatedLP = this.amount / (reservesNewAmount * 1 / reserveWeight) * this.supply
                }
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

            if( this.isPreconvert ){
                this.receiveMessage = "At launch, you’ll receive a share of the initial supply based on your contribution, adjusted for the reserve’s portion/weight."
            }
            else {
                this.receiveMessage = "You receive approx " + parseFloat(amountReceived.toFixed(6)) + " " + receiveCurrencyTicker + "(Tip: " + sendCurrencyTicker + " weakens  when converted/sold into the basket). Accuracy of approximation decays if amount is > 50% of reserves"
            }

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

.stacked-data div {
    @apply py-1; /* Add some padding for better spacing */
}
</style>
