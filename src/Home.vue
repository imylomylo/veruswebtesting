<template>
  <!-- <router-link to="/bridge-veth">bridge.veth link</router-link> -->
  <div class="p-2">
    Dark/Light <input type="checkbox" value="garden" class="toggle theme-controller" />
  </div>
  <div class="p-2">
    These are the raw tables of Verus Trading (<a class="link link-info" target="_blank" href="https://hopiumbuilders.com/docs/recent-projects/verustrading/raw">About RVT by Hopium Builders</a>).
  </div>
  <div class="p-2">Donations Always Appreciated: <a class="link link-info" target="_blank"
      href="https://insight.verus.io/address/VERUSTRADING@">VERUSTRADING@</a> and <a class="link link-info"
      target="_blank" href="https://insight.verus.io/address/verus%20coin%20foundation@">Verus Coin Foundation@</a>
    Staking =>
    <span v-for="chain in chains">{{ chain.toUpperCase() }}: {{ stakingsupply[chain] }} || </span>
  </div>
  <div class="p-2">ARB Markets [BETA]
    <a class="link link-info" target="_blank" href="https://markets.verus.trading">https://markets.verus.trading</a>
  </div>
  <div class="p-2">Binance prices: BTCUSD: {{ parseFloat(binance_btcusd).toFixed(2) }} , ETHUSD: {{
    parseFloat(binance_ethusd).toFixed(2) }} , ETHBTC: {{
      parseFloat(binance_ethbtc).toFixed(6) }}</div>

  <div class="tabs tabs-border">
    <input type="radio" name="my_tabs_2" class="tab" aria-label="Mainnet" checked="checked" />
    <div class="tab-content border-base-300 bg-base-100 p-10">
      <div class="mb-4">
        <BasketSettings 
          :baskets="baskets" 
          :currentSettings="basketSettings"
          @settings-changed="handleSettingsChanged"
        />
      </div>
      
      <VerusBasket v-for="basket of filteredAndOrderedBaskets" :key="basket.currencyid"
        v-bind:fullyQualifiedName="basket.ticker" v-bind:webLink="basket.website"
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
import BasketSettings from './BasketSettings.vue'


export default {
  components: {
    VerusBasket,
    PriceInTbtc,
    BasketSettings
  },
  data() {
    return {
      chains: ['vrsc'],
      // chains: ['vrsc', 'varrr', 'vdex', 'chips'],
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
      basketSettings: {},
      vrsctest_currencyDictionary: [],
      vrsctest_baskets: ref([])
    };
  },
  computed: {
    filteredAndOrderedBaskets() {
      // Apply settings: filter out hidden baskets and sort by order
      const settingsArray = Object.entries(this.basketSettings).map(([currencyid, setting]) => ({
        currencyid,
        ...setting
      }));

      // Create a map for quick lookup
      const settingsMap = new Map(settingsArray.map(s => [s.currencyid, s]));

      return this.baskets
        .filter(basket => {
          const setting = settingsMap.get(basket.currencyid);
          return setting ? setting.visible !== false : true; // Default to visible
        })
        .sort((a, b) => {
          const settingA = settingsMap.get(a.currencyid);
          const settingB = settingsMap.get(b.currencyid);
          const orderA = settingA?.order !== undefined ? settingA.order : 999;
          const orderB = settingB?.order !== undefined ? settingB.order : 999;
          return orderA - orderB;
        });
    }
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
        .catch(async (error) => {
          console.log(`RPC for ${chain} failed, falling back to local file: ${error.message}`);
          this.stakingsupply[chain] = 'N/A';
          try {
            const response = await fetch(`/files/${chain}.mininginfo.json`);
            if (!response.ok) {
              throw new Error(`Failed to fetch local data for ${chain}: ${response.statusText}`);
            }
            const data = await response.json();
            this.stakingsupply[chain] = Math.trunc(data.stakingsupply);
          } catch (fetchError) {
            console.error(`Failed to fetch or parse local staking data for ${chain}:`, fetchError);
          }
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
    async getCurrencyDetails(rpcUrl, currencyid, useRpc = true) {
      if (useRpc) {
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
      }
      else {
        try {
          const response = await fetch(`/files/${currencyid}.json`);
          if (!response.ok) {
            throw new Error(`Failed to fetch local data for ${currencyid}: ${response.statusText}`);
          }
          const data = await response.json();
          const result = data;
          return {
            reservecurrencies: result.bestcurrencystate.reservecurrencies,
            bestheight: result.bestheight,
            supply: result.bestcurrencystate.supply,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    },
    async getFreshCurrencyData(rpcUrl, currencyid) {
      try {
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
        const response = await this.sendRequestRPC(requestData);
        const result = response.data.result;
        
        // Validate the result has required fields
        if (!result) {
          console.error(`No result for currency ${currencyid}`);
          return null;
        }
        
        if (!result.bestcurrencystate) {
          console.error(`Currency ${currencyid} has no bestcurrencystate:`, result);
          return null;
        }
        
        // getcurrency returns the currency definition fields at the root level
        // We need to restructure it to match the listcurrencies format
        // which has currencydefinition as a nested object
        return {
          currencydefinition: {
            version: result.version,
            options: result.options,
            name: result.name,
            currencyid: result.currencyid,
            parent: result.parent,
            systemid: result.systemid,
            notarizationprotocol: result.notarizationprotocol,
            proofprotocol: result.proofprotocol,
            idregistrationprice: result.idregistrationprice,
            idreferrallevels: result.idreferrallevels,
            idimportfees: result.idimportfees,
            currencies: result.currencies,
            conversions: result.conversions,
            initialsupply: result.initialsupply,
            prelaunchcarveout: result.prelaunchcarveout,
            initialcontributions: result.initialcontributions,
            idregistrationfees: result.idregistrationfees,
            idsignatureminimum: result.idsignatureminimum,
            minnotariesconfirm: result.minnotariesconfirm,
            billingperiod: result.billingperiod,
            notarizationreward: result.notarizationreward,
            startblock: result.startblock,
            endblock: result.endblock,
            fullyqualifiedname: result.fullyqualifiedname,
            currencynames: result.currencynames,
            definitiontxid: result.definitiontxid,
            definitiontxout: result.definitiontxout
          },
          bestcurrencystate: result.bestcurrencystate,
          bestheight: result.bestheight,
          besttxid: result.besttxid,
          besttxout: result.besttxout
        };
      } catch (error) {
        console.error(`Error fetching fresh data for ${currencyid}:`, error.message || error);
        return null;
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
    },
    loadBasketSettings() {
      try {
        const saved = localStorage.getItem('verusBasketSettings');
        if (saved) {
          this.basketSettings = JSON.parse(saved);
          console.log('Loaded basket settings from localStorage');
        }
      } catch (error) {
        console.error('Error loading basket settings:', error);
      }
    },
    saveBasketSettings() {
      try {
        localStorage.setItem('verusBasketSettings', JSON.stringify(this.basketSettings));
        console.log('Saved basket settings to localStorage');
      } catch (error) {
        console.error('Error saving basket settings:', error);
      }
    },
    handleSettingsChanged(newSettings) {
      this.basketSettings = newSettings;
      this.saveBasketSettings();
    },
    async loadCurrenciesFromFiles(existingCurrencyIds) {
      const loadedCurrencies = [];
      
      if (!existingCurrencyIds || existingCurrencyIds.length === 0) {
        console.log('No currency IDs provided to load from files');
        return loadedCurrencies;
      }
      
      console.log(`Attempting to load ${existingCurrencyIds.length} currency files...`);
      
      // Try each file individually - continue even if some files fail
      for (const currencyId of existingCurrencyIds) {
        try {
          console.log(`Attempting to fetch /files/${currencyId}.json`);
          const response = await fetch(`/files/${currencyId}.json`);
          
          if (!response.ok) {
            console.warn(`File not found or error loading ${currencyId}.json: ${response.status}`);
            continue; // Skip this file, try the next one
          }
          
          const data = await response.json();
          
          // Check if data has the expected structure
          // Some files might have currencydefinition at root level instead of nested
          let normalizedData = data;
          
          if (!data.currencydefinition && data.bestcurrencystate) {
            // File is structured like getcurrency response (currency definition at root)
            // Need to separate currency definition from state data
            const { bestcurrencystate, bestheight, besttxid, besttxout, lastconfirmedheight, lastconfirmedcurrencystate, ...currencyDefinitionFields } = data;
            
            normalizedData = {
              currencydefinition: currencyDefinitionFields,
              bestcurrencystate: bestcurrencystate,
              bestheight: bestheight,
              besttxid: besttxid,
              besttxout: besttxout
            };
          }
          
          // Validate that this is a currency object and matches the currency ID
          if (normalizedData.currencydefinition && 
              normalizedData.bestcurrencystate && 
              normalizedData.currencydefinition.currencyid === currencyId) {
            loadedCurrencies.push(normalizedData);
            console.log(`✓ Successfully loaded ${normalizedData.currencydefinition.name || currencyId} from file (height: ${normalizedData.bestheight})`);
          } else {
            console.warn(`✗ File ${currencyId}.json has invalid structure or mismatched ID`);
          }
        } catch (error) {
          // File doesn't exist or is invalid, skip it and continue with next file
          console.warn(`✗ Failed to load ${currencyId}.json: ${error.message}`);
        }
      }

      console.log(`Successfully loaded ${loadedCurrencies.length} out of ${existingCurrencyIds.length} currency files`);
      return loadedCurrencies;
    },
    mergeCurrencyData(existingCurrency, fileCurrency) {
      // Update existing currency with more recent data from file
      return {
        ...existingCurrency,
        reservecurrencies: fileCurrency.bestcurrencystate?.reservecurrencies || existingCurrency.reservecurrencies,
        supply: fileCurrency.bestcurrencystate?.supply || existingCurrency.supply,
        bestheight: fileCurrency.bestheight || existingCurrency.bestheight,
      };
    },
    async listCurrencies(rpcUrl, params = []) {
      const requestData = {
        method: 'post',
        url: rpcUrl,
        headers: { 'Content-Type': 'application/json' },
        data: {
          method: 'listcurrencies',
          params: params,
          id: 1
        }
      };
      const response = await this.sendRequestRPC(requestData);
      const result = response.data.result;
      
      // Convert object to array if needed
      // listcurrencies returns an object where keys are currency IDs
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        return Object.values(result);
      }
      
      return result;
    },
    async listCurrenciesFromExternalSystem(rpcUrl, systemName) {
      try {
        console.log(`Fetching currencies from external system: ${systemName}`);
        const params = [{ fromsystem: systemName }];
        const currencies = await this.listCurrencies(rpcUrl, params);
        console.log(`Fetched ${currencies.length} currencies from ${systemName}`);
        return currencies;
      } catch (error) {
        console.error(`Error fetching currencies from ${systemName}:`, error);
        return [];
      }
    },
    isBasket(currency) {
      // Check if options has bitmask 1 (options & 1 === 1)
      // and supply is greater than 0
      // Note: options is inside currencydefinition
      const hasCurrencyDef = currency.currencydefinition !== undefined && currency.currencydefinition !== null;
      const hasOptions = hasCurrencyDef && currency.currencydefinition.options !== undefined;
      const hasBitmask1 = hasOptions && (currency.currencydefinition.options & 1) === 1;
      const hasBestCurrencyState = currency.bestcurrencystate !== undefined && currency.bestcurrencystate !== null;
      const hasSupply = hasBestCurrencyState && currency.bestcurrencystate.supply > 0;
      
      return hasCurrencyDef && hasOptions && hasBitmask1 && hasBestCurrencyState && hasSupply;
    },
    async fetchCurrenciesFromRPC(rpcUrl) {
      try {
        // Step 1: Use listcurrencies to build currency dictionary only
        console.log('Step 1: Fetching all currencies for dictionary...');
        const currencies = await this.listCurrencies(rpcUrl);
        
        if (!Array.isArray(currencies)) {
          console.error('Currencies is not an array:', typeof currencies);
          throw new Error('Invalid currencies data structure');
        }
        
        // Fetch currencies from external systems for dictionary
        const externalSystems = ['vETH', 'CHIPS', 'VDEX', 'VARRR'];
        const externalCurrenciesPromises = externalSystems.map(system => 
          this.listCurrenciesFromExternalSystem(rpcUrl, system)
        );
        
        const externalCurrenciesArrays = await Promise.all(externalCurrenciesPromises);
        
        // Merge all currencies for dictionary
        const allCurrenciesForDict = [...currencies];
        externalCurrenciesArrays.forEach((externalCurrencies, index) => {
          console.log(`Adding ${externalCurrencies.length} currencies from ${externalSystems[index]} to dictionary`);
          allCurrenciesForDict.push(...externalCurrencies);
        });
        
        console.log('Total currencies for dictionary:', allCurrenciesForDict.length);
        
        // Build currency dictionary from listcurrencies response
        const currencyDict = allCurrenciesForDict
          .filter(currency => currency.currencydefinition)
          .map(currency => ({
            currencyid: currency.currencydefinition.currencyid,
            ticker: currency.currencydefinition.fullyqualifiedname || currency.currencydefinition.name,
            name: currency.currencydefinition.name
          }));
        
        console.log('Currency dictionary built with', currencyDict.length, 'entries');
        
        // Step 2: Check for manifest.json
        console.log('Step 2: Checking for manifest.json...');
        let manifestCurrencyIds = null;
        
        try {
          const manifestResponse = await fetch('/files/manifest.json');
          if (manifestResponse.ok) {
            const manifest = await manifestResponse.json();
            const manifestFiles = manifest.files || manifest;
            // Extract currency IDs from manifest (remove .json extension)
            manifestCurrencyIds = new Set(
              manifestFiles.map(file => file.replace('.json', ''))
            );
            console.log(`Manifest found with ${manifestCurrencyIds.size} currency files - will use files for these, RPC for others`);
          } else {
            console.log('No manifest.json found - will use RPC data for all baskets');
          }
        } catch (manifestError) {
          console.log('No manifest.json found - will use RPC data for all baskets');
        }
        
        // Step 3: Identify all basket currency IDs from listcurrencies
        console.log('Step 3: Identifying basket currencies...');
        const basketCurrencyIds = allCurrenciesForDict
          .filter(currency => this.isBasket(currency))
          .map(currency => currency.currencydefinition.currencyid);
        
        console.log(`Found ${basketCurrencyIds.length} basket currencies from RPC`);
        
        // Step 4: Load currency data from files
        // If manifest exists, only load currencies that are in the manifest
        // Otherwise, we won't try to load any files (use RPC for all)
        console.log('Step 4: Loading basket data from files...');
        
        let fileCurrenciesToLoad = [];
        if (manifestCurrencyIds && manifestCurrencyIds.size > 0) {
          // Filter basket currencies to only those in manifest
          fileCurrenciesToLoad = basketCurrencyIds.filter(id => manifestCurrencyIds.has(id));
          console.log(`Manifest lists ${manifestCurrencyIds.size} currencies, ${fileCurrenciesToLoad.length} are baskets that will be loaded from files`);
        } else {
          console.log('No manifest found - will use RPC for all baskets');
        }
        
        const fileCurrencies = await this.loadCurrenciesFromFiles(fileCurrenciesToLoad);
        
        // Create a map of file data
        const fileDataMap = new Map(
          fileCurrencies.map(fc => [fc.currencydefinition?.currencyid, fc])
        );
        
        console.log(`File data map contains ${fileDataMap.size} successfully loaded currencies`);
        
        // Step 5: Build baskets array
        // - If currency is in manifest: use file data (or skip if file failed)
        // - If currency is NOT in manifest: use RPC data
        const baskets = [];
        
        for (const currencyid of basketCurrencyIds) {
          const isInManifest = manifestCurrencyIds && manifestCurrencyIds.has(currencyid);
          const fileData = fileDataMap.get(currencyid);
          
          if (isInManifest) {
            // Currency is in manifest - MUST use file data or show nothing
            if (fileData) {
              console.log(`Using file data for ${fileData.currencydefinition.name}`);
              baskets.push({
                currencyid: currencyid,
                ticker: fileData.currencydefinition.fullyqualifiedname || fileData.currencydefinition.name,
                rpc: rpcUrl,
                reservecurrencies: fileData.bestcurrencystate.reservecurrencies,
                supply: fileData.bestcurrencystate.supply,
                bestheight: fileData.bestheight || 0,
                chart: [],
                recenttransfers: [],
                website: '',
                marketnote: '',
                explorer: 'https://insight.verus.io',
                isPreconvert: false
              });
            } else {
              console.warn(`Skipping ${currencyid} - in manifest but file failed to load`);
            }
          } else {
            // Currency is NOT in manifest - use RPC data
            console.log(`No manifest entry for ${currencyid}, fetching from RPC...`);
            const rpcData = await this.getFreshCurrencyData(rpcUrl, currencyid);
            
            if (rpcData && rpcData.currencydefinition && rpcData.bestcurrencystate) {
              baskets.push({
                currencyid: currencyid,
                ticker: rpcData.currencydefinition.fullyqualifiedname || rpcData.currencydefinition.name,
                rpc: rpcUrl,
                reservecurrencies: rpcData.bestcurrencystate.reservecurrencies,
                supply: rpcData.bestcurrencystate.supply,
                bestheight: rpcData.bestheight || 0,
                chart: [],
                recenttransfers: [],
                website: '',
                marketnote: '',
                explorer: 'https://insight.verus.io',
                isPreconvert: false
              });
            } else {
              console.warn(`Failed to fetch RPC data for ${currencyid}`);
            }
          }
        }
        
        console.log(`Final result: ${baskets.length} baskets loaded`);
        
        return { currencyDict, baskets };
      } catch (error) {
        console.error('Error fetching currencies from RPC:', error);
        throw error;
      }
    }

  },
  async created() {
    // Load saved basket settings from localStorage
    this.loadBasketSettings();
    
    try {
      // Try to fetch currencies from RPC first
      console.log('Fetching currencies from RPC server...');
      const mainnetData = await this.fetchCurrenciesFromRPC('https://rpc.vrsc.komodefi.com');
      
      this.currencyDictionary = mainnetData.currencyDict;
      this.baskets = mainnetData.baskets;
      
      console.log(`Loaded ${this.baskets.length} baskets from RPC`);
      
    } catch (error) {
      console.error('Failed to fetch from RPC, falling back to config files:', error);
      
      // // Fallback to config files
      // try {
      //   const [response1, response2] = await Promise.all([
      //     fetch('/currencies.json'),
      //     fetch('/baskets.json')
      //   ]);

      //   const data1 = await response1.json();
      //   const data2 = await response2.json();

      //   this.currencyDictionary = data1;
      //   this.baskets = data2;
        
      //   // Fetch details for each basket from config
      //   const fetchPromises = this.baskets.map(async (basket, index) => {
      //     let useRpc = true;
      //     if(basket.rpc === ''){
      //       useRpc = false;
      //     }
      //     const details = await this.getCurrencyDetails(basket.rpc, basket.currencyid, useRpc);
      //     if (details) {
      //       console.log(`Updating basket ${basket.ticker} with:`, details);
      //       this.baskets[index] = {
      //         ...basket,
      //         reservecurrencies: details.reservecurrencies,
      //         supply: details.supply,
      //         bestheight: details.bestheight,
      //       };
      //     }
      //     else {
      //       console.warn(`No details fetch for ${basket.currencyid}`);
      //     }
      //   });

      //   await Promise.all(fetchPromises);
      // } catch (fallbackError) {
      //   console.error('Error loading config files:', fallbackError);
      // }
    }

    // Load VRSCTEST data
    // try {
    //   const [response3, response4] = await Promise.all([
    //     fetch('/vrsctest_currencies.json'),
    //     fetch('/vrsctest_baskets.json')
    //   ]);

    //   const data3 = await response3.json();
    //   const data4 = await response4.json();

    //   this.vrsctest_currencyDictionary = data3;
    //   this.vrsctest_baskets = data4;
      
    //   // Fetch details for each VRSCTEST basket
    //   const fetchPromises = this.vrsctest_baskets.map(async (basket, index) => {
    //     const details = await this.getCurrencyDetails(basket.rpc, basket.currencyid);
    //     if (details) {
    //       console.log(`Updating basket ${basket.ticker} with:`, details);
    //       this.vrsctest_baskets[index] = {
    //         ...basket,
    //         reservecurrencies: details.reservecurrencies,
    //         supply: details.supply,
    //         bestheight: details.bestheight,
    //       };
    //     }
    //     else {
    //       console.warn(`No details fetch for ${basket.currencyid}`);
    //     }
    //   });

    //   await Promise.all(fetchPromises);
    // } catch (error) {
    //   console.error('Error loading VRSCTEST data:', error);
    // }

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
