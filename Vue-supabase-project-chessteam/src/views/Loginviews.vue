<template>
    <div class="container">
      <h1>Login</h1>
  
      <form @submit.prevent="loginUser" class="login-form">
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
  
      <p v-if="message">{{ message }}</p>
      <p>No account? <router-link to="/signup">Sign up</router-link></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '../utils/supabase'
  import { useAuthStore } from '../stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const email = ref('')
  const password = ref('')
  const message = ref('')
  
  async function loginUser() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
  
    if (error) {
      message.value = error.message
    } else {
      authStore.setUser(data.user)    // Pinia store gets the user
      router.push('/game')
    }
  }
  </script>
  
  <style scoped>
  .container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background: #1e1e1e;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 300px;
  }
  
  input {
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
  }
  
  button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #42b883;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  a {
    color: #42b883;
    text-decoration: none;
    font-weight: bold;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>