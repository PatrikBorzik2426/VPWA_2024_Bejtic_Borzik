<template>
    <q-page>
      <q-drawer 
      show-if-above 
      v-model="leftDrawerOpen" 
      elevated
      mini
      side="left" 
      class="q-pa-md q-ma-none q-rounded-both bg-grey-10" 
      content-class="q-pa-none q-rounded-both"

      >
        <q-list>
          <!-- Radial Button for Profile -->
          <q-item>
            <q-btn round icon="account_circle" color="grey-9"  />
          </q-item>
  
          <!-- Radial Button for Friends -->
          <q-item>
            <q-btn round elevated icon="group" color="grey-9"  />
          </q-item>
  
          <!-- Radial Button for Servers -->
          <q-item>
            <q-btn round elevated icon="dns" color="grey-9"/>
          </q-item>
        </q-list>
      </q-drawer>
    </q-page>
  </template>



<script setup lang="ts">
import { ref } from 'vue'
const leftDrawerOpen = ref(true)

</script>



<style scoped>

.q-drawer{
    padding: 10px !important;
    max-height: 100vh !important;
    overflow: auto !important;
    border-top-right-radius: 15px !important;
    border-bottom-right-radius: 15px !important;
}

</style>