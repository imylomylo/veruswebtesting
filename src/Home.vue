<template>
  <!-- <router-link to="/bridge-veth">bridge.veth link</router-link> -->
    <div class="p-2">
      Dark/Light <input type="checkbox" value="garden" class="toggle theme-controller" />
    </div>
    <div class="p-2">Binance prices: BTCUSD: {{ parseFloat(binance_btcusd).toFixed(2) }} , ETHUSD: {{ parseFloat(binance_ethusd).toFixed(2) }} , MKRUSD: {{ parseFloat(binance_mkrusd).toFixed(2) }} , ETHBTC: {{ parseFloat(binance_ethbtc).toFixed(6) }} , MKRBTC: {{ parseFloat(binance_mkrbtc).toFixed(6) }}</div>
    <div class="p-2">Donations: <a class="link link-info" target="_blank" href="https://insight.verus.io/address/VERUSTRADING@">VERUSTRADING@</a> and <a class="link link-info" target="_blank" href="https://insight.verus.io/address/verus%20coin%20foundation@">Verus Coin Foundation@</a>
Staking => 
      <span v-for="chain in chains">{{chain.toUpperCase()}}: {{stakingsupply[chain]}} || </span>
    </div>
    <!-- <PriceInTbtc v-if="isExtras()" :pureTbtcReserves="pureTbtcReserves" :priceVrscDai="priceVrscDai"
      :pricesRelVrsc="pricesRelVrsc" /> -->

      <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="SUPERBASKET" v-bind:webLink="superbasketwebsite"
      v-bind:chartLink="superbasketchart" v-bind:recentTransfersLink="superbasketrecenttransfers" v-bind:marketNote="superbasketmarketnote"
      v-bind:explorerLink="verusexplorer" v-bind:supply="superbasketsupply" v-bind:bestHeight="superbasketbestheight"
      v-bind:reserveCurrencies="superbasketreservecurrencies" v-bind:currencyDictionary="currencyDictionary" v-bind:isExtrasOverride="false"/>
    <p v-else>{{ SUPERBASKET }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="BRIDGEVETH" v-bind:webLink="bridgevethwebsite"
      v-bind:chartLink="bridgevethchart" v-bind:recentTransfersLink="bridgevethrecenttransfers" v-bind:marketNote="bridgevethmarketnote"
      v-bind:explorerLink="verusexplorer" v-bind:supply="bridgevethsupply" v-bind:bestHeight="bridgevethbestheight"
      v-bind:reserveCurrencies="bridgevethreservecurrencies" v-bind:currencyDictionary="currencyDictionary"
      v-bind:pureBasketPriceTbtcVrsc="pureTbtcVrsc"/>
    <p v-else>{{ BRIDGEVETH }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-bind:fullyQualifiedName="BRIDGEVDEX"
      v-bind:explorerLink="bridgevdexexplorer"
      v-bind:chartLink="bridgevdexchart" v-bind:recentTransfersLink="bridgevdexrecenttransfers"
      v-bind:supply="bridgevdexsupply" v-bind:bestHeight="bridgevdexbestheight"
      v-bind:reserveCurrencies="bridgevdexreservecurrencies" v-bind:currencyDictionary="currencyDictionary" />

    <div class="divider"></div>

    <VerusBasket v-bind:fullyQualifiedName="BRIDGEVARRR" v-bind:webLink="bridgevarrrwebsite"
      v-bind:chartLink="bridgevarrrchart" v-bind:recentTransfersLink="bridgevarrrrecenttransfers"
      v-bind:explorerLink="varrrexplorer" v-bind:supply="bridgevarrrsupply" v-bind:bestHeight="bridgevarrrbestheight"
      v-bind:reserveCurrencies="bridgevarrrreservecurrencies" v-bind:currencyDictionary="currencyDictionary" />

    <div class="divider"></div>

    <VerusBasket v-bind:fullyQualifiedName="BRIDGECHIPS" v-bind:webLink="bridgechipswebsite"
      v-bind:chartLink="bridgechipschart" v-bind:recentTransfersLink="bridgechipsrecenttransfers"
      v-bind:explorerLink="chipsexplorer" v-bind:supply="bridgechipssupply" v-bind:bestHeight="bridgechipsbestheight"
      v-bind:reserveCurrencies="bridgechipsreservecurrencies" v-bind:currencyDictionary="currencyDictionary" />

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="PURE" v-bind:explorerLink="verusexplorer"
      v-bind:chartLink="purechart" v-bind:recentTransfersLink="purerecenttransfers"
      v-bind:supply="puresupply" v-bind:bestHeight="purebestheight" v-bind:reserveCurrencies="purereservecurrencies"
      v-bind:currencyDictionary="currencyDictionary" />
    <p v-else>{{ PURE }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }} blocks
        to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="SUPERVRSC"
      v-bind:chartLink="supervrscchart" v-bind:recentTransfersLink="supervrscrecenttransfers"
      v-bind:explorerLink="verusexplorer" v-bind:supply="supervrscsupply" v-bind:bestHeight="supervrscbestheight"
      v-bind:reserveCurrencies="supervrscreservecurrencies" v-bind:currencyDictionary="currencyDictionary"/>
    <p v-else>{{ SUPERVRSC }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="NATIOWL" v-bind:explorerLink="verusexplorer"
      v-bind:chartLink="natiowlchart" v-bind:recentTransfersLink="natiowlrecenttransfers" v-bind:marketNote="natimarketnote"
      v-bind:supply="natiowlsupply" v-bind:bestHeight="natiowlbestheight" v-bind:reserveCurrencies="natiowlreservecurrencies"
      v-bind:currencyDictionary="currencyDictionary" />
    <p v-else>{{ NATIOWL }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }} blocks
        to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="VYIELD" v-bind:explorerLink="verusexplorer"
      v-bind:chartLink="vyieldchart" v-bind:recentTransfersLink="vyieldrecenttransfers" v-bind:marketNote="vyieldmarketnote"
      v-bind:supply="vyieldsupply" v-bind:bestHeight="vyieldbestheight" v-bind:reserveCurrencies="vyieldreservecurrencies"
      v-bind:currencyDictionary="currencyDictionary" v-bind:isExtrasOverride="false"/>
    <p v-else>{{ VYIELD }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }} blocks
        to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="NATI" v-bind:explorerLink="verusexplorer"
      v-bind:chartLink="natichart" v-bind:recentTransfersLink="natirecenttransfers" v-bind:marketNote="natimarketnote"
      v-bind:supply="natisupply" v-bind:bestHeight="natibestheight" v-bind:reserveCurrencies="natireservecurrencies"
      v-bind:currencyDictionary="currencyDictionary" />
    <p v-else>{{ NATI }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }} blocks
        to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="KAIJU"
      v-bind:chartLink="kaijuchart" v-bind:recentTransfersLink="kaijurecenttransfers"
      v-bind:explorerLink="verusexplorer" v-bind:supply="kaijusupply" v-bind:bestHeight="kaijubestheight"
      v-bind:reserveCurrencies="kaijureservecurrencies" v-bind:currencyDictionary="currencyDictionary"/>
    <p v-else>{{ KAIJU }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="KEKFROG"
      v-bind:chartLink="kekfrogchart" v-bind:recentTransfersLink="kekfrogrecenttransfers"
      v-bind:explorerLink="verusexplorer" v-bind:supply="kekfrogsupply" v-bind:bestHeight="kekfrogbestheight"
      v-bind:reserveCurrencies="kekfrogreservecurrencies" v-bind:currencyDictionary="currencyDictionary"/>
    <p v-else>{{ KEKFROG }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="SWITCH" v-bind:explorerLink="verusexplorer"
      v-bind:chartLink="switchchart" v-bind:recentTransfersLink="switchrecenttransfers"
      v-bind:supply="switchsupply" v-bind:bestHeight="switchbestheight"
      v-bind:reserveCurrencies="switchreservecurrencies" v-bind:currencyDictionary="currencyDictionary" />
    <p v-else>{{ SWITCH }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }}
        blocks to go</span></p>

    <div class="divider"></div>

    <VerusBasket v-if="verusSyncOK" v-bind:fullyQualifiedName="CYBERMONEY" v-bind:explorerLink="verusexplorer"
      v-bind:chartLink="cybermoneychart" v-bind:recentTransfersLink="cybermoneyrecenttransfers" v-bind:marketNote="cybermoneymarketnote"
      v-bind:supply="cybermoneysupply" v-bind:bestHeight="cybermoneybestheight" v-bind:reserveCurrencies="cybermoneyreservecurrencies"
      v-bind:currencyDictionary="currencyDictionary" />
    <p v-else>{{ CYBERMONEY }} is not ready - syncing data <span v-if="verusBlocksRemaining">{{ verusBlocksRemaining }} blocks
        to go</span></p>
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
      BRIDGEVETH: 'Bridge.vETH',
      BRIDGECHIPS: 'Bridge.CHIPS',
      BRIDGEVARRR: 'Bridge.vARRR',
      BRIDGEVDEX: 'Bridge.vDEX',
      SUPERBASKET: 'SUPER\u{1F6D2}',
      PURE: 'Pure',
      SWITCH: 'Switch',
      KAIJU: 'Kaiju',
      NATI: 'NATI',
      NATIOWL: 'NATI\u{1F989}',
      SUPERVRSC: 'SUPERVRSC',
      CYBERMONEY: 'Cybermoney',
      VYIELD: 'vYIELD',
      KEKFROG: 'KEK\u{1F438}',
      explorertx: "https://insight.verus.io/tx/",
      veruslatestblock: ref(),
      veruslongestchain: ref(),
      verusSyncOK: ref(false),
      verusBlocksRemaining: ref(0),
      
      superbasketreservecurrencies: ref(),
      superbasketbestheight: ref(),
      superbasketsupply: ref(),
      superbasketmarketnote: "",
      superbasketwebsite: "https://verus.io/eth-bridge",
      superbasketchart: [

      ],
      superbasketrecenttransfers: [
        {"link": "https://superbasket.us1.verus.trading/transfers/iFrFn9b6ctse7XBzcWkRbpYMAHoKjbYKqG", "title": "US1"}
      ],
      
      bridgevethreservecurrencies: ref(),
      bridgevethbestheight: ref(),
      bridgevethsupply: ref(),
      bridgevethmarketnote: "DAI savings rate accrues in Bridge.vETH reserves from all DAI bridged network-wide $$",
      bridgevethwebsite: "https://verus.io/eth-bridge",
      bridgevethchart: [
        {"link": "https://bridgeveth.sg1.verus.trading/view/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "SG1"},
        {"link": "https://bridgeveth.us1.verus.trading/view/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "US1"}
      ],
      bridgevethrecenttransfers: [
        {"link": "https://bridgeveth.sg1.verus.trading/transfers/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "SG1"},
        {"link": "https://bridgeveth.us1.verus.trading/transfers/i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "title": "US1"}
      ],
      verusexplorer: "https://insight.verus.io",
      purereservecurrencies: ref(),
      purebestheight: ref(),
      puresupply: ref(),
      purechart: [
        {"link": "https://pure.sg1.verus.trading/view/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "SG1"},
        {"link": "https://pure.us1.verus.trading/view/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "US1"}
      ],

      purerecenttransfers: [
        {"link": "https://pure.sg1.verus.trading/transfers/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "SG1"},
        {"link": "https://pure.us1.verus.trading/transfers/iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "title": "US1"}
      ],
      bridgechipsreservecurrencies: ref(),
      bridgechipsbestheight: ref(),
      bridgechipssupply: ref(),
      bridgechipswebsite: "https://bridge.chips.cash",
      bridgechipschart: [
        {"link": "https://bridgechips.sg1.verus.trading/view/i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH", "title": "SG1"},
        {"link": "https://bridgechips.us1.verus.trading/view/i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH", "title": "US1"}
      ],
      bridgechipsrecenttransfers: [
        {"link": "https://bridgechips.sg1.verus.trading/transfers/i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH", "title": "SG1"},
        {"link": "https://bridgechips.us1.verus.trading/transfers/i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH", "title": "US1"}
      ],
      chipsexplorer: "https://explorer.chips.cash",
      bridgevarrrreservecurrencies: ref(),
      bridgevarrrbestheight: ref(),
      bridgevarrrsupply: ref(),
      bridgevarrrwebsite: "https://varrr.piratechain.com",
      bridgevarrrchart: [
        {"link": "https://bridgevarrr.sg1.verus.trading/view/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "SG1"},
        {"link": "https://bridgevarrr.us1.verus.trading/view/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "US1"}
      ],
      bridgevarrrrecenttransfers: [
        {"link": "https://bridgevarrr.sg1.verus.trading/transfers/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "SG1"},
        {"link": "https://bridgevarrr.us1.verus.trading/transfers/iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "title": "US1"}
      ],
      varrrexplorer: "https://varrrexplorer.piratechain.com",
      switchreservecurrencies: ref(),
      switchbestheight: ref(),
      switchsupply: ref(),
      switchchart: [
        // {"link": "https://switch.sg1.verus.trading/view/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "SG1"},
        {"link": "https://switch.us1.verus.trading/view/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "US1"}
      ],
      switchrecenttransfers: [
        // {"link": "https://switch.sg1.verus.trading/transfers/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "SG1"},
        {"link": "https://switch.us1.verus.trading/transfers/i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "title": "US1"}
      ],
      kekfrogreservecurrencies: ref(),
      kekfrogbestheight: ref(),
      kekfrogsupply: ref(),
      kekfrogchart: [
        {"link": "https://kekfrog.sg1.verus.trading/view/iCDjBN71SbSppgsNTpwwMBT69399DpV4hA", "title": "SG1"},
        {"link": "https://kekfrog.us1.verus.trading/view/iCDjBN71SbSppgsNTpwwMBT69399DpV4hA", "title": "US1"}
      ],
      kekfrogrecenttransfers: [
        {"link": "https://kekfrog.sg1.verus.trading/transfers/iCDjBN71SbSppgsNTpwwMBT69399DpV4hA", "title": "SG1"},
        {"link": "https://kekfrog.us1.verus.trading/transfers/iCDjBN71SbSppgsNTpwwMBT69399DpV4hA", "title": "US1"}
      ],
      kaijureservecurrencies: ref(),
      kaijubestheight: ref(),
      kaijusupply: ref(),
      kaijuchart: [
        {"link": "https://kaiju.sg1.verus.trading/view/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "SG1"},
        {"link": "https://kaiju.us1.verus.trading/view/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "US1"}
      ],
      kaijurecenttransfers: [
        {"link": "https://kaiju.sg1.verus.trading/transfers/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "SG1"},
        {"link": "https://kaiju.us1.verus.trading/transfers/i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "title": "US1"}
      ],
      bridgevdexreservecurrencies: ref(),
      bridgevdexbestheight: ref(),
      bridgevdexsupply: ref(),
      bridgevdexchart: [
        {"link": "https://bridgevdex.sg1.verus.trading/view/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "SG1"},
        {"link": "https://bridgevdex.us1.verus.trading/view/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "US1"}
      ],
      bridgevdexrecenttransfers: [
        {"link": "https://bridgevdex.sg1.verus.trading/transfers/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "SG1"},
        {"link": "https://bridgevdex.us1.verus.trading/transfers/i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "title": "US1"}
      ],
      bridgevdexexplorer: "https://explorer.vdex.to",
      supervrscreservecurrencies: ref(),
      supervrscbestheight: ref(),
      supervrscsupply: ref(),
      supervrscchart: [
        {"link": "https://supervrsc.sg1.verus.trading/view/iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X", "title": "SG1"},
        {"link": "https://supervrsc.us1.verus.trading/view/iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X", "title": "US1"}
      ],
      supervrscrecenttransfers: [
        {"link": "https://supervrsc.sg1.verus.trading/transfers/iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X", "title": "SG1"},
        {"link": "https://supervrsc.us1.verus.trading/transfers/iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X", "title": "US1"}
      ],      
      natireservecurrencies: ref(),
      natibestheight: ref(),
      natisupply: ref(),
      natichart: [
        {"link": "https://nati.sg1.verus.trading/view/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "SG1"},
        {"link": "https://nati.us1.verus.trading/view/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "US1"}
      ],
      natirecenttransfers: [
        {"link": "https://nati.sg1.verus.trading/transfers/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "SG1"},
        {"link": "https://nati.us1.verus.trading/transfers/iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "title": "US1"}
      ],
      natimarketnote: "NATI.vETH = 10k IlluminatiCoin on Eth, tinfoil costs extra!!",
      natiowlreservecurrencies: ref(),
      natiowlbestheight: ref(),
      natiowlsupply: ref(),
      natiowlchart: [
        {"link": "https://natiowl.sg1.verus.trading/view/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "SG1"}, 
        {"link": "https://natiowl.us1.verus.trading/view/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "US1"}
      ],
      natiowlrecenttransfers: [
        {"link": "https://natiowl.sg1.verus.trading/transfers/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "SG1"}, 
        {"link": "https://natiowl.us1.verus.trading/transfers/iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "title": "US1"}
      ],
      vyieldmarketnote: "scrvUSD = savings-crv-USD, stablecoin yield 5-20% apy, check approx apy https://crvusd.curve.fi/#/ethereum/scrvUSD",
      vyieldreservecurrencies: ref(),
      vyieldbestheight: ref(),
      vyieldsupply: ref(),
      vyieldchart: [
        {"link": "https://vyield.sg1.verus.trading/view/iAik7rePReFq2t7LZMZhHCJ52fT5pisJ5C", "title": "SG1"}, 
        {"link": "https://vyield.us1.verus.trading/view/iAik7rePReFq2t7LZMZhHCJ52fT5pisJ5C", "title": "US1"}
      ],
      vyieldrecenttransfers: [
        {"link": "https://vyield.sg1.verus.trading/transfers/iAik7rePReFq2t7LZMZhHCJ52fT5pisJ5C", "title": "SG1"}, 
        {"link": "https://vyield.us1.verus.trading/transfers/iAik7rePReFq2t7LZMZhHCJ52fT5pisJ5C", "title": "US1"}
      ],
      cybermoneyreservecurrencies: ref(),
      cybermoneybestheight: ref(),
      cybermoneysupply: ref(),
      cybermoneychart: [
        {"link": "https://cybermoney.sg1.verus.trading/view/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "SG1"},
        {"link": "https://cybermoney.us1.verus.trading/view/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "US1"}
      ],
      cybermoneyrecenttransfers: [
        {"link": "https://cybermoney.sg1.verus.trading/transfers/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "SG1"},
        {"link": "https://cybermoney.us1.verus.trading/transfers/i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "title": "US1"}
      ],
      cybermoneymarketnote: "Cybermoney contains junk-meme token named bitcoins, not real bitcoins, however, this is still useful for cheap VerusIDs like verustrading.bitcoins@",
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
        { "currencyid": "iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "ticker": "NATI\u{1F989}"},
        { "currencyid": "i6SapneNdvpkrLPgqPhDVim7Ljek3h2UQZ", "ticker": "SUPERNET"},
        { "currencyid": "iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X", "ticker": "SUPERVRSC"},
        { "currencyid": "i9nLSK4S1U5sVMq4eJUHR1gbFALz56J9Lj", "ticker": "scrvUSD.vETH"},
        { "currencyid": "iAik7rePReFq2t7LZMZhHCJ52fT5pisJ5C", "ticker": "vYIELD" },
        { "currencyid": "iCDjBN71SbSppgsNTpwwMBT69399DpV4hA", "ticker": "KEK\u{1F438}"},
        { "currencyid": "i5VVBEi6efBrXMaeqFW3MTPSzbmpNLysGR", "ticker": "PepeCoin.vETH"},
        { "currencyid": "i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH", "ticker": "Bridge.CHIPS"},
        { "currencyid": "iJ3WZocnjG9ufv7GKUA4LijQno5gTMb7tP", "ticker": "CHIPS"},
        { "currencyid": "iFrFn9b6ctse7XBzcWkRbpYMAHoKjbYKqG", "ticker": "SUPER\u{1F6D2}"}
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
    getStakingSupply(chain) {
      const requestData = {
        method: 'post',
        url: 'https://rpc.' +chain+'.komodefi.com',
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
    sendRequestRPC(requestData) {
      return axios({
        method: requestData.method,
        url: requestData.url,
        headers: requestData.headers,
        data: requestData.data
      });
    },
    getSuperBasketCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: [this.SUPERBASKET],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.superbasketreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.superbasketbestheight = response.data.result.bestheight
          this.superbasketsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
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
    getBridgeChipsCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.chips.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['Bridge.CHIPS'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.responseBridgeChipsBestCurrencyState = response.data.result.bestcurrencystate
          this.bridgechipsreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.bridgechipsbestheight = response.data.result.bestheight
          this.bridgechipssupply = response.data.result.bestcurrencystate.supply
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
          this.supervrscbestheight = response.data.result.bestheight
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
    getVYieldCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: [this.VYIELD],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.vyieldreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.vyieldbestheight = response.data.result.bestheight
          this.vyieldsupply = response.data.result.bestcurrencystate.supply
        })
        .catch((error) => {
          this.currencies = error
        })
    },
    getKekFrogCurrency() {
      const requestData = {
        method: 'post',
        url: 'https://rpc.vrsc.komodefi.com',
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'getcurrency',
          params: ['iCDjBN71SbSppgsNTpwwMBT69399DpV4hA'],
          id: 1
        }
      };
      this.sendRequestRPC(requestData)
        .then((response) => {
          this.kekfrogreservecurrencies = response.data.result.bestcurrencystate.reservecurrencies
          this.kekfrogbestheight = response.data.result.bestheight
          this.kekfrogsupply = response.data.result.bestcurrencystate.supply
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
    this.getSuperBasketCurrency()
    this.getBridgeVethCurrency()
    this.getPureCurrency()
    this.getBridgeVarrrCurrency()
    this.getBridgeChipsCurrency()
    this.getSwitchCurrency()
    this.getKaijuCurrency()
    this.getBridgeVdexCurrency()
    this.getNatiCurrency()
    this.getNatiOwlCurrency()
    this.getSuperVrscCurrency()
    this.getCybermoneyCurrency()
    this.getVYieldCurrency()
    this.getKekFrogCurrency()
    this.getBinancePrices()
    this.chains.forEach( chain => this.getStakingSupply(chain))
  }
};
</script>
<style></style>
