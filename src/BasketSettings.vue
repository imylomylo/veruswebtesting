<template>
  <div>
    <!-- Settings Button -->
    <button @click="showModal = true" class="btn btn-primary btn-sm">
      ⚙️ Basket Settings
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal modal-open" @click.self="cancelChanges">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Basket Display Settings</h3>
        
        <!-- Global Display Controls -->
        <div class="mb-6 p-4 bg-base-200 rounded-lg">
          <div class="text-sm font-semibold mb-3">Display Options (apply to all baskets)</div>
          <div class="flex flex-col gap-3">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="checkbox checkbox-sm" v-model="globalSettings.condensed" />
              <span>Condensed mode</span>
            </label>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center gap-1">
                <input type="checkbox" class="checkbox checkbox-xs" v-model="globalSettings.columns.pairGrid" />
                <span>Pair grid</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="checkbox" class="checkbox checkbox-xs" v-model="globalSettings.columns.reserveToTbtc" />
                <span>Reserve/tBTC column</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="checkbox" class="checkbox checkbox-xs" v-model="globalSettings.columns.lpPerReserve" />
                <span>LP/Reserve</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="checkbox" class="checkbox checkbox-xs" v-model="globalSettings.columns.reserves" />
                <span>Reserves</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="checkbox" class="checkbox checkbox-xs" v-model="globalSettings.columns.weight" />
                <span>Weight</span>
              </label>
            </div>
          </div>
        </div>

        <div class="mb-4 text-sm text-gray-600">
          Drag to reorder, toggle visibility, and click Save to keep your preferences.
        </div>

        <!-- Basket List -->
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(basket, index) in localBasketSettings"
            :key="basket.currencyid"
            :draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover.prevent
            @drop="handleDrop(index)"
            class="flex items-center gap-3 p-3 border rounded-lg cursor-move hover:bg-base-200"
            :class="{ 'opacity-50': !basket.visible }"
          >
            <!-- Drag Handle -->
            <div class="text-2xl cursor-grab active:cursor-grabbing">
              ⋮⋮
            </div>

            <!-- Visibility Toggle -->
            <input
              type="checkbox"
              v-model="basket.visible"
              class="checkbox checkbox-sm"
              :id="`basket-${basket.currencyid}`"
            />

            <!-- Basket Info -->
            <label :for="`basket-${basket.currencyid}`" class="flex-1 cursor-pointer">
              <div class="font-semibold">{{ basket.ticker }}</div>
              <div class="text-xs text-gray-500">{{ basket.currencyid }}</div>
            </label>

            <!-- Order Number -->
            <div class="flex items-center gap-1 text-sm text-gray-500">
              <button
                type="button"
                class="btn btn-ghost btn-xs"
                @click.stop="moveUp(index)"
                :aria-label="`Move ${basket.ticker} up`"
              >
                ▲
              </button>
              <div>#{{ index + 1 }}</div>
              <button
                type="button"
                class="btn btn-ghost btn-xs"
                @click.stop="moveDown(index)"
                :aria-label="`Move ${basket.ticker} down`"
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button @click="resetToDefaults" class="btn btn-outline btn-sm">
            Reset to Default
          </button>
          <button @click="cancelChanges" class="btn btn-ghost btn-sm">
            Cancel
          </button>
          <button @click="saveSettings" class="btn btn-primary btn-sm">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasketSettings',
  props: {
    baskets: {
      type: Array,
      required: true
    },
    currentSettings: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showModal: false,
      localBasketSettings: [],
      draggedIndex: null,
      globalSettings: {
        condensed: false,
        columns: {
          pairGrid: true,
          reserveToTbtc: true,
          lpPerReserve: true,
          reserves: true,
          weight: true
        }
      }
    };
  },
  watch: {
    baskets: {
      immediate: true,
      handler(newBaskets) {
        this.initializeSettings();
      }
    },
    showModal(isOpen) {
      if (isOpen) {
        this.initializeSettings();
      }
    }
  },
  methods: {
    initializeSettings() {
      // Create settings for each basket (only order and visibility are per-basket)
      this.localBasketSettings = this.baskets.map((basket, index) => {
        const savedSetting = this.currentSettings[basket.currencyid];
        return {
          currencyid: basket.currencyid,
          ticker: basket.ticker,
          visible: savedSetting?.visible !== undefined ? savedSetting.visible : true,
          order: savedSetting?.order !== undefined ? savedSetting.order : index
        };
      });

      // Load global display settings from first basket (they're the same for all)
      const firstSettings = this.baskets.length > 0 ? this.currentSettings[this.baskets[0].currencyid] : null;
      this.globalSettings = {
        condensed: firstSettings?.condensed !== undefined ? firstSettings.condensed : false,
        columns: {
          pairGrid: firstSettings?.columns?.pairGrid !== undefined ? firstSettings.columns.pairGrid : true,
          reserveToTbtc: firstSettings?.columns?.reserveToTbtc !== undefined ? firstSettings.columns.reserveToTbtc : true,
          lpPerReserve: firstSettings?.columns?.lpPerReserve !== undefined ? firstSettings.columns.lpPerReserve : true,
          reserves: firstSettings?.columns?.reserves !== undefined ? firstSettings.columns.reserves : true,
          weight: firstSettings?.columns?.weight !== undefined ? firstSettings.columns.weight : true
        }
      };

      // Sort by saved order
      this.localBasketSettings.sort((a, b) => a.order - b.order);
    },
    handleDragStart(index) {
      this.draggedIndex = index;
    },
    handleDrop(dropIndex) {
      if (this.draggedIndex === null || this.draggedIndex === dropIndex) {
        return;
      }

      const draggedItem = this.localBasketSettings[this.draggedIndex];
      this.localBasketSettings.splice(this.draggedIndex, 1);
      this.localBasketSettings.splice(dropIndex, 0, draggedItem);
      
      this.draggedIndex = null;
    },
    moveUp(index) {
      if (index <= 0) return;
      const item = this.localBasketSettings.splice(index, 1)[0];
      this.localBasketSettings.splice(index - 1, 0, item);
    },
    moveDown(index) {
      if (index >= this.localBasketSettings.length - 1) return;
      const item = this.localBasketSettings.splice(index, 1)[0];
      this.localBasketSettings.splice(index + 1, 0, item);
    },
    saveSettings() {
      // Update order and visibility (per-basket), apply global settings to all
      const settings = {};
      this.localBasketSettings.forEach((basket, index) => {
        settings[basket.currencyid] = {
          visible: basket.visible,
          order: index,
          condensed: this.globalSettings.condensed,
          columns: {
            pairGrid: this.globalSettings.columns.pairGrid,
            reserveToTbtc: this.globalSettings.columns.reserveToTbtc,
            lpPerReserve: this.globalSettings.columns.lpPerReserve,
            reserves: this.globalSettings.columns.reserves,
            weight: this.globalSettings.columns.weight
          }
        };
      });

      this.$emit('settings-changed', settings);
      this.showModal = false;
    },
    cancelChanges() {
      this.showModal = false;
      this.initializeSettings();
    },
    resetToDefaults() {
      this.localBasketSettings = this.baskets.map((basket, index) => ({
        currencyid: basket.currencyid,
        ticker: basket.ticker,
        visible: true,
        order: index
      }));
      this.globalSettings = {
        condensed: false,
        columns: {
          pairGrid: true,
          reserveToTbtc: true,
          lpPerReserve: true,
          reserves: true,
          weight: true
        }
      };
    }
  }
};
</script>

<style scoped>
.modal {
  z-index: 9999;
}
</style>
