<template>
  <q-page padding class=" row q-pa-none">
    <SidePanel class="menu"/>
    <ChatWindow class=" chat-compo"/>
  </q-page>
</template>

<script setup lang="ts">
import SidePanel from '../components/SidePanel.vue'
import ChatWindow from '../components/ChatWindow.vue'

</script>

<style scoped>
  .q-page {
    background-color: var(--q-dark);
  }

  .chat-compo{
    width: 94.25%;
  }

  .menu{
    width: 75px;
  }
</style>
