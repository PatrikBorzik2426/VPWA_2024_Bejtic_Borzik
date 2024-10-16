<template>
    <q-page padding class="fullscreen flex column flex-center page">
      <h2>Welcome to <spam class=" text-bold text-primary">Comb-bot</spam></h2>
      <q-form
        @submit.prevent="handleSubmit"
        @reset="handleSubmit"
        class="q-gutter-lg q-ma-lg flex column flex-center no-margin q-pa-xl text-color-white"
      >
      
      <h1 class=" text-h4 q-ml-none q-mt-none q-mb-lg">Login Form</h1>

      <q-input dark v-model="login" :rules="[requiredRule]" :error="!!loginError" :error-message="loginError" type="text" label="Login" placeholder="example: YourLogin" class="no-margin"/>
      <q-input dark v-model="password" :rules="[requiredRule]" :error="!!loginError" :error-message="passwordError" type="text" label="Password" placeholder="example: YourPassword" class="no-margin"/>
    
        
      <div class=" button-div flex flex-center">
        <q-btn label="Submit" type="submit" color="primary" class="button"/>
        <q-btn label="Reset" type="cancel" color="primary" flat class="button" />
      </div>
      
      <router-link to="/register" class=" q-ml-none text-primary">Go to Registration Page</router-link>

      </q-form>
    </q-page>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue'
const login = ref<string>('')
const password = ref<string>('')

const loginError = ref<string>('')
const passwordError = ref<string>('')

const requiredRule = (value: string) => !!value || 'This field is required.'

function handleSubmit(){
  if (!login.value) {
    loginError.value = 'This field is required.'
  }
  if (!password.value) {
    passwordError.value = 'This field is required.'
  }
}

defineOptions({
  name: 'MainLogin'
});

</script>

<style>
  .button {
    border-radius: 20rem;
    -webkit-border-radius: 20rem;
    -moz-border-radius: 20rem;
    -ms-border-radius: 20rem;
    -o-border-radius: 20rem;
    width: 45%;
  }

</style>
  