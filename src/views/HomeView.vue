<template>
  <div class="container">
    <div class="customBtn">
      <button @click="openAddCategoryModal">新增自訂類別</button>
      <button @click="openAddAccountModal">新增帳戶</button>
    </div>
    <div class="inputGroup">
      <input v-model="date" type="date" placeholder="日期">
      <input v-model="time" type="time" placeholder="時間">
      <input v-model="amount" type="number" placeholder="金額">
      <select v-model="type">
        <option value="收入">收入</option>
        <option value="支出">支出</option>
      </select>
      <input v-model="name" type="text" placeholder="項目名稱">
      <select v-model="category">
        <option value="">類型</option>
        <option v-for="option in categoryOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <select v-model="account">
        <option v-for="acc in accounts" :key="acc" :value="acc">
          {{ acc }}
        </option>
      </select>
      <button @click="addRecord">新增</button>
    </div>
    <span class="total" :style="{ color: total > 0 ? 'green' : total < 0 ? 'red' : 'black' }">餘額:{{ total }}</span>
    <div class="recordsList">
      <ul>
        <li v-for="record in records" :key="record.id">
          <div class="record">
            <span> 日期:{{ record.date }} </span>
            <span :class="record.type === '收入' ? 'amount-income' : 'amount-expense'"> 金額:{{ record.type === '收入' ? '+'
              : '-' }}{{ record.amount }} </span>
            <span> 類型:{{ record.type }} </span>
            <span> 項目名稱:{{ record.name }} </span>
            <span> 類別:{{ record.category }} </span>
            <span>帳戶:{{ record.account }}</span>
            <button @click="deleteRecord(record.id)">刪除</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- 新增類別面板切換 -->
  <transition name="modal-fade">
    <div v-if="showCategoriesModal" class="modal-overlay">
      <div class="modal-content">
        <h2>新增{{ modalType }}類別</h2>
        <input v-model="newCategory" placeholder="輸入新類別" />
        <div class="modal-buttons">
          <button @click="confirmAddCategory">確認</button>
          <button @click="showCategoriesModal = false">取消</button>
        </div>
        <ul class="item-list">
          <li v-for="(item, index) in modalType === '收入' ? customIncomeCategories : customExpenseCategories" :key="index">
            {{ item }}
            <button @click="deleteCategory(index)">刪除</button>
          </li>
        </ul>
      </div>
    </div>
  </transition>
  <!-- 新增帳戶面板切換 -->
  <transition name="modal-fade">
    <div v-if="showAccountModal" class="modal-overlay">
      <div class="modal-content">
        <h2>新增{{ modalAccount }}帳戶</h2>
        <input v-model="newAccount" placeholder="輸入新帳戶" />
        <div class="modal-buttons">
          <button @click="confirmAddAccount">確認</button>
          <button @click="showAccountModal = false">取消</button>
        </div>
        <ul class="item-list">
          <li v-for="(acc, index) in accounts" :key="index">
            {{ acc }}
            <button @click="deleteAccount(index)">刪除</button>
          </li>
        </ul>
      </div>
    </div>
  </transition>
  <!-- 提示訊息 -->
  <transition name="toast-fade">
    <div v-if="showToast" class="toast">{{ toastMessage }}</div>
  </transition>
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
const showCategoriesModal = ref(false);
const showAccountModal = ref(false);
const newCategory = ref('');
const newAccount = ref('');
const modalType = ref('收入');
const modalAccount = ref('');
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
//開啟新增類別面板
function openAddCategoryModal() {
  modalType.value = type.value;
  newCategory.value = '';
  showCategoriesModal.value = true;
}
//新增類別
function confirmAddCategory() {
  const trimmed = newCategory.value.trim();
  if (trimmed) {
    if (modalType.value === '收入') {
      if (!customIncomeCategories.value.includes(trimmed)) {
        customIncomeCategories.value.push(trimmed);
        localStorage.setItem('IncomeCategories', JSON.stringify(customIncomeCategories.value));
      }
    } else {
      if (!customExpenseCategories.value.includes(trimmed)) {
        customExpenseCategories.value.push(trimmed);
        localStorage.setItem('ExpenseCategories', JSON.stringify(customExpenseCategories.value));
      }
    }
    showCategoriesModal.value = false;
  } else {
    alert('請輸入有效的類別名稱');
  }
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
//開啟新增帳戶面板
function openAddAccountModal() {
  modalAccount.value = '';
  newAccount.value = '';
  showAccountModal.value = true;
  showTempToast('新增類別成功！');
}
//新增帳戶
function confirmAddAccount() {
  const trimmed = newAccount.value.trim();
  if (trimmed) {
    if (!accounts.value.includes(trimmed)) {
      accounts.value.push(trimmed);
      localStorage.setItem('Accounts', JSON.stringify(accounts.value));
      showTempToast('新增帳戶成功！');
    } else {
      alert('帳戶已存在！');
    }
    showAccountModal.value = false;
  } else {
    alert('請輸入有效的帳戶名稱');
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

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin-top: 60px;
}

.inputGroup {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.recordsList ul {
  list-style: none
}

.recordsList li {
  width: 90%;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.record {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  justify-content: center;
}

.recordsList span {
  min-width: 120px;
  margin-right: 5%;
  /* 控制每個資訊之間的間距 */
  display: inline-block;
}

.amount-income {
  color: green;
  font-weight: bold;
}

.amount-expense {
  color: red;
  font-weight: bold;
}

.total,
.bankAmount {
  font-size: 25px;
  font-family: 'Times New Roman', Times, serif;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  text-align: center;
}

.modal-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.customBtn {
  display: flex;
  gap: 10px;
  padding: 10px 20px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.5s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}

.toast-fade-enter-to,
.toast-fade-leave-from {
  opacity: 1;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #444;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
</style>
