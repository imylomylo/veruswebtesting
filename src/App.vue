<template>
  <div id="verusvueapp">
    <h2> LP: Bridge.vETH </h2>
    <h3> Active </h3>
    <v-table class="custom-font">
      <thead>
        <tr>
          <th>Reserve Currency</th>
          <th v-for="(currency) in bridgevethreservecurrencies">
            Reserve / <span :class="getCellClassBridgeVeth(currency, BRIDGEVETH)">{{
            getTickerByCurrencyId(currency.currencyid) }} </span>
          </th>
          <th>LP / Reserve</th>
          <th>Reserves</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(currencyBase, rowIndex) in bridgevethreservecurrencies" :key="rowIndex">
          <td :class="getCellClassBridgeVeth(currencyBase, BRIDGEVETH)"> {{ getCurrencyTicker(bridgevethcurrencies,
            currencyBase) }} </td>
          <td v-for="(currencyRel, colIndex) in bridgevethcurrencies" :key="colIndex"
            :class="getCellClassBridgeVeth(currencyBase, currencyRel)">
            {{ getReservePrice(bridgevethreservecurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
          </td>
          <td>{{ parseFloat(currencyBase.priceinreserve.toFixed(6)) }} {{ getTickerByCurrencyId(currencyBase.currencyid)
            }}</td>
          <td>{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
          <td>{{ currencyBase.weight }}</td>
        </tr>
      </tbody>
    </v-table>
    <p>
      Send:
      <select v-model="sendBridgeVethReserve">
        <option disabled value="">Please select one</option>
        <option v-for="option in bridgevethcurrencies" :value="option.currencyid">
          {{ option.ticker }}
        </option>
      </select>
      Amount: <input v-model="sendBridgeVethAmount" placeholder="edit me" />
      Receive:
      <select v-model="receiveBridgeVethReserve">
        <option disabled value="">Please select one</option>
        <option v-for="option in bridgevethcurrencies" :value="option.currencyid">
          {{ option.ticker }}
        </option>
      </select>


    </p>
    <p> <button @click="evaluateBridgeVeth()">Evaluate</button>
      {{ receiveMessage }}
    </p>
    <p> <button @click="clear(BRIDGEVETH)">Clear</button> Only clears green/red - useful for chaining together what-if.
      For reset,
      refresh page.
    </p>

    <h2> LP: Bridge.vARRR</h2>
    <h3> Preconvert mode until 1 April 2024</h3>
    <v-table class="custom-font">
      <thead>
        <tr>
          <th>Reserve Currency</th>
          <th v-for="(currency) in bridgevarrrreservecurrencies">
            Reserve / {{ getTickerByCurrencyId(currency.currencyid) }}
          </th>
          <th>LP / Reserve *</th>
          <th>Reserves</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(currencyBase, rowIndex) in bridgevarrrreservecurrencies" :key="rowIndex">
          <td :class="getCellClassBridgeVarrr(currencyBase, BRIDGEVARRR)"> {{ getCurrencyTicker(bridgevarrrcurrencies,
            currencyBase) }} </td>
          <td v-for="(currencyRel, colIndex) in bridgevarrrcurrencies" :key="colIndex"
            :class="getCellClassBridgeVarrr(currencyBase, currencyRel)">
            {{ getReservePrice(bridgevarrrreservecurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
          </td>
          <td>{{ parseFloat(currencyBase.priceinreserve.toFixed(6)) }} {{ getTickerByCurrencyId(currencyBase.currencyid)
            }} *</td>
          <td>{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
          <td>{{ currencyBase.weight }}</td>
        </tr>
      </tbody>
    </v-table>

    <p>
      Add/Remove:
      <select v-model="addOrRemoveLiquidityBridgeVarrr">
        <option disabled value="">Please select one</option>
        <option value="add">
          Add
        </option>
        <option value="remove">
          Remove
        </option>
      </select>
      Reserve:
      <select v-model="liquidityBridgeVarrrReserve">
        <option disabled value="">Please select one</option>
        <option v-for="option in bridgevarrrcurrencies" :value="option.currencyid">
          {{ option.ticker }}
        </option>
      </select>
      Liquidity Amount: <input v-model="liquidityBridgeVarrrAmount" placeholder="edit me" />

    </p>
    <p> <button @click="evaluateBridgeVarrr()">Evaluate</button>* Evaluation does not calculate price of the LP currency
    </p>
    <p> <button @click="clear(BRIDGEVARRR)">Clear</button> Only clears green/red - useful for chaining together what-if.
      For reset,
      refresh page.
    </p>



    <h2> LP: Pure </h2>
    <h3> Preconvert mode until 24 March 2024</h3>
    <v-table class="custom-font">
      <thead>
        <tr>
          <th>Reserve Currency</th>
          <th v-for="(currency) in purereservecurrencies">
            Reserve / {{ getTickerByCurrencyId(currency.currencyid) }}
          </th>
          <th>LP / Reserve *</th>
          <th>Reserves</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(currencyBase, rowIndex) in purereservecurrencies" :key="rowIndex">
          <td :class="getCellClassPure(currencyBase, PURE)"> {{ getCurrencyTicker(purecurrencies, currencyBase) }} </td>
          <td v-for="(currencyRel, colIndex) in purecurrencies" :key="colIndex"
            :class="getCellClassPure(currencyBase, currencyRel)">
            {{ getReservePrice(purereservecurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
          </td>
          <td>{{ parseFloat(currencyBase.priceinreserve.toFixed(6)) }} {{ getTickerByCurrencyId(currencyBase.currencyid)
            }} *</td>
          <td>{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
          <td>{{ currencyBase.weight }}</td>
        </tr>
      </tbody>
    </v-table>

    <p>
      Add/Remove:
      <select v-model="addOrRemoveLiquidityPure">
        <option disabled value="">Please select one</option>
        <option value="add">
          Add
        </option>
        <option value="remove">
          Remove
        </option>
      </select>
      Reserve:
      <select v-model="liquidityPureReserve">
        <option disabled value="">Please select one</option>
        <option v-for="option in purecurrencies" :value="option.currencyid">
          {{ option.ticker }}
        </option>
      </select>
      Liquidity Amount: <input v-model="liquidityPureAmount" placeholder="edit me" />

    </p>
    <p> <button @click="evaluatePure()">Evaluate</button>* Evaluation does not calculate price of the LP currency
    </p>
    <p> <button @click="clear(PURE)">Clear</button> Only clears green/red - useful for chaining together what-if. For
      reset,
      refresh page.
    </p>

    <h2> LP: {{SWITCH}} </h2>
    <h3> Preconvert mode until 30 March 2024</h3>
    <v-table class="custom-font">
      <thead>
        <tr>
          <th>Reserve Currency</th>
          <th v-for="(currency) in switchreservecurrencies">
            Reserve / {{ getTickerByCurrencyId(currency.currencyid) }}
          </th>
          <th>LP / Reserve *</th>
          <th>Reserves</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(currencyBase, rowIndex) in switchreservecurrencies" :key="rowIndex">
          <td :class="getCellClassSwitch(currencyBase, SWITCH)"> {{ getCurrencyTicker(switchcurrencies, currencyBase) }} </td>
          <td v-for="(currencyRel, colIndex) in switchcurrencies" :key="colIndex"
            :class="getCellClassSwitch(currencyBase, currencyRel)">
            {{ getReservePrice(switchreservecurrencies, currencyBase, currencyRel) }} {{ currencyRel.ticker }}
          </td>
          <td>{{ parseFloat(currencyBase.priceinreserve.toFixed(6)) }} {{ getTickerByCurrencyId(currencyBase.currencyid)
            }} *</td>
          <td>{{ parseFloat(currencyBase.reserves.toFixed(3)) }}</td>
          <td>{{ currencyBase.weight }}</td>
        </tr>
      </tbody>
    </v-table>

    <p class="hide-dev">
      Add:
      <select v-model="sendSwitchReserve">
        <option disabled value="">Please select one</option>
        <option v-for="option in switchcurrencies" :value="option.currencyid">
          {{ option.ticker }}
        </option>
      </select>
      Liquidity Amount: <input v-model="sendSwitchAmount" placeholder="edit me" />

    </p>
    <p class="hide-dev"> <button @click="evaluate(SWITCH)">Evaluate</button>* Evaluation does not calculate price of the LP currency
    </p>
    <p class="hide-dev"> <button @click="clear(SWITCH)">Clear</button> Only clears green/red - useful for chaining together what-if. For
      reset,
      refresh page.
    </p>


    <!-- <div>
      Latest block: {{ latestblock }}
    </div> -->
    <br />
    <h3>VRSC Mempool: Unconfirmed transactions</h3>
    <div v-if="mempool_res.length > 0">
      <ul>
        <v-list-item v-for="res in mempool_res"><a :href="explorertx + res">{{ res }}</a> | <a target="_blank"
            :href="explorertx + res">new tab</a></v-list-item>
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
      responseBridgeVethBestCurrencyState: ref([]),
      responseBridgeVarrrBestCurrencyState: ref([]),
      responsePureBestCurrencyState: ref([]),
      bridgevethreservecurrencies: ref([]),
      purereservecurrencies: ref([]),
      bridgevarrrreservecurrencies: ref([]),
      switchreservecurrencies: ref([]),
      addOrRemoveLiquidityBridgeVarrr: ref([]),
      liquidityBridgeVarrrAmount: ref([]),
      liquidityBridgeVarrrReserve: ref([]),
      addOrRemoveLiquidityPure: ref([]),
      liquidityPureAmount: ref([]),
      liquidityPureReserve: ref([]),
      mempool: ref([]),
      mempool_res: ref([]),
      rawtransaction: ref([]),
      decodedrawtransaction: ref([]),
      mempool_count: ref(0),
      res: ref([]),
      operationsBridgeVethSend: [],
      relativeOperationsBridgeVethSend: [],
      operationsBridgeVethReceive: [],
      relativeOperationsBridgeVethReceive: [],
      operationsBridgeVarrr: [],
      relativeOperationsBridgeVarrr: [],
      operationsPure: [],
      relativeOperationsPure: [],
      PURE: "Pure",
      BRIDGEVETH: "Bridge.vETH",
      BRIDGEVARRR: "Bridge.vARRR",
      SWITCH: "Switch",
      sendBridgeVethReserve: ([]),
      receiveBridgeVethReserve: ([]),
      sendBridgeVethAmount: ([]),
      receiveMessage: '',
      sendSwitchReserve: '',
      sendSwitchAmount: '',
      switchreservecurrencies: ref([]),
      responseSwitchBestCurrencyState: ref([]),
      relativeOperationsSwitch: [],
      operationsSwitch: [],
      arr_currencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
        { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH" },
        { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH" },
        { "currencyid": "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU", "ticker": "tBTC" },
        { "currencyid": "iExBJfZYK7KREDpuhj6PzZBzqMAKaFg7d2", "ticker": "vARRR" },
        { "currencyid": "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "ticker": "Bridge.vETH" },
        { "currencyid": "i61cV2uicKSi1rSMQCBNQeSYC3UAi9GVzd", "ticker": "vUSDC.vETH" },
        { "currencyid": "iC5TQFrFXSYLQGkiZ8FYmZHFJzaRF5CYgE", "ticker": "EURC.vETH" }
      ],
      bridgevethcurrencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
        { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH" },
        { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH" }
      ],
      purecurrencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU", "ticker": "tBTC" }
      ],
      bridgevarrrcurrencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iExBJfZYK7KREDpuhj6PzZBzqMAKaFg7d2", "ticker": "vARRR" },
        { "currencyid": "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "ticker": "Bridge.vETH" },
        { "currencyid": "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU", "ticker": "tBTC" }
      ],
      switchcurrencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
        { "currencyid": "i61cV2uicKSi1rSMQCBNQeSYC3UAi9GVzd", "ticker": "vUSDC.vETH" },
        { "currencyid": "iC5TQFrFXSYLQGkiZ8FYmZHFJzaRF5CYgE", "ticker": "EURC.vETH" }
      ]
    };
  },

  methods: {
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
      else if ( lp === this.SWITCH){
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
    getCellClassPure(currencyBase, currencyRel) {
      if (currencyBase.currencyid === currencyRel.currencyid) {
        return ''
      }

      if (currencyRel === this.PURE) {
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

      if (currencyRel === this.BRIDGEVARRR) {
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

    },
    evaluateChanges(lp, lpsupply, reserveCurrenciesFromBCS, basketsCurrencies, sendCurrency, receiveCurrency, amount) {
      // console.log("send: " + sendCurrency + " receive: " + receiveCurrency + " amount: " + amount)
      if (amount == 0 || sendCurrency.length == 0 || receiveCurrency.length == 0 || sendCurrency === receiveCurrency) {
        return
      }
      this.clear(lp)
      let operationsSend = Array()
      let relativeOperationsSend = Array()
      let operationsReceive = Array()
      let relativeOperationsReceive = Array()
      operationsSend[sendCurrency] = "add"
      operationsReceive[receiveCurrency] = "remove"
      const relativeArraySend = {}
      const relativeArrayReceive = {}
      basketsCurrencies.forEach(currency => {
        if (currency.currencyid != sendCurrency) {
          relativeArraySend[currency.currencyid] = "remove";
        }
        if (currency.currencyid != receiveCurrency) {
          relativeArrayReceive[currency.currencyid] = "add";
        }
      });

      relativeOperationsSend = relativeArraySend
      relativeOperationsReceive = relativeArrayReceive
      basketsCurrencies.find(item => item.currencyid == sendCurrency)
      let reservesAdd = reserveCurrenciesFromBCS.find(item => item.currencyid == sendCurrency).reserves
      let reserveWeight = reserveCurrenciesFromBCS.find(item => item.currencyid == sendCurrency).weight
      let reservesNewAmount = parseFloat(reservesAdd) + parseFloat(amount)
      let generatedLP = amount / (reservesNewAmount * 1 / reserveWeight) * this.responseBridgeVethBestCurrencyState.supply
      reserveCurrenciesFromBCS.find(item => item.currencyid == sendCurrency).reserves = reservesNewAmount
      let newPriceInReserve = (reservesNewAmount * 1 / reserveWeight) / lpsupply
      reserveCurrenciesFromBCS.find(item => item.currencyid == sendCurrency).priceinreserve = newPriceInReserve
      // if (receiveCurrency == this.getCurrencyIdByTicker(lp)) {
      //   this.evaluateChanges(lp, reserveCurrenciesFromBCS, basketsCurrencies, "remove", liquidityReserve, generatedLP, false) // if convertto is false, then need LP supply 
      // }
      let lpPriceInReserveReceiveCurrency = reserveCurrenciesFromBCS.find(item => item.currencyid == receiveCurrency).priceinreserve
      let amountReceived = lpPriceInReserveReceiveCurrency * generatedLP
      let reservesRemove = reserveCurrenciesFromBCS.find(item => item.currencyid == receiveCurrency).reserves
      reserveWeight = reserveCurrenciesFromBCS.find(item => item.currencyid == receiveCurrency).weight
      reservesNewAmount = parseFloat(reservesRemove) - parseFloat(amountReceived)
      reserveCurrenciesFromBCS.find(item => item.currencyid == receiveCurrency).reserves = reservesNewAmount
      newPriceInReserve = (reservesNewAmount * 1 / reserveWeight) / lpsupply
      reserveCurrenciesFromBCS.find(item => item.currencyid == receiveCurrency).priceinreserve = newPriceInReserve
      const sendCurrencyTicker = this.getTickerByCurrencyId(sendCurrency)
      const receiveCurrencyTicker = this.getTickerByCurrencyId(receiveCurrency)
      this.receiveMessage = "You receive approx " + parseFloat(amountReceived.toFixed(6)) + " " + receiveCurrencyTicker + "( Summary: " + sendCurrencyTicker + " price goes down & " + receiveCurrencyTicker + " price goes up )"

      if (lp === "PURE") {
        console.log("it is PURE")
        this.purereservecurrencies = reserveCurrenciesFromBCS
        this.operationsPure = operations
        this.relativeOperationsPure = relativeOperations
      }
      else if (lp === this.BRIDGEVETH) {
        this.bridgevethreservecurrencies = reserveCurrenciesFromBCS
        this.operationsBridgeVethSend = operationsSend
        this.relativeOperationsBridgeVethSend = relativeOperationsSend
        this.operationsBridgeVethReceive = operationsReceive
        this.relativeOperationsBridgeVethReceive = relativeOperationsReceive
        // console.log(this.operationsBridgeVethSend) // correct
        // console.log(this.relativeOperationsBridgeVethSend) // correct
        // console.log(this.operationsBridgeVethReceive) // correct
        // console.log(this.relativeOperationsBridgeVethReceive) // correct
      }
      else if (lp === "Bridge.vARRR") {
        this.bridgevarrrreservecurrencies = reserveCurrenciesFromBCS
        this.operationsBridgeVarrr = operations
        this.relativeOperationsBridgeVarrr = relativeOperations
      }
    },
    evaluate(lp){
      if( lp === this.SWITCH){
        console.log(this.SWITCH)
      }

    },
    evaluateChanges0(lp, reserveCurrenciesFromBCS, basketsCurrencies, addOrRemove, liquidityReserve, liquidityAmount, convertto = true) {
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
      if (lp === "PURE") {
        console.log("it is PURE")
        this.purereservecurrencies = reserveCurrenciesFromBCS
        this.operationsPure = operations
        this.relativeOperationsPure = relativeOperations
      }
      else if (lp === "Bridge.vETH") {
        this.bridgevethreservecurrencies = reserveCurrenciesFromBCS
        this.operationsBridgeVeth = operations
        this.relativeOperationsBridgeVeth = relativeOperations
      }
      else if (lp === "Bridge.vARRR") {
        this.bridgevarrrreservecurrencies = reserveCurrenciesFromBCS
        this.operationsBridgeVarrr = operations
        this.relativeOperationsBridgeVarrr = relativeOperations
      }
    },
    evaluateBridgeVeth() {
      this.evaluateChanges(this.BRIDGEVETH, this.responseBridgeVethBestCurrencyState.supply, this.bridgevethreservecurrencies, this.bridgevethcurrencies, this.sendBridgeVethReserve, this.receiveBridgeVethReserve, this.sendBridgeVethAmount)
    },
    evaluatePure() {
      this.evaluateChanges0(this.PURE, this.purereservecurrencies, this.purecurrencies, this.addOrRemoveLiquidityPure, this.liquidityPureReserve, this.liquidityPureAmount)
    },
    evaluateBridgeVarrr() {
      this.evaluateChanges0(this.BRIDGEVARRR, this.bridgevarrrreservecurrencies, this.bridgevarrrcurrencies, this.addOrRemoveLiquidityBridgeVarrr, this.liquidityBridgeVarrrReserve, this.liquidityBridgeVarrrAmount)
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
          // return response.data.result.blocks
          this.latestblock = response.data.result.blocks
        })
        .catch((error) => {
          this.latestblock = error
        })

    },
    getReservePrice(reserveCurrencies, currency, targetCurrency) {
      // console.log(this.bridgevethreservecurrencies)
      // console.log(targetCurrency)
      const currencyReserves = reserveCurrencies.find(item => item.currencyid == currency.currencyid)
      // console.log(currencyReserves)
      const targetCurrencyReserves = reserveCurrencies.find(item => item.currencyid == targetCurrency.currencyid)
      // console.log(targetCurrencyReserves)
      // return parseFloat((targetCurrencyReserves.reserves / currencyReserves.reserves).toFixed(6))
      return parseFloat(((targetCurrencyReserves.reserves * 1/targetCurrencyReserves.weight) / (currencyReserves.reserves * 1/currencyReserves.weight)).toFixed(6))

    },
    getTickerByCurrencyId(currencyId) {
      const currency = this.arr_currencies.find(item => item.currencyid === currencyId);
      if (currency) {
        return currency.ticker;
      }
      // If the currency ID is not found, you can return a default value or handle the situation accordingly.
      return "Currency not found";
    },
    getCurrencyIdByTicker(ticker) {
      const currency = this.arr_currencies.find(item => item.ticker === ticker);
      if (currency) {
        return currency.currencyid;
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
          this.res = response.data.result
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
          console.log(response)
          this.responseBridgeVethBestCurrencyState = response.data.result.bestcurrencystate
          this.bridgevethreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getpurecurrency() {
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
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getbridgevarrrcurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
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
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getswitchcurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: [this.SWITCH],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.responseSwitchBestCurrencyState = response.data.result.bestcurrencystate
          this.switchreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
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
  // beforeCreate(){
  //   this.getbridgecurrency()

  // },
  mounted() {
    // this.sendRequest();
    this.getbridgecurrency()
    this.getpurecurrency()
    this.getbridgevarrrcurrency()
    this.getswitchcurrency()
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

.hide-dev {
  display: none;
}

.custom-font {
  font-family: sans-serif;
  font-size: 15px;
}

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