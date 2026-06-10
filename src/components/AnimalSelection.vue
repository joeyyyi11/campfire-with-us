<script setup>
import { ref } from 'vue'
import { ANIMAL_OPTIONS } from '../constants/config.js'

defineProps({
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['go-to-q1', 'preview'])

const nickname = ref('')
const loc = ref('')
const selectedAnimal = ref('')

function selectAnimal(path) {
  selectedAnimal.value = path
}

function handleGoToQ1() {
  emit('go-to-q1', {
    nickname: nickname.value.trim(),
    loc: loc.value.trim(),
    animal: selectedAnimal.value,
  })
}

function handlePreview() {
  emit('preview')
}

defineExpose({
  reset() {
    nickname.value = ''
    loc.value = ''
    selectedAnimal.value = ''
  },
})
</script>

<template>
  <div class="animal-selection" :class="{ active }">
    <div class="animal-title">选择你的"动物"形象</div>
    <div class="animal-options">
      <img
        v-for="animal in ANIMAL_OPTIONS"
        :key="animal.src"
        :src="animal.src"
        :alt="animal.alt"
        :class="{ selected: selectedAnimal === animal.src.replace(/^\//, '') }"
        @click="selectAnimal(animal.src.replace(/^\//, ''))"
      />
    </div>

    <div class="question-title" style="margin-top: 20px">输入你的昵称</div>
    <input
      v-model="nickname"
      type="text"
      style="font-family: 'zpix'"
      placeholder="比如：小鹅、红星x、莓..."
    />

    <div class="question-title" style="margin-top: 20px">此刻你之所在↓</div>
    <input
      v-model="loc"
      type="text"
      style="font-family: 'zpix'"
      placeholder="xx·xx / 碎空星…"
    />

    <button style="width: 100%; margin-top: 15px" @click="handleGoToQ1">准备就绪—></button>
    <button
      style="width: 100%; margin-top: 10px; background: var(--accent-soft)"
      @click="handlePreview"
    >
      先看看有谁在——>
    </button>
  </div>
</template>
