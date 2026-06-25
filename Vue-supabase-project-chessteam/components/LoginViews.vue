<template>
  <div class="container">
    <h1>Login to Play</h1>

    <form @submit.prevent="loginUser" class="login-form">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <button type="submit">
        Login
      </button>
    </form>

    <p v-if="message">{{ message }}</p>

    <p>
      Don't have an account?
      <router-link to="/signup">Sign Up</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../src/utils/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const message = ref('')

async function loginUser() {
  if (!email.value || !password.value) {
    message.value = 'Please fill in all fields.'
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Logged in successfully!'
    console.log(data)
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