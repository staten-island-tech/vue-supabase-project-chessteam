<template>
 <div class="container">
   <h1>Type in username/email and password to play a game</h1>

   <form @submit.prevent="signUpUser" class="signup-form">
     <input
       v-model="username"
       type="text"
       placeholder="Username"
     />

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
       Sign Up
     </button>
   </form>

   <p v-if="message">{{ message }}</p>
 </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from './supabase'

const username = ref('')
const email = ref('')
const password = ref('')
const message = ref('')

async function signUpUser() {

 const { data, error } = await supabase.auth.signUp({
   email: email.value,
   password: password.value,

   options: {
     data: {
       username: username.value,
     }
   }
 })

 if (error) {
   message.value = error.message
   console.log(error)
 } else {
   message.value = 'Account created successfully!'
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

.signup-form {
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
</style>
