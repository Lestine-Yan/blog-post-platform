import { defineStore} from 'pinia'

interface User {
  id: number
  username: string
  email: string
}
interface LoginResponse {
  token: string
  user: User
}
interface RegisterResponse {
  message: string
  user?: User
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  async function register(username: string, email: string, password: string) {
    const data = await $fetch<RegisterResponse>('/api/register', {
      method: 'POST',
      body: { username, email, password }
    })
    return data
  }

  async function login(username: string, password: string) {
    const data = await $fetch<LoginResponse>('/api/login', {
      method: 'POST',
      body: { username, password }
    })
    token.value = data.token
    user.value = data.user
    return data
  }

  function logout() {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return { user, token, isAuthenticated, register, login, logout }
}, {
  persist: true  //pinia启用持久化
})