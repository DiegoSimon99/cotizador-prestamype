<script setup lang="ts">
import { ref, computed } from 'vue'
import ExchangeRow from '~/components/ExchangeRow.vue'
import { useRatesStore } from '~/stores/useRates'

// ---------- Store de tasas ----------
const ratesStore = useRatesStore()

const { purchase_price, sale_price, lastUpdated } = storeToRefs(ratesStore)

// Para probar rápido (borra esto cuando ya leas de Firebase)
if (!ratesStore.ready) {
  ratesStore.setRates(3.557, 3.563)
}

// ---------- Dirección & Tabs ----------
type Tab = 'BUY' | 'SELL'     // BUY = Dólar compra, SELL = Dólar venta
const activeTab = ref<Tab>('BUY')

// topIsSoles: controla cuál fila va arriba en el UI
// Regla: en COMPRA (BUY) arriba va Soles (envías S/), en VENTA (SELL) arriba va Dólares
const topIsSoles = ref(true)

// rate dinámico según tab
const rate = computed(() =>
  activeTab.value === 'BUY' ? purchase_price.value : sale_price.value
)

// ---------- Montos ----------
const amountTop = ref(0)      // valor del input superior
const amountBottom = ref(0)   // valor del input inferior

// Resetea montos y recalcula
function recalcFromTop() {
  // Si arriba es SOL, abajo es USD. Si arriba es USD, abajo es SOL.
  if (topIsSoles.value) {
    // Soles -> Dólares  (venta): usd = soles / sale_price
    amountBottom.value = rate.value === 0 ? 0 : +(amountTop.value / rate.value).toFixed(2)
  } else {
    // Dólares -> Soles  (compra): soles = usd * purchase_price
    amountBottom.value = +(amountTop.value * rate.value).toFixed(2)
  }
}

function recalcFromBottom() {
  if (topIsSoles.value) {
    // Dólares (abajo) -> Soles (arriba): soles = usd * sale_price? NO, ojo:
    // Si top es Soles, rate es sale_price (SELL). Inversa de la fórmula de arriba:
    amountTop.value = +(amountBottom.value * rate.value).toFixed(2)
  } else {
    // Soles (abajo) -> Dólares (arriba): usd = soles / purchase_price? NO:
    // Si top es Dólares, rate es purchase_price (BUY). Inversa de la fórmula de arriba:
    amountTop.value = rate.value === 0 ? 0 : +(amountBottom.value / rate.value).toFixed(2)
  }
}

// Cuando cambia el tab, sincroniza orden visual y recalcula
function onTabClick(tab: Tab) {
  activeTab.value = tab
  topIsSoles.value = tab === 'BUY'   // BUY → Soles arriba, SELL → Dólares arriba
  // Recalcular manteniendo el valor del input de arriba como origen
  recalcFromTop()
}

// Botón de intercambio: invierte montos + dirección (tab) + orden
function onSwap() {
  // 1) invierte montos
  const tmp = amountTop.value
  amountTop.value = amountBottom.value
  amountBottom.value = tmp

  // 2) invierte tab/dirección
  activeTab.value = activeTab.value === 'BUY' ? 'SELL' : 'BUY'

  // 3) asegura orden visual coherente con el tab
  topIsSoles.value = activeTab.value === 'BUY'

  // 4) Recalcula desde el input que quedó arriba
  recalcFromTop()
}

// En el mount, deja todo coherente
onMounted(() => {
  topIsSoles.value = activeTab.value === 'BUY'
  amountTop.value = 0
  amountBottom.value = 0
})
</script>


<template>
  <main class="min-h-screen flex items-center bg-gradient-to-b md:bg-gradient-to-br from-[#4A28AF] to-[#6E46E6] text-white">
    <div class="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <!-- Texto -->
      <section class="order-2 md:order-1">
        <h1 class="text-4xl md:text-5xl font-bold leading-tight">
          El mejor <span class="block">tipo de cambio</span>
        </h1>
        <p class="mt-4 text-white/90 text-2xl">
          para cambiar dólares y soles <br>
          online en Perú
        </p>
      </section>

      <!-- Card del cotizador -->
      <section
        class="order-1 md:order-2 bg-white text-gray-900 rounded-2xl shadow-2xl p-6 md:px-15 w-full justify-self-center">
        <div class="flex items-end justify-between px-10 mb-10">
          <button class="text-center cursor-pointer" @click="onTabClick('BUY')">
            <div :class="['text-sm', activeTab === 'BUY' ? 'text-[#6E46E6]' : 'text-gray-500']">Dólar compra</div>
            <div
              :class="['font-bold', activeTab === 'BUY' ? 'text-[#6E46E6] border-b-2 border-[#6E46E6]' : 'text-gray-500']">
              {{ purchase_price.toFixed(3) }}
            </div>
          </button>

          <button class="text-center cursor-pointer" @click="onTabClick('SELL')">
            <div :class="['text-sm', activeTab === 'SELL' ? 'text-[#6E46E6]' : 'text-gray-500']">Dólar venta</div>
            <div
              :class="['font-bold', activeTab === 'SELL' ? 'text-[#6E46E6] border-b-2 border-[#6E46E6]' : 'text-gray-500']">
              {{ sale_price.toFixed(3) }}
            </div>
          </button>
        </div>

        <ExchangeRow v-if="topIsSoles" label="Soles" legend="Envías" right-prefix="S/" :model-value="amountTop"
          input-id="input-top" @update:modelValue="(v: number) => { amountTop = v }" @input="recalcFromTop"
          class="relative" />
        <ExchangeRow v-else label="Dólares" legend="Envías" right-prefix="$" :model-value="amountTop"
          input-id="input-top" @update:modelValue="(v: number) => { amountTop = v }" @input="recalcFromTop"
          class="relative" />

        <!-- Botón swap -->
        <div class="relative h-0">
          <button @click="onSwap" class="absolute left-1/2 -translate-x-1/2 -top-2
                 rounded-full w-12 h-12 grid place-items-center
                 bg-[#6E46E6] text-white shadow-lg ring-4 ring-purple-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 7h11M10 3l4 4-4 4M20 17H9m5 4l-4-4 4-4" />
            </svg>
          </button>
        </div>

        <!-- Fila inferior -->
        <div class="mt-8">
          <ExchangeRow v-if="topIsSoles" label="Dólares" legend="Recibes" right-prefix="$" :model-value="amountBottom"
            input-id="input-bottom" @update:modelValue="(v: number) => { amountBottom = v }"
            @input="recalcFromBottom" />
          <ExchangeRow v-else label="Soles" legend="Recibes" right-prefix="S/" :model-value="amountBottom"
            input-id="input-bottom" @update:modelValue="(v: number) => { amountBottom = v }"
            @input="recalcFromBottom" />
        </div>


        <button class="mt-12 w-full rounded-xl bg-[#6E46E6] hover:bg-[#5a36e3] text-white py-3 font-semibold
               shadow-md active:scale-95 transition cursor-pointer">
          Iniciar operación
        </button>

        <!-- Fecha -->
        <p class="text-xs text-gray-500 mt-3 text-center">
          Actualizado:
          <span v-if="lastUpdated">{{ new Date(lastUpdated as unknown as string | number | Date).toLocaleString()
          }}</span>
          <span v-else>—</span>
        </p>
      </section>
    </div>
  </main>
</template>
