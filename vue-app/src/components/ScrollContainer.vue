<script setup>
import { normalizeAnimalPath } from '../utils/users.js'

defineProps({
  visible: { type: Boolean, default: false },
  users: { type: Array, default: () => [] },
})

const emit = defineEmits(['select-user'])
</script>

<template>
  <div class="scroll-container" :style="{ display: visible && users.length > 0 ? 'block' : 'none' }">
    <div class="scroll-content">
      <div
        v-for="(user, index) in users"
        :key="`${user.nickname}-${user.animal}-${index}`"
        class="scroll-item"
        @click="emit('select-user', user)"
      >
        <img class="animal-image" :src="normalizeAnimalPath(user.animal)" alt="" />
        <div class="nickname">{{ user.nickname }}</div>
        <div class="loc">{{ user.loc }}</div>
      </div>
    </div>
  </div>
</template>
