// ~/stores/useRates.ts
import { defineStore } from 'pinia'

export const useRatesStore = defineStore('rates', {
  state: () => ({
    purchase_price: 0,              // precio compra (la casa te compra USD)
    sale_price: 0,                  // precio venta  (la casa te vende USD)
    lastUpdated: null as Date | null,
  }),
  getters: {
    ready: (s) => s.purchase_price > 0 && s.sale_price > 0,
    current: (s) => ({
      purchase_price: s.purchase_price,
      sale_price: s.sale_price,
      lastUpdated: s.lastUpdated,
    }),
  },
  actions: {
    setRates(purchase: number, sale: number) {
      this.purchase_price = purchase
      this.sale_price = sale
      this.lastUpdated = new Date()
    },
  },
})
