<template>
  <div class="container">
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
        <option value="現金">現金</option>
        <option value="銀行">銀行</option>
      </select>
      <button @click="addRecord">新增</button>
      <button @click="openAddCategoryModal">新增自訂類別</button>
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
  <div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h2>新增{{ modalType }}類別</h2>
    <input v-model="newCategory" placeholder="輸入新類別" />
    <div class="modal-buttons">
      <button @click="confirmAddCategory">確認</button>
      <button @click="showModal = false">取消</button>
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
const showModal = ref(false);
const newCategory = ref('');
const modalType = ref('收入');


onMounted(() => {
  const savedRecords = localStorage.getItem('Records');
  const savedIncomeCategories = localStorage.getItem('IncomeCategories');
  const savedExpenseCategories = localStorage.getItem('ExpenseCategories');

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

function deleteRecord(id) {
  const index = records.value.findIndex(record => record.id === id);
  if (index !== -1) {
    records.value.splice(index, 1);
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem('Records', JSON.stringify(records.value));
}

function openAddCategoryModal() {
  modalType.value = type.value;
  newCategory.value = '';
  showModal.value = true;
}

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
    showModal.value = false;
  } else {
    alert('請輸入有效的類別名稱');
  }
}

const categoryOptions = computed(() => {
  return type.value === '收入'
    ? ['薪水', '獎金', ...customIncomeCategories.value]
    : ['食', '衣', '住', '行', '育', '樂', ...customExpenseCategories.value];
});

watch(type, () => {
  category.value = type.value === '收入' ? '薪水' : '食';
});

const total = computed(() => {
  return records.value.reduce((sum, record) => {
    const amount = Number(record.amount);
    if (isNaN(amount)) return sum; // 忽略無效金額
    return record.type === '收入' ? sum + amount : sum - amount;
  }, 0);
})
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
</style>
