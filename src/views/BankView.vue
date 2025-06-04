<!-- CashView.vue -->
<template>
  <div class="min-h-screen bg-gray-950">
    <div class="flex justify-center content-center">
      <h2 class="text-white">銀行帳戶紀錄</h2>
    </div>
    <span class="flex justify-center content-center p-3 text-2xl"
        :style="{ color: total > 0 ? 'green' : total < 0 ? 'red' : 'white' }">餘額:{{ bankAmount }}</span>
    <div class="recordsList">
      <ul>
        <li v-for="record in bankRecords" :key="record.id">
          <div class="flex justify-center items-center gap-4 bg-slate-200 border-solid rounded-md w-fit mx-auto p-5 mb-4">
            <span class="w-32"> 日期:{{ record.date }} </span>
            <span class="w-32"> 金額:{{ record.type === '收入' ? '+'
              : '-' }}{{ record.amount }} </span>
            <span class="w-32"> 類型:{{ record.type }} </span>
            <span class="w-32"> 項目名稱:{{ record.name }} </span>
            <span class="w-32"> 類別:{{ record.category }} </span>
            <span class="w-32">帳戶:{{ record.account }}</span>
            <button class="p-3 border-solid rounded-md bg-gray-400 hover:bg-slate-600" @click="deleteRecord(record.id)">刪除</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const bankRecords = ref([])

onMounted(() => {
  const saved = localStorage.getItem('Records')
  if (saved) {
    bankRecords.value = JSON.parse(saved).filter(r => r.account === '銀行')
  }
})

function deleteRecord(id) {
  const index = bankRecords.value.findIndex(record => record.id === id);
  if (index !== -1) {
    bankRecords.value.splice(index, 1);
    saveToStorage();
  }
}

const bankAmount = computed(() => {
  return bankRecords.value
    .filter(bankRecords => bankRecords.account === '銀行') // 只留下銀行帳戶的紀錄
    .reduce((sum, bankRecords) => {
      const amount = Number(bankRecords.amount);
      if (isNaN(amount)) return sum;
      return bankRecords.type === '收入' ? sum + amount : sum - amount;
    }, 0);
});


function saveToStorage() {
  // 注意：這裡必須重新寫回所有帳戶的紀錄，而不只是 cashRecords
  const saved = localStorage.getItem('Records');
  if (!saved) return;

  const allRecords = JSON.parse(saved);
  const newAllRecords = allRecords.filter(r => r.account !== '銀行'); // 移除原本的銀行紀錄
  newAllRecords.push(...bankRecords.value); // 加入刪除後的銀行紀錄

  localStorage.setItem('Records', JSON.stringify(newAllRecords));
}
</script>
