<template>
  <div class="min-h-screen bg-gray-950">
    <div class="flex justify-center content-center">
      <h2 class="text-white">{{ accountName }}帳戶紀錄</h2>
    </div>
    <span class="flex justify-center content-center p-3 text-2xl"
      :style="{ color: accountTotal > 0 ? 'green' : accountTotal < 0 ? 'red' : 'white' }">
      餘額:{{ accountTotal }}
    </span>

    <!-- 輸入表單 -->
    <div class="flex justify-center items-center gap-5 bg-slate-200 border-solid rounded-md w-fit mx-auto p-5 mb-5">
      <input v-model="date" type="date" placeholder="日期" class="p-2 border-solid rounded-md bg-gray-400 placeholder:text-gray-500">
      <input v-model="time" type="time" placeholder="時間" class="p-2 border-solid rounded-md bg-gray-400 placeholder:text-gray-500">
      <input v-model="amount" type="number" placeholder="金額" class="p-2 border-solid rounded-md bg-gray-400 placeholder:text-gray-500">
      <select v-model="type" class="p-2 border-solid rounded-md bg-gray-400">
        <option value="收入">收入</option>
        <option value="支出">支出</option>
      </select>
      <input v-model="name" type="text" placeholder="項目名稱" class="p-2 border-solid rounded-md bg-gray-400 placeholder:text-gray-500">
      <select v-model="category" class="p-2 border-solid rounded-md bg-gray-400">
        <option value="">類型</option>
        <option v-for="option in categoryOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <!-- 在全部頁面顯示帳戶選擇 -->
      <select v-if="accountName === '全部'" v-model="selectedAccount" class="p-2 border-solid rounded-md bg-gray-400">
        <option v-for="account in store.accounts" :key="account" :value="account">
          {{ account }}
        </option>
      </select>
      <button @click="addRecord" class="p-2 border-solid rounded-md bg-gray-400 hover:bg-slate-600">新增</button>
      <button @click="openCategoryManager" class="p-2 border-solid rounded-md bg-gray-400 hover:bg-slate-600">管理類別</button>
    </div>

    <!-- 紀錄列表 -->
    <div>
      <ul>
        <li v-for="record in accountRecords" :key="record.id">
          <div class="flex justify-center items-center gap-4 bg-slate-200 border-solid rounded-md w-fit mx-auto p-5 mb-4">
            <span v-if="editingId !== record.id" class="w-32"> 日期:{{ record.date }} </span>
            <input v-else v-model="editForm.date" type="date" class="w-32 p-2 border-solid rounded-md bg-gray-400">
            
            <span v-if="editingId !== record.id" class="w-32"> 金額:{{ record.type === '收入' ? '+' : '-' }}{{ record.amount }} </span>
            <input v-else v-model="editForm.amount" type="number" class="w-32 p-2 border-solid rounded-md bg-gray-400">
            
            <span v-if="editingId !== record.id" class="w-32"> 類型:{{ record.type }} </span>
            <select v-else v-model="editForm.type" class="w-32 p-2 border-solid rounded-md bg-gray-400">
              <option value="收入">收入</option>
              <option value="支出">支出</option>
            </select>
            
            <span v-if="editingId !== record.id" class="w-32"> 項目名稱:{{ record.name }} </span>
            <input v-else v-model="editForm.name" type="text" class="w-32 p-2 border-solid rounded-md bg-gray-400">
            
            <span v-if="editingId !== record.id" class="w-32"> 類別:{{ record.category }} </span>
            <select v-else v-model="editForm.category" class="w-32 p-2 border-solid rounded-md bg-gray-400">
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            
            <span class="w-32">帳戶:{{ record.account }}</span>
            
            <div class="flex gap-2">
              <button v-if="editingId !== record.id" 
                class="p-3 border-solid rounded-md bg-gray-400 hover:bg-slate-600"
                @click="startEdit(record)">編輯</button>
              <button v-else 
                class="p-3 border-solid rounded-md bg-green-400 hover:bg-green-600"
                @click="saveEdit(record.id)">儲存</button>
              <button v-if="editingId !== record.id"
                class="p-3 border-solid rounded-md bg-gray-400 hover:bg-slate-600"
                @click="deleteRecord(record.id)">刪除</button>
              <button v-else
                class="p-3 border-solid rounded-md bg-red-400 hover:bg-red-600"
                @click="cancelEdit">取消</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- 類別管理組件 -->
  <CategoryManager
    v-model:isOpen="isCategoryManagerOpen"
    v-model:incomeCategories="customIncomeCategories"
    v-model:expenseCategories="customExpenseCategories"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/stores/store';
import CategoryManager from '@/components/CategoryManager.vue';

const store = useStore();
const route = useRoute();
const accountRecords = ref([]);
// 帳戶名稱
const accountName = computed(() => route.params.accountId || '全部');

// 輸入欄位的資料
const date = ref('');
const time = ref('');
const amount = ref('');
const type = ref('收入');
const name = ref('');
const category = ref('');
const selectedAccount = ref('現金'); // 預設選擇現金帳戶
const customIncomeCategories = ref([]);
const customExpenseCategories = ref([]);

// 編輯相關的狀態
const editingId = ref(null);
const editForm = ref({
  date: '',
  time: '',
  amount: '',
  type: '收入',
  name: '',
  category: '',
});

const isCategoryManagerOpen = ref(false);

onMounted(() => {
  loadRecords();
  loadCategories();
  // 如果有帳戶列表，設定預設選擇第一個帳戶
  if (store.accounts.length > 0) {
    selectedAccount.value = store.accounts[0];
  }
});

// 監聽路由參數變化
watch(() => route.params.accountId, () => {
  loadRecords();
});

function loadRecords() {
  const saved = localStorage.getItem('Records');
  if (saved) {
    const allRecords = JSON.parse(saved);
    // 根據日期和時間排序，最近的日期顯示在最上面
    const sortedRecords = allRecords.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
      const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
      return dateB - dateA;
    });
    //先對所有記錄進行排序，再根據帳戶名稱篩選
    if (accountName.value === '全部') {
      accountRecords.value = sortedRecords;
    } else {
      accountRecords.value = sortedRecords.filter(r => r.account === accountName.value);
    }
  }
}

function loadCategories() {
  const savedIncomeCategories = localStorage.getItem('IncomeCategories');
  const savedExpenseCategories = localStorage.getItem('ExpenseCategories');
  
  if (savedIncomeCategories) {
    customIncomeCategories.value = JSON.parse(savedIncomeCategories);
  }
  if (savedExpenseCategories) {
    customExpenseCategories.value = JSON.parse(savedExpenseCategories);
  }
}

// 類別選項列表
const categoryOptions = computed(() => {
  return type.value === '收入'
    ? ['薪水', '獎金', ...customIncomeCategories.value]
    : ['食', '衣', '住', '行', '育', '樂', ...customExpenseCategories.value];
});

// 切換收入、支出類別顯示
watch(type, () => {
  category.value = type.value === '收入' ? '薪水' : '食';
});

function addRecord() {
  if (name.value.trim() !== "") {
    const newRecord = {
      id: Date.now() + Math.random(),
      date: date.value,
      time: time.value,
      amount: Number(amount.value),
      type: type.value,
      name: name.value,
      category: category.value,
      account: accountName.value === '全部' ? selectedAccount.value : accountName.value
    };

    // 先保存到 localStorage
    const saved = localStorage.getItem('Records');
    const allRecords = saved ? JSON.parse(saved) : [];
    allRecords.push(newRecord);
    localStorage.setItem('Records', JSON.stringify(allRecords));

    // 然後更新本地顯示
    if (accountName.value === '全部') {
      accountRecords.value = allRecords;
    } else {
      accountRecords.value = allRecords.filter(r => r.account === accountName.value);
    }
    
    // 清空輸入欄位
    name.value = '';
    date.value = '';
    time.value = '';
    amount.value = '';
    category.value = type.value === '收入' ? '薪水' : '食';
  }
  else {
    alert('請輸入事項')
  }
}

function deleteRecord(id) {
  // 先從 localStorage 中刪除
  const saved = localStorage.getItem('Records');
  if (!saved) return;

  const allRecords = JSON.parse(saved);
  const updatedRecords = allRecords.filter(r => r.id !== id);
  localStorage.setItem('Records', JSON.stringify(updatedRecords));

  // 然後更新本地顯示
  if (accountName.value === '全部') {
    accountRecords.value = updatedRecords;
  } else {
    accountRecords.value = updatedRecords.filter(r => r.account === accountName.value);
  }
}

// 開始編輯
function startEdit(record) {
  editingId.value = record.id;
  editForm.value = {
    date: record.date,
    time: record.time,
    amount: record.amount,
    type: record.type,
    name: record.name,
    category: record.category,
  };
}

// 儲存編輯
function saveEdit(id) {
  if (editForm.value.name.trim() === "") {
    alert('請輸入事項');
    return;
  }

  const saved = localStorage.getItem('Records');
  if (!saved) return;

  const allRecords = JSON.parse(saved);
  const index = allRecords.findIndex(r => r.id === id);
  
  if (index !== -1) {
    allRecords[index] = {
      ...allRecords[index],
      date: editForm.value.date,
      time: editForm.value.time,
      amount: Number(editForm.value.amount),
      type: editForm.value.type,
      name: editForm.value.name,
      category: editForm.value.category,
    };
    
    localStorage.setItem('Records', JSON.stringify(allRecords));
    
    if (accountName.value === '全部') {
      accountRecords.value = allRecords;
    } else {
      accountRecords.value = allRecords.filter(r => r.account === accountName.value);
    }
  }
  
  editingId.value = null;
}

// 取消編輯
function cancelEdit() {
  editingId.value = null;
}

const accountTotal = computed(() => {
  return accountRecords.value.reduce((sum, record) => {
    const amount = Number(record.amount);
    if (isNaN(amount)) return sum;
    return record.type === '收入' ? sum + amount : sum - amount;
  }, 0);
});

function openCategoryManager() {
  isCategoryManagerOpen.value = true;
}

// 監聽類別變化並保存到 localStorage
watch([customIncomeCategories, customExpenseCategories], () => {
  localStorage.setItem('IncomeCategories', JSON.stringify(customIncomeCategories.value));
  localStorage.setItem('ExpenseCategories', JSON.stringify(customExpenseCategories.value));
}, { deep: true });
</script>