<script setup>
import { computed, ref } from 'vue'
import { normalizeAnimalPath } from '../utils/users.js'

const props = defineProps({
  user: { type: Object, required: true },
  left: { type: Number, required: true },
  offsetY: { type: Number, default: 0 },
})

const bubbleIdx = ref(0)
const activeBubble = ref(-1)
let hideTimer = null

const bubbles = computed(() => [
  `我是 ${props.user.nickname}`,
  props.user.answers.q1,
  props.user.answers.q2,
  `想对大家说 ${props.user.answers.q3}`,
])

function onImageClick() {
  if (hideTimer) clearTimeout(hideTimer)
  const idx = bubbleIdx.value % bubbles.value.length
  activeBubble.value = idx
  bubbleIdx.value = idx + 1
  hideTimer = setTimeout(() => {
    activeBubble.value = -1
  }, 2000)
}
</script>

<template>
  <div
    class="avatar"
    :style="{ left: `${left}px`, top: `${offsetY}px`, transform: 'translateX(-50%)' }"
  >
    <img
      class="animal-image"
      :src="normalizeAnimalPath(user.animal)"
      alt=""
      @click="onImageClick"
    />
    <div class="address">{{ user.loc }}</div>
    <div
      v-for="(text, i) in bubbles"
      :key="i"
      class="bubble"
      :class="{ active: activeBubble === i }"
    >
      {{ text }}
    </div>
  </div>
</template>
