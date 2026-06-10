<script setup>
import { onMounted, ref } from 'vue'

const starsRef = ref(null)

onMounted(() => {
  const stars = starsRef.value
  if (!stars) return

  for (let i = 0; i < 150; i++) {
    const s = document.createElement('div')
    s.className = 'star'
    const size = Math.random() * 4 + 1
    s.style.width = s.style.height = size + 'px'
    s.style.left = Math.random() * 100 + '%'
    s.style.top = Math.random() * 100 + '%'
    s.style.animationDelay = Math.random() * 2.5 + 's'
    stars.appendChild(s)
  }
})
</script>

<template>
  <div ref="starsRef" class="stars"></div>
</template>
