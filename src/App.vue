<template>
  <div>
    <button @click="sidebar.open()" class="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-md">
      ☰
    </button>

    <Sidebar ref="sidebar" />
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/sideBar.vue' // ← 正確引用

const sidebar = ref(null)
</script>