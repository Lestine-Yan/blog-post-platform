<template>
  <div>
    <h1>仪表盘（需登录）</h1>
    <p>欢迎，{{ user?.username }}</p>
    <button @click="authStore.logout()">退出登录</button>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const user = computed(() => authStore.user)

onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
  }
})
</script>