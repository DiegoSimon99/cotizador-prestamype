import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRatesStore } from '~/stores/useRates'

type Tab = 'buy' | 'sell' // buy = Dólar compra, sell = Dólar venta

export function useExchange() {
  const ratesStore = useRatesStore()
  const { purchase_price, sale_price } = storeToRefs(ratesStore)

  // Dirección del cambio: true => USD→PEN (Compra), false => PEN→USD (Venta)
  const isUsdToPen = ref<boolean>(true)

  // Monto que escribe el usuario SIEMPRE en el campo "Envías"
  const sendAmount = ref<number>(0)

  // Monto calculado que el usuario recibe
  const receiveAmount = computed<number>(() => {
    const amt = Number(sendAmount.value) || 0
    const buy = Number(purchase_price.value) || 0
    const sell = Number(sale_price.value) || 0

    if (!buy || !sell) return 0

    // Reglas del enunciado:
    // - de dólares a soles: monto_en_dólares * purchase_price
    // - de soles a dólares: monto_en_soles / sale_price
    return isUsdToPen.value
      ? +(amt * buy).toFixed(2)   // USD → PEN
      : +(amt / sell).toFixed(2)  // PEN → USD
  })

  // Tab sincronizado con la dirección
  const activeTab = computed<Tab>({
    get: () => (isUsdToPen.value ? 'buy' : 'sell'),
    set: (v) => {
      isUsdToPen.value = v === 'buy'
    }
  })

  // Swapper: NO toca sendAmount (así se “mantiene” el valor de Envías)
  function swapDirection() {
    isUsdToPen.value = !isUsdToPen.value
    // sendAmount se conserva; receiveAmount se recalcula por el computed
  }

  // Labels y prefijos según dirección
  const sendLabel = computed(() => (isUsdToPen.value ? 'Dólares' : 'Soles'))
  const sendPrefix = computed(() => (isUsdToPen.value ? '$' : 'S/'))

  const receiveLabel = computed(() => (isUsdToPen.value ? 'Soles' : 'Dólares'))
  const receivePrefix = computed(() => (isUsdToPen.value ? 'S/' : '$'))

  // Si cambian las tasas, recalc (el computed lo hace solo, esto es opcional)
  watch([purchase_price, sale_price], () => {
    // nothing more, computed ya reacciona
  })

  return {
    // state
    sendAmount,
    receiveAmount,
    isUsdToPen,
    activeTab,

    // UI helpers
    sendLabel,
    sendPrefix,
    receiveLabel,
    receivePrefix,

    // actions
    swapDirection,
  }
}
