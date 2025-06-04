<template>
  <div class="min-h-screen bg-gray-950">
    <div>
      <div class="flex justify-center items-center gap-5 bg-slate-200 border-solid rounded-md w-fit mx-auto p-5">
        <input v-model="date" type="date" placeholder="日期" class="p-2 border-solid rounded-md bg-gray-400 placeholder:text-gray-500">
        <input v-model="time" type="time" placeholder="時間" class="p-2 border-solid rounded-md bg-gray-400 placeholder:text-gray-500">
        <input v-model="amount" type="number" placeholder="金額" class="p-2 border-solid rounded-md bg-gray-400 placeholder:text-gray-500">
        <select v-model="type" class="p-2 border-solid rounded-md bg-gray-400">
          <option value="收入">收入</option>
          <option value="支出">支出</option>
        </select>
        <input v-model="name" type="text" placeholder="項目名稱" class="p-2 border-solid rounded-md bg-gray-400  placeholder:text-gray-500">
        <select v-model="category" class="p-2 border-solid rounded-md bg-gray-400">
          <option value="">類型</option>
          <option v-for="option in categoryOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <select v-model="account" class="p-2 border-solid rounded-md bg-gray-400">
          <option v-for="acc in accounts" :key="acc" :value="acc">
            {{ acc }}
          </option>
        </select>
        <button @click="addRecord" class="p-2 border-solid rounded-md bg-gray-400 hover:bg-slate-600">新增</button>
      </div>
      <span class="flex justify-center content-center p-3 text-2xl"
        :style="{ color: total > 0 ? 'green' : total < 0 ? 'red' : 'white' }">餘額:{{ total }}</span>
      <div>
        <ul>
          <li v-for="record in records" :key="record.id">
            <div
              class="flex justify-center items-center gap-4 bg-slate-200 border-solid rounded-md w-fit mx-auto p-5 mb-4">
              <span class="w-32"> 日期:{{ record.date }} </span>
              <span class="w-32"> 金額:{{ record.type === '收入' ? '+'
                : '-' }}{{ record.amount }} </span>
              <span class="w-32"> 類型:{{ record.type }} </span>
              <span class="w-32"> 項目名稱:{{ record.name }} </span>
              <span class="w-32"> 類別:{{ record.category }} </span>
              <span class="w-32">帳戶:{{ record.account }}</span>
              <button class="p-3 border-solid rounded-md bg-gray-400 hover:bg-slate-600"
                @click="deleteRecord(record.id)">刪除</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';

const date = ref('');
const amount = ref('');
const type = ref('收入');
const name = ref('');
const category = ref('');
const time = ref('');
const account = ref('現金');
const records = ref([]);
const customIncomeCategories = ref([]);
const customExpenseCategories = ref([]);
const modalType = ref('收入');
const accounts = ref(['現金', '銀行']); // 預設帳戶
const toastMessage = ref('');
const showToast = ref(false);


onMounted(() => {
  const savedRecords = localStorage.getItem('Records');
  const savedIncomeCategories = localStorage.getItem('IncomeCategories');
  const savedExpenseCategories = localStorage.getItem('ExpenseCategories');
  const savedAccounts = localStorage.getItem('Accounts');

  if (savedAccounts) {
    accounts.value = JSON.parse(savedAccounts);
  }

  if (savedRecords) {
    const parsedRecords = JSON.parse(savedRecords);
    records.value = parsedRecords.map(record => {
      if (typeof record === 'string') {
        return {
          id: Date.now() + Math.random(),
          date: '',
          time: '',
          amount: '',
          type: '',
          name: record,
          category: '',
          account: ''
        }
      }
      if (!record.id) {
        record.id = Date.now() + Math.random();
      }
      return record;
    })
  }
  if (savedIncomeCategories) {
    customIncomeCategories.value = JSON.parse(savedIncomeCategories);
  }
  if (savedExpenseCategories) {
    customExpenseCategories.value = JSON.parse(savedExpenseCategories);
  }
});
//新增紀錄
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
      account: account.value
    };

    records.value.push(newRecord);
    saveToStorage();
    name.value = '';
  }
  else {
    alert('請輸入事項')
  }
}
//刪除紀錄
function deleteRecord(id) {
  const index = records.value.findIndex(record => record.id === id);
  if (index !== -1) {
    records.value.splice(index, 1);
    saveToStorage();
  }
}
//儲存到LocalStorage
function saveToStorage() {
  localStorage.setItem('Records', JSON.stringify(records.value));
}

//刪除類別
function deleteCategory(index) {
  if (modalType.value === '收入') {
    customIncomeCategories.value.splice(index, 1);
    localStorage.setItem('IncomeCategories', JSON.stringify(customIncomeCategories.value));
  } else {
    customExpenseCategories.value.splice(index, 1);
    localStorage.setItem('ExpenseCategories', JSON.stringify(customExpenseCategories.value));
  }
}

//刪除帳戶
function deleteAccount(index) {
  accounts.value.splice(index, 1);
  localStorage.setItem('Accounts', JSON.stringify(accounts.value));
}
//類別選項列表
const categoryOptions = computed(() => {
  return type.value === '收入'
    ? ['薪水', '獎金', ...customIncomeCategories.value]
    : ['食', '衣', '住', '行', '育', '樂', ...customExpenseCategories.value];
});
//切換收入、支出類別顯示
watch(type, () => {
  category.value = type.value === '收入' ? '薪水' : '食';
});
//計算總額
const total = computed(() => {
  return records.value.reduce((sum, record) => {
    const amount = Number(record.amount);
    if (isNaN(amount)) return sum; // 忽略無效金額
    return record.type === '收入' ? sum + amount : sum - amount;
  }, 0);
})
//提示訊息
function showTempToast(message) {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000); // 顯示2秒
}

</script>
