<script setup>
import { computed, ref, watch } from 'vue'
import CampfireAvatar from './CampfireAvatar.vue'

const props = defineProps({
  active: { type: Boolean, default: false },
  bottomUsers: { type: Array, default: () => [] },
  showBottomActions: { type: Boolean, default: false },
  showAddMoreBtn: { type: Boolean, default: false },
})

const emit = defineEmits(['reset', 'open-suggest'])

const avatarAreaRef = ref(null)
const campfireRef = ref(null)
const containerWidth = ref(window.innerWidth)

const avatarPositions = computed(() => {
  const users = props.bottomUsers
  const w = containerWidth.value
  const centerX = w / 2
  const minSpacing = 100
  const maxSpacing = 150
  const spacing = Math.min(maxSpacing, Math.max(minSpacing, w / (users.length + 1)))

  return users.map((user, i) => {
    const offset = i - Math.floor(users.length / 2)
    return {
      user,
      left: centerX + offset * spacing,
    }
  })
})

function measureWidth() {
  if (avatarAreaRef.value) {
    containerWidth.value = avatarAreaRef.value.clientWidth || window.innerWidth
  }
}

watch(
  () => props.bottomUsers,
  () => measureWidth(),
  { deep: true }
)

function getCampfireEl() {
  return campfireRef.value
}

defineExpose({
  getCampfireEl,
  measureWidth,
})
</script>

<template>
  <div class="scene-root" :class="{ active }">
    <div class="ground"></div>
    <div ref="campfireRef" class="campfire"></div>
    <div ref="avatarAreaRef" class="avatar-area">
      <CampfireAvatar
        v-for="(item, index) in avatarPositions"
        :key="`${item.user.nickname}-${item.user.animal}-${index}`"
        :user="item.user"
        :left="item.left"
      />
    </div>
    <div class="bottom-actions" :class="{ active: showBottomActions }">
      <button
        class="add-more-btn"
        :class="{ active: showAddMoreBtn }"
        @click="emit('reset')"
      >
        添加更多小伙伴
      </button>
      <button @click="emit('open-suggest')">问题和建议</button>
    </div>
  </div>
</template>
