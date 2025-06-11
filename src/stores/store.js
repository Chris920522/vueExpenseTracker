import { defineStore } from 'pinia'

export const useStore = defineStore('accountStore', {
  state: () => ({
    accounts: [],
    records: [],
    categories: [],
  }),
  actions: {
    //從localstorage中載入資料
    loadFromlocal() {
      const savedAccounts = localStorage.getItem('Accounts');
      const savedRecords = localStorage.getItem('Records');
      const savedCategories = localStorage.getItem('Categories');
      
      this.accounts = savedAccounts ? JSON.parse(savedAccounts) : ['現金', '銀行'];
      this.records = savedRecords ? JSON.parse(savedRecords) : [];
      this.categories = savedCategories ? JSON.parse(savedCategories) : [];
    },
    //將資料儲存到localstorage
    saveToLocal() {
      localStorage.setItem('Accounts', JSON.stringify(this.accounts));
      localStorage.setItem('Records', JSON.stringify(this.records));
      localStorage.setItem('Categories', JSON.stringify(this.categories));
    },
  },
  getters: {
    //計算總金額
    totalAmount: (state) => {
      return state.accounts.reduce((sum, amount) => sum + amount, 0)
    },
    //根據類別名稱篩選紀錄
    getRecordByCategory: (state) => (categoryName) => {
      return state.records.filter(record => record.category === categoryName);
    },
  }
})

