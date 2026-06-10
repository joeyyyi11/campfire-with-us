<script setup>
import { ref } from 'vue'

defineProps({
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const suggestionText = ref('')

function handleSubmit() {
  emit('submit', suggestionText.value.trim())
}

defineExpose({
  reset() {
    suggestionText.value = ''
  },
})
</script>

<template>
  <div class="question-container" :class="{ active }">
    <div class="question-title">问题与建议</div>
    <textarea
      v-model="suggestionText"
      rows="6"
      placeholder="发现了页面 bug 或者希望改进的内容，欢迎写下来"
    />
    <div class="button-group">
      <button @click="emit('close')">取消</button>
      <button @click="handleSubmit">提交建议</button>
    </div>
  </div>
</template>
