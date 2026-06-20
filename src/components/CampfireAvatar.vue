<script setup>
import { defineEmits } from 'vue'
import { normalizeAnimalPath } from '../utils/users.js'

const props = defineProps({
  user: { type: Object, required: true },
  left: { type: Number, required: true },
  offsetY: { type: Number, default: 0 },
})

const emit = defineEmits(['select'])

function onImageClick() {
  emit('select', {
    user: props.user,
    left: props.left,
    offsetY: props.offsetY,
  })
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
  </div>
</template>
