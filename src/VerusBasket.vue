<template>
    <h2> LP Basket: {{ fullyQualifiedName }}</h2>
    <v-table class="custom-font">
        <thead>
            <tr>
                <th>Reserve Currency</th>
                <th v-for="(currency) in reserveCurrencies">
                    Reserve / <span :class="getCellClassBridgeVeth(currency, BRIDGEVETH)">{{
        getTickerByCurrencyId(currency.currencyid) }} </span>
                </th>
                <th>LP / Reserve</th>
                <th>Reserves</th>
                <th>Weight</th>
            </tr>
        </thead>

    </v-table>
</template>
<script>
import { ref } from 'vue';
import helpers from './helpers.js'

export default {
    props: [
        'fullyQualifiedName',
        'reserveCurrencies'
    ],
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
                { "currencyid": "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "ticker": "Bridge.vETH" }

            ]
        }
    },
    methods: {
        getTickerByCurrencyId(currencyId) {
            const currency = this.currencyDictionary.find(item => item.currencyid === currencyId);
            if (currency) {
                return currency.ticker;
            }
            // If the currency ID is not found, you can return a default value or handle the situation accordingly.
            return "Currency not found";
        },
        getCellClassBridgeVeth(currencyBase, currencyRel) {
            if (currencyBase.currencyid === currencyRel.currencyid) {
                return ''
            }
            // rel is bridge for the table cell with the ticker.
            // when using this with actual bridge receiving...need some logic change
            if (currencyRel === this.BRIDGEVETH) {
                // sending currency will always be 'add'
                // receiving currency will always be 'remove'
                // untested with lp currency as receive
                // return this.operationsBridgeVethSend[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBridgeVethSend[currencyBase.currencyid] === 'remove' ? 'light-green' : this.operationsBridgeVethReceive[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
                return this.operationsBridgeVethSend[currencyBase.currencyid] === 'add' ? 'light-red' : this.operationsBridgeVethReceive[currencyBase.currencyid] === 'remove' ? 'light-green' : ''
            }

            // the row is the base currency, it devalues when sendCurrency
            if (this.operationsBridgeVethSend[currencyBase.currencyid]) {
                // console.log("opsend[base]")
                return this.relativeOperationsBridgeVethSend[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsBridgeVethSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }
            if (this.operationsBridgeVethReceive[currencyBase.currencyid]) {
                // console.log("opreceive[base]")
                return this.relativeOperationsBridgeVethReceive[currencyRel.currencyid] === 'add' ? 'light-green' : this.relativeOperationsBridgeVethReceive[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }

            // rel is sendCurrency, operation of adding to basket, means it is green when in rel column
            if (this.operationsBridgeVethSend[currencyRel.currencyid]) {
                return this.operationsBridgeVethSend[currencyRel.currencyid] === 'add' ? 'light-green' : ''//this.operationsBridgeVethSend[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }
            if (this.operationsBridgeVethReceive[currencyRel.currencyid]) {
                return this.operationsBridgeVethReceive[currencyRel.currencyid] === 'remove' ? 'light-red' : ''
            }

        }


    },
    async create() {
        const responseCurrency = await helpers.getCurrency("Bridge.vETH")

    }
}
</script>
<style scoped>
.custom-font {
    font-family: sans-serif;
    font-size: 15px;
}
</style>