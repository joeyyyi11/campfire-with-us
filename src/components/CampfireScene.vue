<script setup>
import { computed, ref, watch } from 'vue'
import CampfireAvatar from './CampfireAvatar.vue'
import { orderBottomUsers } from '../utils/users.js'

const props = defineProps({
  active: { type: Boolean, default: false },
  bottomUsers: { type: Array, default: () => [] },
  centerUser: { type: Object, default: null },
  showBottomActions: { type: Boolean, default: false },
  showAddMoreBtn: { type: Boolean, default: false },
})

const emit = defineEmits(['reset', 'open-suggest'])

const avatarAreaRef = ref(null)
const campfireRef = ref(null)
const containerWidth = ref(window.innerWidth)
const layoutKey = ref(0)

function measureWidth() {
  if (avatarAreaRef.value) {
    containerWidth.value = avatarAreaRef.value.clientWidth || window.innerWidth
  }
  layoutKey.value++
}

const avatarPositions = computed(() => {
  layoutKey.value

  const { ordered, centerIndex } = orderBottomUsers(
    props.bottomUsers,
    props.centerUser
  )
  if (!ordered.length) return []

  const w = containerWidth.value
  const centerX = w / 2
  const foxSize =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--fox-size')
    ) || 80

  const fireEl = campfireRef.value
  const fireWidth =
    fireEl?.getBoundingClientRect().width || w * (w <= 600 ? 0.58 : 0.52)
  const radius = fireWidth * 0.5 + foxSize * 0.38
  const maxArcAngle = 72 * (Math.PI / 180)
  const maxOffset = Math.max(centerIndex, ordered.length - 1 - centerIndex) || 1

  return ordered.map((user, i) => {
    const rel = (i - centerIndex) / maxOffset
    const angle = rel * maxArcAngle
    const left = centerX + Math.sin(angle) * radius
    // 中间低、两侧高（更靠近篝火）
    const baseDown = foxSize * 0.48
    const offsetY = baseDown + Math.cos(angle) * foxSize * 0.52

    return { user, left, offsetY }
  })
})

watch(
  () => [props.bottomUsers, props.centerUser],
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
        :offset-y="item.offsetY"
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
