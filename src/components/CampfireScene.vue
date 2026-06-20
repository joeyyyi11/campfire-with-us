<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import CampfireAvatar from './CampfireAvatar.vue'
import { orderBottomUsers } from '../utils/users.js'

const props = defineProps({
  active: { type: Boolean, default: false },
  bottomUsers: { type: Array, default: () => [] },
  centerUser: { type: Object, default: null },
  showBottomActions: { type: Boolean, default: false },
  showAddMoreBtn: { type: Boolean, default: false },
})

const emit = defineEmits(['reset', 'open-suggest', 'select-bottom'])

const sceneRootRef = ref(null)
const avatarAreaRef = ref(null)
const campfireRef = ref(null)
const bubbleRef = ref(null)
const containerWidth = ref(window.innerWidth)
const sceneHeight = ref(0)
const selectedBottomUser = ref(null)
const selectedBottomAvatarPos = ref({ left: 0, offsetY: 0 })
const selectedBottomStep = ref(1)
let bottomBubbleTimer = null
const layoutKey = ref(0)

function measureWidth() {
  if (avatarAreaRef.value) {
    containerWidth.value = avatarAreaRef.value.clientWidth || window.innerWidth
  }
  if (sceneRootRef.value) {
    sceneHeight.value = sceneRootRef.value.clientHeight || window.innerHeight
  }
  layoutKey.value++
}

onMounted(() => {
  measureWidth()
})

const avatarPositions = computed(() => {
  layoutKey.value

  const filteredUsers = props.bottomUsers.filter(
    (user) => user.nickname && user.nickname.toString().trim()
  )

  const { ordered, centerIndex } = orderBottomUsers(
    filteredUsers,
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

const bottomBubblePoints = computed(() => {
  if (!selectedBottomUser.value || !bubbleRef.value || !sceneRootRef.value) return null

  const sceneRect = sceneRootRef.value.getBoundingClientRect()
  const bubbleRect = bubbleRef.value.getBoundingClientRect()
  if (!sceneRect || !bubbleRect) return null

  const startX = bubbleRect.left - sceneRect.left + bubbleRect.width / 2
  const startY = bubbleRect.bottom - sceneRect.top
  const foxSize =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--fox-size')
    ) || 80
  const avatarX = selectedBottomAvatarPos.value.left
  const avatarTopOffset = avatarAreaRef.value?.offsetTop || 0
  const avatarY =
    avatarTopOffset +
    selectedBottomAvatarPos.value.offsetY +
    foxSize * 0.5 +
    4

  return {
    x1: startX,
    y1: startY,
    x2: avatarX,
    y2: avatarY,
  }
})

watch(
  () => [props.bottomUsers, props.centerUser],
  () => measureWidth(),
  { deep: true }
)

function onSelectAvatar(payload) {
  if (bottomBubbleTimer) clearTimeout(bottomBubbleTimer)

  const isSameUser =
    selectedBottomUser.value &&
    selectedBottomUser.value.nickname === payload.user.nickname &&
    selectedBottomUser.value.animal === payload.user.animal

  selectedBottomUser.value = payload.user
  selectedBottomAvatarPos.value = {
    left: payload.left,
    offsetY: payload.offsetY,
  }
  selectedBottomStep.value = isSameUser
    ? Math.min(selectedBottomStep.value + 1, 3)
    : 1

  bottomBubbleTimer = setTimeout(() => {
    selectedBottomUser.value = null
    selectedBottomStep.value = 1
  }, 2800)
}

function getCampfireEl() {
  return campfireRef.value
}

defineExpose({
  getCampfireEl,
  measureWidth,
})
</script>

<template>
  <div ref="sceneRootRef" class="scene-root" :class="{ active }">
    <div class="ground"></div>
    <div ref="campfireRef" class="campfire"></div>
    <div ref="avatarAreaRef" class="avatar-area">
      <CampfireAvatar
        v-for="(item, index) in avatarPositions"
        :key="`${item.user.nickname}-${item.user.animal}-${index}`"
        :user="item.user"
        :left="item.left"
        :offset-y="item.offsetY"
        @select="onSelectAvatar"
      />
    </div>
    <svg
      v-if="bottomBubblePoints"
      class="bubble-connector"
      xmlns="http://www.w3.org/2000/svg"
      :width="containerWidth"
      :height="sceneHeight"
    >
      <line
        :x1="bottomBubblePoints.x1"
        :y1="bottomBubblePoints.y1"
        :x2="bottomBubblePoints.x2"
        :y2="bottomBubblePoints.y2"
      />
    </svg>
    <div
      v-if="selectedBottomUser"
      ref="bubbleRef"
      class="bubble bottom-center-bubble active"
    >
      <div>我是 {{ selectedBottomUser.nickname }}</div>
      <div style="margin-top: 8px">
        {{ selectedBottomStep === 1 ? selectedBottomUser.answers.q1 : '' }}
        {{ selectedBottomStep === 2 ? '接下来'+ selectedBottomUser.answers.q2 : '' }}
        {{ selectedBottomStep === 3 ? '想对大家说：' + selectedBottomUser.answers.q3 : '' }}
      </div>
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
