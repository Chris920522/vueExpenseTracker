<template>
  <!-- 在開啟時將背景變暗 -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="close"></div>

  <!-- 側邊欄主體 -->
  <div class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300"
       :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
    <div class="p-4 flex justify-end">
      <button @click="close" class="text-xl font-bold">&times;</button>
    </div>
    <nav class="flex flex-col gap-4 p-4">
      <RouterLink to="/account" @click="close" class="hover:bg-slate-600">全部紀錄</RouterLink>
      <RouterLink v-for="account in store.accounts" 
                 :key="account"
                 :to="'/account/' + account" 
                 @click="close" 
                 class="hover:bg-slate-600">
        {{ account }}帳戶
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/store';

const store = useStore();
const isOpen = ref(false);

onMounted(() => {
  store.loadFromlocal();
});

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

defineExpose({ open, close });
</script>
