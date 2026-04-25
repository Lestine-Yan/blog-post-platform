<template>
  <div class="mx-auto p-0 m-0">
    <!-- 引入导航栏组件 -->
    <Navbar />
    <main class="flex flex-col items-center justify-center">
      <NuxtPage />
    </main>
  </div>
</template>
<script setup>
// 引入组件
import Navbar from '~/components/navbar.vue';
</script>