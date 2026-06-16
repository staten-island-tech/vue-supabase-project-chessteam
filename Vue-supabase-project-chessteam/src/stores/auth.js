import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})