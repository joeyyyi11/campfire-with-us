<script setup>
defineProps({
  user: { type: Object, default: null },
})
</script>

<template>
  <div v-if="user" class="top-animal-bubble">
    <div>我是 {{ user.nickname }}</div>
    <div style="margin-top: 8px">{{ user.answers.q1 }}</div>
    <div style="margin-top: 8px">{{ user.answers.q2 }}</div>
    <div style="margin-top: 8px">想对大家说：{{ user.answers.q3 }}</div>
  </div>
</template>
