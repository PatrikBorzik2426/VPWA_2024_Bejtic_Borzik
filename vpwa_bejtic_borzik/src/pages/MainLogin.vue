<template>
    <q-page :style-fn="myTweak" padding class="fullscreen flex column flex-center">
      <h2>Welcome in <spam class=" text-bold text-primary">Comb-bot</spam></h2>
      <q-form
        @submit.prevent="handleSubmit"
        @reset="handleSubmit"
        class="q-gutter-lg q-ma-lg flex column flex-center no-margin q-pa-xl"
      >
      
      <h1 class=" text-h4 q-ml-none q-mt-none q-mb-lg">Login Form</h1>

      <q-input v-model="login" :rules="[requiredRule]" :error="!!loginError" :error-message="loginError" type="text" label="Login" placeholder="example: YourLogin" class="no-margin"/>
      <q-input v-model="password" :rules="[requiredRule]" :error="!!loginError" :error-message="passwordError" type="text" label="Password" placeholder="example: YourPassword" class="no-margin"/>
    
        
      <div class=" button-div flex flex-center">
        <q-btn label="Submit" type="submit" color="primary" class=""/>
        <q-btn label="Reset" type="cancel" color="primary" flat class="" />
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

function myTweak() {
  return { backgroundColor: 'transparent' }

}

defineOptions({
  name: 'MainLogin'
});

</script>
  