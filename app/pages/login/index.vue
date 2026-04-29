<template>
    <div class="bg-gray-100 border border-black/50 rounded-2xl m-24 p-4 h-[70dvh] w-[720px]">
        <div class="mx-auto flex flex-col items-center justify-center h-full">
            <h1 class="text-2xl text-black mb-8">登录</h1>
            <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-80">
                <div class="flex flex-col gap-2">
                    <label class="text-sm text-gray-600">用户名或邮箱</label>
                    <input
                        v-model="form.username"
                        type="text"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="请输入用户名或邮箱"
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm text-gray-600">密码</label>
                    <input
                        v-model="form.password"
                        type="password"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="请输入密码"
                    />
                </div>
                <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
                <button
                    type="submit"
                    :disabled="loading"
                    class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:bg-gray-400 transition-colors">
                    {{ loading ? '登录中...' : '登录' }}
                </button>
                <NuxtLink to="/register" class="text-center text-sm text-blue-500 hover:underline">
                    没有账号？去注册
                </NuxtLink>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const form = reactive({
    username: '',
    password: ''
})

const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
    if (!form.username || !form.password) {
        errorMsg.value = '用户名和密码不能为空'
        return
    }

    loading.value = true

    try {
        await authStore.login(form.username, form.password)

        navigateTo('/')
    } catch (error: any) {
        errorMsg.value = error.data?.message || '登录失败，请重试'
    } finally {
        loading.value = false
    }
}
useSeoMeta({
  title: '登录',
  description: '登录账号'
})
</script>