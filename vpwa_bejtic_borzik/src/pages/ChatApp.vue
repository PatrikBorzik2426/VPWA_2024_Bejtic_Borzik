<template>
  <q-page padding class=" row q-pa-none">
    <SidePanel class="menu" @emit-friends="ReceiveShowFriends" @emit-server-id="ReceiveServerId"/>
    <ChatWindow class="chat-compo" :receivedShowFriends="showFriends" :receivedServerId="ServerId"/>
  </q-page>
</template>

<script setup lang="ts">
import SidePanel from '../components/SidePanel.vue'
import ChatWindow from '../components/ChatWindow.vue'

import { ref } from 'vue';

const showFriends = ref<boolean>(false);
const ServerId = ref<number>(-1);

const ReceiveShowFriends = () => {
  showFriends.value = !showFriends.value
}

const ReceiveServerId = (id:number) => {
  ServerId.value = id
}


</script >

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
