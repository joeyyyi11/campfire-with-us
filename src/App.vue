<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  createEmptyUser,
  PRELOAD_IMAGES,
  STORAGE_KEY,
} from './constants/config.js'
import {
  loadFromSheet,
  saveSuggestionToSheet,
  saveToSheet,
} from './composables/useVikaApi.js'
import { splitUsers } from './utils/users.js'
import StarsBackground from './components/StarsBackground.vue'
import CampfireScene from './components/CampfireScene.vue'
import ScrollContainer from './components/ScrollContainer.vue'
import TopAnimalBubble from './components/TopAnimalBubble.vue'
import HintModal from './components/HintModal.vue'
import AnimalSelection from './components/AnimalSelection.vue'
import QuestionPanel from './components/QuestionPanel.vue'
import SuggestionPanel from './components/SuggestionPanel.vue'

const allUsers = ref([])
const currentUser = ref(createEmptyUser())

const showAnimalSelect = ref(true)
const showQ1 = ref(false)
const showQ2 = ref(false)
const showQ3 = ref(false)
const showSuggestion = ref(false)
const showScene = ref(false)
const showBottomActions = ref(false)
const showAddMoreBtn = ref(false)
const showHint = ref(false)

const q1 = ref('最近我')
const q2 = ref('接下来')
const q3 = ref('')

const bottomUsers = ref([])
const topUsers = ref([])
const topBubbleUser = ref(null)

const sceneRef = ref(null)
const animalSelectRef = ref(null)
const suggestionRef = ref(null)

let topBubbleTimer = null

const showScroll = computed(
  () => showScene.value && topUsers.value.length > 0
)

function renderAll() {
  const split = splitUsers(allUsers.value, currentUser.value)
  bottomUsers.value = split.bottomUsers
  topUsers.value = split.topUsers
}

function updateFoxSize() {
  const c = sceneRef.value?.getCampfireEl?.()
  const fireHeight = c?.getBoundingClientRect().height || 0
  const size = Math.max(44, Math.min(145, fireHeight * 0.52))
  document.documentElement.style.setProperty('--fox-size', `${size}px`)
  sceneRef.value?.measureWidth()
}

function enterCampfire({ showWelcomeHint = false } = {}) {
  showAnimalSelect.value = false
  showQ1.value = false
  showQ2.value = false
  showQ3.value = false
  showScene.value = true
  showBottomActions.value = true
  showAddMoreBtn.value = true
  if (showWelcomeHint) showHint.value = true

  setTimeout(() => {
    updateFoxSize()
    sceneRef.value?.measureWidth()
    renderAll()
  }, 50)
}

function handleGoToQ1({ nickname, loc, animal }) {
  if (!nickname || !animal) {
    alert('请填写完整信息')
    return
  }
  currentUser.value.nickname = nickname
  currentUser.value.loc = loc
  currentUser.value.animal = animal
  showAnimalSelect.value = false
  showQ1.value = true
}

function handlePreview() {
  enterCampfire({ showWelcomeHint: true })
}

function nextQuestion(n) {
  if (n === 1) currentUser.value.answers.q1 = q1.value
  if (n === 2) currentUser.value.answers.q2 = q2.value

  if (n === 1) {
    showQ1.value = false
    showQ2.value = true
  } else if (n === 2) {
    showQ2.value = false
    showQ3.value = true
  }
}

function prevQuestion(n) {
  if (n === 2) currentUser.value.answers.q2 = q2.value
  if (n === 3) currentUser.value.answers.q3 = q3.value

  if (n === 2) {
    showQ2.value = false
    showQ1.value = true
  } else if (n === 3) {
    showQ3.value = false
    showQ2.value = true
  }
}

function createAvatar() {
  currentUser.value.answers.q3 = q3.value
  allUsers.value.push({ ...currentUser.value })
  saveToSheet(currentUser.value)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser.value))
  enterCampfire({ showWelcomeHint: true })
}

function resetForNewUser() {
  currentUser.value = createEmptyUser()
  q1.value = '最近我'
  q2.value = ''
  q3.value = ''
  animalSelectRef.value?.reset()
  suggestionRef.value?.reset()

  showScene.value = false
  showBottomActions.value = false
  showAddMoreBtn.value = false
  showHint.value = false
  showQ1.value = false
  showQ2.value = false
  showQ3.value = false
  showSuggestion.value = false
  showAnimalSelect.value = true
}

function openSuggest() {
  showSuggestion.value = true
}

function closeSuggest() {
  showSuggestion.value = false
}

function submitSuggestion(text) {
  if (!text) {
    alert('请填写建议内容')
    return
  }
  saveSuggestionToSheet(text)
  closeSuggest()
  alert('建议已提交，感谢反馈！')
}

function showTopAnimalBubble(user) {
  if (topBubbleTimer) clearTimeout(topBubbleTimer)
  topBubbleUser.value = user
  topBubbleTimer = setTimeout(() => {
    topBubbleUser.value = null
  }, 2800)
}

function preloadImages() {
  PRELOAD_IMAGES.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

function onResize() {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  updateFoxSize()
  sceneRef.value?.measureWidth()
  renderAll()
}

onMounted(async () => {
  preloadImages()

  const users = await loadFromSheet()
  allUsers.value = users

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      currentUser.value = JSON.parse(saved)
      showAnimalSelect.value = false
      showScene.value = true
      showBottomActions.value = true
      showAddMoreBtn.value = true
    } catch (e) {
      // ignore invalid cache
    }
  }

  if (showScene.value) {
    renderAll()
  }

  setTimeout(updateFoxSize, 100)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (topBubbleTimer) clearTimeout(topBubbleTimer)
})
</script>

<template>
  <StarsBackground />

  <CampfireScene
    ref="sceneRef"
    :active="showScene"
    :bottom-users="bottomUsers"
    :center-user="currentUser.nickname ? currentUser : null"
    :show-bottom-actions="showBottomActions"
    :show-add-more-btn="showAddMoreBtn"
    @reset="resetForNewUser"
    @open-suggest="openSuggest"
  />

  <ScrollContainer
    :visible="showScroll"
    :users="topUsers"
    @select-user="showTopAnimalBubble"
  />

  <TopAnimalBubble :user="topBubbleUser" />

  <HintModal :visible="showHint" @close="showHint = false" />

  <AnimalSelection
    ref="animalSelectRef"
    :active="showAnimalSelect"
    @go-to-q1="handleGoToQ1"
    @preview="handlePreview"
  />

  <QuestionPanel
    :active="showQ1"
    title="好久不见呀，最近过得好吗？"
    v-model="q1"
    :use-zpix-font="true"
    @next="nextQuestion(1)"
  />

  <QuestionPanel
    :active="showQ2"
    title="下一步有什么打算？"
    v-model="q2"
    :show-prev="true"
    @prev="prevQuestion(2)"
    @next="nextQuestion(2)"
  />

  <QuestionPanel
    :active="showQ3"
    title="给大家留下什么话or词 "
    v-model="q3"
    :show-prev="true"
    next-label="👑·完_成·👑"
    @prev="prevQuestion(3)"
    @next="createAvatar"
  />

  <SuggestionPanel
    ref="suggestionRef"
    :active="showSuggestion"
    @close="closeSuggest"
    @submit="submitSuggestion"
  />
</template>
