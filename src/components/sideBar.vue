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
      <div v-for="account in store.accounts" 
           :key="account"
           class="flex items-center justify-between group">
        <RouterLink :to="'/account/' + account" 
                   @click="close" 
                   class="hover:bg-slate-600 flex-grow">
          {{ account }}帳戶
        </RouterLink>
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="startEdit(account)" 
                  class="text-blue-500 hover:text-blue-700">
            編輯
          </button>
          <button @click="deleteAccount(account)" 
                  class="text-red-500 hover:text-red-700">
            刪除
          </button>
        </div>
      </div>
    </nav>

    <!-- 編輯帳戶的彈出視窗 -->
    <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 class="text-lg font-bold mb-4">編輯帳戶名稱</h3>
        <input v-model="editAccountName" 
               type="text" 
               class="w-full border rounded p-2 mb-4"
               placeholder="請輸入新的帳戶名稱">
        <div class="flex justify-end gap-2">
          <button @click="saveEdit" 
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            儲存
          </button>
          <button @click="cancelEdit" 
                  class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/store';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const isOpen = ref(false);
const isEditing = ref(false);
const editAccountName = ref('');
const currentAccount = ref('');

onMounted(() => {
  store.loadFromlocal();
});

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function startEdit(account) {
  currentAccount.value = account;
  editAccountName.value = account;
  isEditing.value = true;
}

function saveEdit() {
  if (editAccountName.value.trim() === '') {
    alert('請輸入帳戶名稱');
    return;
  }

  if (store.accounts.includes(editAccountName.value) && editAccountName.value !== currentAccount.value) {
    alert('此帳戶名稱已存在');
    return;
  }

  // 更新帳戶名稱
  const index = store.accounts.indexOf(currentAccount.value);
  if (index !== -1) {
    store.accounts[index] = editAccountName.value;
    store.saveToLocal();
    
    // 如果當前正在查看被編輯的帳戶，則重定向到新名稱的帳戶頁面
    if (router.currentRoute.value.params.accountId === currentAccount.value) {
      router.push(`/account/${editAccountName.value}`);
    }
  }

  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
  editAccountName.value = '';
  currentAccount.value = '';
}

function deleteAccount(account) {
  if (confirm(`確定要刪除 ${account} 帳戶嗎？此操作將同時刪除該帳戶的所有記錄。`)) {
    // 從帳戶列表中移除
    store.accounts = store.accounts.filter(a => a !== account);
    
    // 從記錄中移除該帳戶的所有記錄
    const saved = localStorage.getItem('Records');
    if (saved) {
      const allRecords = JSON.parse(saved);
      const updatedRecords = allRecords.filter(r => r.account !== account);
      localStorage.setItem('Records', JSON.stringify(updatedRecords));
    }
    
    store.saveToLocal();
    
    // 如果當前正在查看被刪除的帳戶，則重定向到全部記錄頁面
    if (router.currentRoute.value.params.accountId === account) {
      router.push('/account');
    }
  }
}

defineExpose({ open, close });
</script>
