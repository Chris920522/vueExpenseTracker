<template>
  <!-- 在開啟時將背景變暗 -->
  <transition enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">   
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="close"></div>
  </transition>
  <transition enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">新增帳戶</h2>
          <button @click="close" class="text-xl font-bold">&times;</button>
        </div>
        <input
          v-model="accountName"
          type="text"
          placeholder="請輸入帳戶名稱"
          class="w-full border rounded p-2 placeholder:text-gray-500"
        />
        <button @click="saveAccount" class="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded">儲存</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '@/stores/store';

const store = useStore();
const isOpen = ref(false);
const accountName = ref('');

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
  accountName.value = ''; // 清空輸入欄
}

function saveAccount() {
  if (accountName.value.trim() === '') {
    alert('請輸入帳戶名稱');
    return;
  }

  // 檢查是否已存在相同名稱的帳戶
  if (store.accounts.includes(accountName.value)) {
    alert('此帳戶名稱已存在');
    return;
  }

  // 儲存新帳戶
  store.accounts.push(accountName.value);
  store.saveToLocal();
  
  close();
}

defineExpose({ open, close });
</script>