<template>
  <nav class="sticky top-0 z-50 w-full bg-black px-6 py-4">
    <div class="mx-auto flex max-w-5xl items-center justify-center gap-8">
      <NuxtLink to="/" class="text-white transition hover:text-blue-300">
        首页
      </NuxtLink>

      <form class="flex items-center gap-2" @submit.prevent="handleSearch">
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索标题或摘要"
          class="w-64 rounded-xl border border-gray-700 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
        >
        <button
          type="submit"
          class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          搜索
        </button>
      </form>

      <NuxtLink
        v-if="authStore.isAuthenticated"
        to="/dashboard"
        class="text-white transition hover:text-blue-300"
      >
        仪表盘
      </NuxtLink>

      <NuxtLink
        v-else
        to="/login"
        class="text-white transition hover:text-blue-300"
      >
        登录
      </NuxtLink>

      <NuxtLink to="/createPost" class="text-white transition hover:text-blue-300">
        发布
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()
const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')

watch(
  () => route.query.q,
  (value) => {
    keyword.value = typeof value === 'string' ? value : ''
  }
)

const handleSearch = async () => {
  const q = keyword.value.trim()

  if (!q) {
    await navigateTo('/')
    return
  }

  await navigateTo({
    path: '/',
    query: { q }
  })
}
</script>
