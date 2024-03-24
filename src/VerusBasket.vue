<template>
    <h2> LP Basket: {{ fullyQualifiedName }}</h2>
    <v-table class="custom-font">
        <thead>
            <tr>
                <th>Reserve Currency</th>
                <th v-for="(currency) in reserveCurrencies">
                    Reserve / <span :class="getCellClassBridgeVeth(currency, fullyQualifiedName)">
                        {{ getTickerByCurrencyId(currency.currencyid) }} </span>
                </th>
                <th>LP / Reserve</th>
                <th>Reserves</th>
                <th>Weight</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(currencyBase, rowIndex) in reserveCurrencies" :key="rowIndex">
                <td :class="getCellClassBridgeVeth(currencyBase, fullyQualifiedName)">
                    {{ getCurrencyTicker(currencyBase) }}
                </td>
                <td v-for="(currencyRel, colIndex) in reserveCurrencies" :key="colIndex"
                    :class="getCellClassBridgeVeth(currencyBase, currencyRel)">
                    {{ getReservePrice(reserveCurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
                </td>
                <td>{{ parseFloat(currencyBase.priceinreserve.toFixed(6)) }}
                    {{ getTickerByCurrencyId(currencyBase.currencyid) }}
                </td>
                <td>{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
                <td>{{ currencyBase.weight }}</td>
            </tr>
        </tbody>
    </v-table>
</template>
<script>
import { ref, onMounted } from 'vue';

export default {
    props: [
        'fullyQualifiedName',//: String, //'fullyQualifiedName',
        'reserveCurrencies' //: [Object] //'reserveCurrencies'
    ],

    setup(props) {
        const operationsBasketSend = ref([])
        const operationsBasketReceive = ref([])
        const relativeOperationsBasketSend = ref([])
        const relativeOperationsBasketReceive = ref([])
        return { operationsBasketSend, operationsBasketReceive, relativeOperationsBasketSend, relativeOperationsBasketReceive }
    },
    data() {
        return {
            something: 'blah',
            currencyDictionary: [
                { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
                { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
                { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH" },
                { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH" },
                { "currencyid": "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU", "ticker": "tBTC" },
                { "currencyid": "iExBJfZYK7KREDpuhj6PzZBzqMAKaFg7d2", "ticker": "vARRR" },
                { "currencyid": "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "ticker": "Bridge.vETH" },
                { "currencyid": "i61cV2uicKSi1rSMQCBNQeSYC3UAi9GVzd", "ticker": "vUSDC.vETH" },
                { "currencyid": "iC5TQFrFXSYLQGkiZ8FYmZHFJzaRF5CYgE", "ticker": "EURC.vETH" }
            ]
        }
    },
    methods: {
        getCurrencyTicker(currency) {
            return this.currencyDictionary.find(item => item.currencyid === currency.currencyid).ticker
        },
        getTickerByCurrencyId(currencyId) {
            const currency = this.currencyDictionary.find(item => item.currencyid === currencyId);
            if (currency) {
                return currency.ticker;
            }
            // If the currency ID is not found, you can return a default value or handle the situation accordingly.
            return "Currency not found";
        },
        getCellClassBridgeVeth(currencyBase, currencyRel) {
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
                // console.log("opsend[base]")
                return this.relativeOperationsBasketSend[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsBasketSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }
            if (this.operationsBasketReceive[currencyBase.currencyid]) {
                // console.log("opreceive[base]")
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
            return parseFloat(((targetCurrencyReserves.reserves * 1 / targetCurrencyReserves.weight) / (currencyReserves.reserves * 1 / currencyReserves.weight)).toFixed(6))
        }


    },
}
</script>
<style scoped>
.custom-font {
    font-family: sans-serif;
    font-size: 15px;
}
</style>