<template>
  <main class="min-h-screen bg-gray-50">
    <div class="w-[720px] mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <p class="text-sm font-medium text-blue-600">Admin</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          发布博文
        </h1>
        <p class="mt-2 text-sm text-gray-500">
          填写标题、简介和 Markdown 正文即可创建文章
        </p>
      </div>

      <div
        v-if="!authStore.isAuthenticated || !authStore.user"
        class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"
      >
        <h2 class="text-base font-semibold text-amber-900">请先登录</h2>
        <p class="mt-2 text-sm text-amber-700">
          你还没有登录，登录后才可以发布文章。
        </p>
        <div class="mt-4">
          <button
            type="button"
            @click="goLogin"
            class="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
          >
            去登录
          </button>
        </div>
      </div>

      <form
        v-else
        @submit.prevent="submitPost"
        class="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div class="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
          当前发布者：
          <span class="font-medium text-gray-900">
            {{ authStore.user.username }}
          </span>
        </div>

        <div class="grid gap-6">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文章标题
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="标题"
              class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文章简介
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="一句话描述文章内容..."
              class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              正文内容（Markdown）
            </label>
            <textarea
              v-model="form.content"
              rows="16"
              placeholder="# 开始写作

这里输入 Markdown 内容..."
              class="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600"
        >
          {{ successMessage }}
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitting ? '发布中...' : '发布文章' }}
          </button>

          <button
            type="button"
            @click="resetForm"
            :disabled="submitting"
            class="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            重置
          </button>

          <NuxtLink
            to="/posts"
            class="inline-flex items-center rounded-xl px-4 py-3 text-sm font-medium text-blue-600 transition hover:text-blue-500"
          >
            去文章列表
          </NuxtLink>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { CreatePostPayload, CreatePostResponse } from '~/data/blog'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  title: '',
  description: '',
  content: '',
  published: true
})

const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.content = ''
  form.published = true
}

const goLogin = async () => {
  await navigateTo('/login')
}

const submitPost = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!authStore.isAuthenticated || !authStore.token) {
    errorMessage.value = '请先登录后再发布文章'
    return
  }

  if (!form.title.trim()) {
    errorMessage.value = '标题不能为空'
    return
  }

  if (!form.content.trim()) {
    errorMessage.value = '正文内容不能为空'
    return
  }

  const payload: CreatePostPayload = {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    content: form.content,
    published: form.published
  }

  try {
    submitting.value = true

    await $fetch<CreatePostResponse>('/api/posts/create', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    successMessage.value = '文章发布成功'
    resetForm()

    await router.push(`/`)
  } catch (error: any) {
    errorMessage.value = error?.data?.message || error?.data?.statusMessage || '文章发布失败'
  } finally {
    submitting.value = false
  }
}

useSeoMeta({
  title: '发布博文',
  description: '创建一篇新的博客文章'
})
</script>