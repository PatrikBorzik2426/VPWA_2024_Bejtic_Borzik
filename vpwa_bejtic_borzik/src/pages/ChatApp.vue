<template>
  <q-page padding class=" row q-pa-none">
    <SidePanel class="menu" @show-friends="showDataList"/>
    <ChatWindow class="chat-compo" :showFriends="showDataListBoolean"/>
  </q-page>
</template>

<script setup lang="ts">
import SidePanel from '../components/SidePanel.vue'
import ChatWindow from '../components/ChatWindow.vue'

import { ref } from 'vue';

const showDataListBoolean = ref<boolean|number>(false);

const showDataList = (showFriends:boolean|number) => {
  showDataListBoolean.value = showFriends
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
