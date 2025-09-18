<!-- ~/components/ExchangeRow.vue -->
<script setup lang="ts">
defineProps<{
  label: 'Soles' | 'Dólares'
  legend: 'Envías' | 'Recibes'
  rightPrefix: 'S/' | '$'
  modelValue: number
  inputId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'input'): void
}>()

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(',', '.')
  const v = Number(raw)
  emit('update:modelValue', isNaN(v) ? 0 : v)
  emit('input')
}
</script>

<template>
  <div
    class="grid grid-cols-[8.5rem_1fr] md:grid-cols-[9.5rem_1fr]
           rounded-xl border border-[#6E46E6] overflow-hidden bg-white shadow-sm">
    <!-- izquierda: etiqueta -->
    <div class="bg-[#F3F3F6] text-[#6E46E6] font-medium grid place-items-center px-4">
      {{ label }}
    </div>

    <!-- derecha: leyenda + input -->
    <div class="flex flex-col justify-center px-4 py-2">
      <p class="m-0 text-gray-500 text-sm text-right">{{ legend }}</p>

      <div class="flex items-center gap-2">
        <span class="text-gray-700 font-semibold">{{ rightPrefix }}</span>
        <input
          :id="inputId"
          type="number"
          inputmode="decimal"
          step="0.01"
          autocomplete="off"
          :value="modelValue"
          @input="onInput"
          class="flex-1 text-right bg-transparent outline-none py-1 appearance-none
                 [::-webkit-outer-spin-button]:appearance-none
                 [::-webkit-inner-spin-button]:appearance-none
                 [&::-moz-number-spin-box]:hidden
                 disabled:text-gray-400"
        />
      </div>
    </div>
  </div>
</template>
