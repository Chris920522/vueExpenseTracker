<!-- App.vue -->
<template>
  <div>
    <nav>
      <router-link to="/">首頁</router-link> |
      <router-link to="/cash">現金帳戶</router-link> |
      <router-link to="/bank">銀行帳戶</router-link>
    </nav>

    <!-- 這裡就是路由切換顯示區域 -->
    <router-view />
  </div>
</template>

<script setup>
</script>