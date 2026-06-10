<script setup>
defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="hint" :class="{ show: visible }">
    <div style="text-align: center; font-weight: bold">——温馨提示——</div>
    <br />
    <div style="text-align: center; font-weight: bold">！hola！这里姑且算是个公共留言板吧！^</div>
    <br />
    <div style="text-align: center; font-weight: bold">试着'多'点点周围的小'火'伴吧^^</div>
    <br />
    PSSS:<br />
    最近本人感觉有很多事要忙，也尝感迷茫，感觉生活品质大打折扣 . . ' ' .<br />
    于是这时候就会想到我的朋友们都在做什么呢，也在working hard还是hard-working呢 ?此外，有好多人也很久没联络，想知道对方动态，但是突然小窗略诡异！<br />
    <div style="text-align: left">
      于是这个小小的篝火现场慢慢漫（将）成型了，大家完全匿名地留下信息，各种分享集中起来<br />
      你们的体验分享一定会给很多人带来新思考
    </div>
    <button class="hint-close-btn" @click="emit('close')">×</button>
  </div>
</template>
