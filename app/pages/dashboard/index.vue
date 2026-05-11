<template>
  <main class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-blue-600">Dashboard</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            我的仪表盘
          </h1>
          <p class="mt-2 text-sm text-gray-500">
            管理个人信息和已发布的文章
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/createPost"
            class="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            发布文章
          </NuxtLink>
          <button
            type="button"
            @click="authStore.logout()"
            class="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            退出登录
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm"
      >
        加载中...
      </div>

      <div
        v-else-if="errorMessage"
        class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600"
      >
        {{ errorMessage }}
      </div>

      <div v-else class="space-y-6">
        <section class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div class="flex flex-wrap items-center gap-5">
            <div
              class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-xl font-semibold text-blue-600"
            >
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                :alt="user.username || '用户头像'"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ userInitial }}</span>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ user?.username || '未命名用户' }}
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                {{ user?.email || '暂无邮箱' }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                注册时间：{{ formatDate(user?.createdAt) }}
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">我的文章</h2>
              <p class="mt-1 text-sm text-gray-500">
                共 {{ posts.length }} 篇文章，可在这里隐藏或删除
              </p>
            </div>
            <button
              type="button"
              @click="fetchDashboard"
              :disabled="refreshing"
              class="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ refreshing ? '刷新中...' : '刷新' }}
            </button>
          </div>

          <div
            v-if="successMessage"
            class="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600"
          >
            {{ successMessage }}
          </div>

          <div
            v-if="actionErrorMessage"
            class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {{ actionErrorMessage }}
          </div>

          <div
            v-if="posts.length === 0"
            class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500"
          >
            你还没有发布文章。
          </div>

          <div v-else class="grid gap-4">
            <article
              v-for="post in posts"
              :key="post.id"
              class="rounded-2xl border border-gray-200 p-5 transition hover:border-gray-300"
            >
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <div class="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      class="rounded-full px-3 py-1 text-xs font-medium"
                      :class="post.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'"
                    >
                      {{ post.published ? '已公开' : '已隐藏' }}
                    </span>
                    <span class="text-xs text-gray-400">
                      {{ formatDate(post.createdAt) }}
                    </span>
                  </div>

                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ post.title }}
                  </h3>
                  <p class="mt-2 line-clamp-2 text-sm text-gray-500">
                    {{ post.description || '暂无简介' }}
                  </p>

                  <div class="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>点赞 {{ post.likeCount }}</span>
                    <span>评论 {{ post._count?.comments || 0 }}</span>
                    <span>更新 {{ formatDate(post.updatedAt) }}</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    v-if="post.published"
                    :to="`/posts/${post.slug}`"
                    class="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    查看
                  </NuxtLink>
                  <span
                    v-else
                    class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400"
                  >
                    已隐藏
                  </span>

                  <button
                    type="button"
                    @click="toggleVisibility(post)"
                    :disabled="workingPostId === post.id"
                    class="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {{ post.published ? '隐藏' : '取消隐藏' }}
                  </button>

                  <button
                    type="button"
                    @click="deletePost(post)"
                    :disabled="workingPostId === post.id"
                    class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    删除
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type {
  DashboardMeResponse,
  DashboardPostItem,
  DeletePostResponse,
  UpdatePostVisibilityResponse
} from '~/data/blog'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const user = ref<DashboardMeResponse['user'] | null>(null)
const posts = ref<DashboardPostItem[]>([])
const loading = ref(true)
const refreshing = ref(false)
const workingPostId = ref<number | null>(null)
const errorMessage = ref('')
const actionErrorMessage = ref('')
const successMessage = ref('')

const userInitial = computed(() => user.value?.username?.slice(0, 1).toUpperCase() || 'U')

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const authHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`
})

const handleAuthError = (error: any) => {
  if (error?.data?.statusCode !== 401 && error?.statusCode !== 401) {
    return false
  }

  errorMessage.value = '登录状态已失效，请重新登录'
  authStore.logout()
  return true
}

const fetchDashboard = async () => {
  errorMessage.value = ''
  actionErrorMessage.value = ''
  successMessage.value = ''

  if (!authStore.isAuthenticated || !authStore.token) {
    await navigateTo('/login')
    return
  }

  try {
    refreshing.value = !loading.value
    const data = await $fetch<DashboardMeResponse>('/api/dashboard/me', {
      headers: authHeaders()
    })

    user.value = data.user
    posts.value = data.posts
  } catch (error: any) {
    if (!handleAuthError(error)) {
      errorMessage.value = error?.data?.message || error?.data?.statusMessage || '仪表盘加载失败'
    }
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const toggleVisibility = async (post: DashboardPostItem) => {
  actionErrorMessage.value = ''
  successMessage.value = ''

  if (!authStore.isAuthenticated || !authStore.token) {
    await navigateTo('/login')
    return
  }

  try {
    workingPostId.value = post.id
    const data = await $fetch<UpdatePostVisibilityResponse>(`/api/posts/visibility/${post.id}`, {
      method: 'PATCH',
      body: {
        published: !post.published
      },
      headers: authHeaders()
    })

    const currentPost = posts.value.find((item) => item.id === post.id)
    if (currentPost) {
      currentPost.published = data.post.published
      currentPost.updatedAt = data.post.updatedAt
    }

    successMessage.value = data.post.published ? '文章已公开' : '文章已隐藏'
  } catch (error: any) {
    if (!handleAuthError(error)) {
      actionErrorMessage.value = error?.data?.message || error?.data?.statusMessage || '文章状态更新失败'
    }
  } finally {
    workingPostId.value = null
  }
}

const deletePost = async (post: DashboardPostItem) => {
  actionErrorMessage.value = ''
  successMessage.value = ''

  if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
    return
  }

  if (!authStore.isAuthenticated || !authStore.token) {
    await navigateTo('/login')
    return
  }

  try {
    workingPostId.value = post.id
    await $fetch<DeletePostResponse>(`/api/posts/${post.id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })

    posts.value = posts.value.filter((item) => item.id !== post.id)
    successMessage.value = '文章已删除'
  } catch (error: any) {
    if (!handleAuthError(error)) {
      actionErrorMessage.value = error?.data?.message || error?.data?.statusMessage || '文章删除失败'
    }
  } finally {
    workingPostId.value = null
  }
}

onMounted(() => {
  fetchDashboard()
})

useSeoMeta({
  title: '我的仪表盘',
  description: '查看个人信息并管理自己的博客文章'
})
</script>
