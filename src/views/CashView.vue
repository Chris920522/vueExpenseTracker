<!-- CashView.vue -->
<template>
  <div class="container">
    <h2>現金帳戶紀錄</h2>
    <span :class="cashAmount >= 0 ? 'amount-income' : 'amount-expense'">
      <h2>餘額:{{ cashAmount }}</h2>
    </span>
    <div class="recordsList">
      <ul>
        <li v-for="record in cashRecords" :key="record.id">
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
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const cashRecords = ref([])

onMounted(() => {
  const saved = localStorage.getItem('Records')
  if (saved) {
    cashRecords.value = JSON.parse(saved).filter(r => r.account === '現金')
  }
})

function deleteRecord(id) {
  const index = cashRecords.value.findIndex(record => record.id === id);
  if (index !== -1) {
    cashRecords.value.splice(index, 1);
    saveToStorage();
  }
}

const cashAmount = computed(() => {
  return cashRecords.value
    .filter(cashRecords => cashRecords.account === '現金') // 只留下現金帳戶的紀錄
    .reduce((sum, cashRecords) => {
      const amount = Number(cashRecords.amount);
      if (isNaN(amount)) return sum;
      return cashRecords.type === '收入' ? sum + amount : sum - amount;
    }, 0);
});

  

function saveToStorage() {
  // 注意：這裡必須重新寫回所有帳戶的紀錄，而不只是 cashRecords
  const saved = localStorage.getItem('Records');
  if (!saved) return;

  const allRecords = JSON.parse(saved);
  const newAllRecords = allRecords.filter(r => r.account !== '現金'); // 移除原本的現金紀錄
  newAllRecords.push(...cashRecords.value); // 加入刪除後的現金紀錄

  localStorage.setItem('Records', JSON.stringify(newAllRecords));
}
</script>
