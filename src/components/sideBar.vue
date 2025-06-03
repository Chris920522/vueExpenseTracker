<!-- src/components/Sidebar.vue -->
<template>
  <!-- 背景遮罩 -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="close"></div>

  <!-- 側邊欄 -->
  <div class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300"
       :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
    <div class="p-4 flex justify-end">
      <button @click="close" class="text-xl font-bold">&times;</button>
    </div>
    <nav class="flex flex-col gap-4 p-4">
      <RouterLink to="/" @click="close" class="hover:bg-slate-600">全部紀錄</RouterLink>
      <RouterLink to="/cash" @click="close" class="hover:bg-slate-600">現金帳戶</RouterLink>
      <RouterLink to="/bank" @click="close" class="hover:bg-slate-600">銀行帳戶</RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

function open() {
  isOpen.value = true;
}
function close() {
  isOpen.value = false;
}

defineExpose({ open, close });
</script>
