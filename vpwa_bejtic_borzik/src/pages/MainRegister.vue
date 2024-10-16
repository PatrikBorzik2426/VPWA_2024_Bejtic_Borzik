<template>
<q-page padding class="fullscreen flex flex-center">
  <div class=" q-mr-xl" style="max-width: 35%;">
    <h2 class="text-center" style="width: fit-content; margin: 0 auto;">
      Welcome to 
    </h2>
    <h2 class="text-bold text-primary text-center" style="width: fit-content; margin: 0 auto;">Comb-bot</h2>
    <p class=" text-h5 q-mt-xl" style="text-align: center; width: fit-content;">
      Our comb is your comb as well, where you can meet your friends, family and colleagues.<br>
      The biggest advantage of our comb is that you can meet people from all over the world. 
    </p>
  </div>

  <q-form
    @submit.prevent="handleSubmit"
    @reset="handleSubmit"
    class="q-gutter-lg q-ma-lg flex column flex-center no-margin q-pa-xl"
  >
    <h1 class="text-h4 q-ml-none q-mt-none q-mb-lg">Register Form</h1>


    <q-input dark v-model="firstName" :rules="[requiredRule]" :error="!!loginError" :error-message="firstNameError" type="text" label="First Name" placeholder="example: Joe" class="no-margin"/>
    <q-input dark v-model="lastName" :rules="[requiredRule]" :error="!!loginError" :error-message="lastNameError" type="text" label="Last Name" placeholder="example: Doe" class="no-margin"/>
    <q-input dark v-model="email" :rules="[requiredRule]" :error="!!loginError" :error-message="emailError" type="text" label="E-mail" placeholder="example: joe.deo@domain.eu" class="no-margin"/>
    <q-input dark v-model="login" :rules="[requiredRule]" :error="!!loginError" :error-message="loginError" type="text" label="Login" placeholder="example: YourLogin" class="no-margin"/>
    <q-input dark v-model="password" :rules="[requiredRule]" :error="!!loginError" :error-message="passwordError" type="text" label="Password" placeholder="example: YourPassword" class="no-margin"/>

    <div class=" button-div flex flex-center">
      <q-btn label="Submit" type="submit" color="primary"/>
      <q-btn label="Reset" type="cancel" color="primary" flat/>
    </div>
    <router-link to="/login" class="q-ml-none text-primary">I am already logged-in</router-link>
  </q-form>
</q-page>

</template>

<script setup lang="ts">
import { ref } from 'vue'
const login = ref<string>('')
const password = ref<string>('')
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')

const loginError = ref<string>('')
const passwordError = ref<string>('')
const firstNameError = ref<string>('')
const lastNameError = ref<string>('')
const emailError = ref<string>('')

const requiredRule = (value: string) => !!value || 'This field is required.'

function handleSubmit(){
  if (!login.value) {
    loginError.value = 'This field is required.'
  }
  if (!password.value) {
    passwordError.value = 'This field is required.'
  }
  if (!firstName.value) {
    firstNameError.value = 'This field is required.'
  }
  if (!lastName.value) {
    lastNameError.value = 'This field is required.'
  }
  if (!email.value) {
    emailError.value = 'This field is required.'
  }
}

defineOptions({
name: 'MainLogin'
});

</script>

<style>
  .q-btn {
    border-radius: 20rem;
    -webkit-border-radius: 20rem;
    -moz-border-radius: 20rem;
    -ms-border-radius: 20rem;
    -o-border-radius: 20rem;
    width: 45%;
  }
</style>

