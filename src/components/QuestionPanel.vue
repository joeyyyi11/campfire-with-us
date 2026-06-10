<script setup>
defineProps({
  active: { type: Boolean, default: false },
  title: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  showPrev: { type: Boolean, default: false },
  nextLabel: { type: String, default: '说完了' },
  useZpixFont: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'prev', 'next'])
</script>

<template>
  <div class="question-container" :class="{ active }">
    <div class="question-title">{{ title }}</div>
    <textarea
      :value="modelValue"
      rows="4"
      :style="useZpixFont ? { fontFamily: 'zpix' } : undefined"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <div class="button-group">
      <button v-if="showPrev" @click="emit('prev')">上一句</button>
      <button @click="emit('next')">{{ nextLabel }}</button>
    </div>
  </div>
</template>
