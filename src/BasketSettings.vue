<template>
  <div>
    <!-- Settings Button -->
    <button @click="showModal = true" class="btn btn-primary btn-sm">
      ⚙️ Basket Settings
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Basket Display Settings</h3>
        
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
            <div class="text-sm text-gray-500">
              #{{ index + 1 }}
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
      draggedIndex: null
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
      // Create settings for each basket
      this.localBasketSettings = this.baskets.map((basket, index) => {
        const savedSetting = this.currentSettings[basket.currencyid];
        return {
          currencyid: basket.currencyid,
          ticker: basket.ticker,
          visible: savedSetting?.visible !== undefined ? savedSetting.visible : true,
          order: savedSetting?.order !== undefined ? savedSetting.order : index
        };
      });

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
    saveSettings() {
      // Update order based on current position
      const settings = {};
      this.localBasketSettings.forEach((basket, index) => {
        settings[basket.currencyid] = {
          visible: basket.visible,
          order: index
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
    }
  }
};
</script>

<style scoped>
.modal {
  z-index: 9999;
}
</style>
