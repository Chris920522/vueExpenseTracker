<template>
  <div class="bg- bg-gray-950">
    <!-- 伸縮按鈕 -->
    <div class="font-sans">
      <button @click="sidebar.open()" class="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-md">
        ☰
      </button>

      <Sidebar ref="sidebar" />
    </div>
    <!-- 新增按鈕欄位 -->
    <div class="font-sans">
      <div class="flex justify-evenly pb-10">
        <button class="border-solid rounded-md bg-green-300 p-2 mt-3" @click="openAddCategoryModal">新增自訂類別</button>
        <button class="border-solid rounded-md bg-green-300 p-2 mt-3" @click="openAddAccountModal">新增帳戶</button>
      </div>

      <Addcategory ref="addCategory" />
      <Addaccount ref="addAccount" />
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/sideBar.vue'
import Addcategory from './components/addCategory.vue'
import Addaccount from './components/addAccount.vue'
//Sidebar、Addcategory、Addaccount都是在每頁都會顯示，所以直接在App中引入。
const sidebar = ref(null)
const addCategory = ref(null)
const addAccount = ref(null)
//將addCategory和addAccount設為ref，並賦值為null，這樣可以在需要時使用它們的open方法來打開模態框。


function openAddCategoryModal() {
  addCategory.value.open()
}

function openAddAccountModal() {
  addAccount.value.open()
}

</script>