<template>
  <q-infinite-scroll @load="onLoad" :offset="250" reverse class=" text-frame overflow-auto" ref="messageList">
    <template v-slot:loading>
        <div class="row justify-center">
          <q-spinner-dots color="primary" size="40px" />
        </div>
    </template>
    <q-item v-for="(message,index) in props.message" :key="message.id">
      <div class="row item-section-msg">
        <q-avatar class="profile-box q-mr-md">
          <img src="https://cdn.quasar.dev/img/avatar4.jpg" class=" full-height"/>
        </q-avatar>
        <div class=" message-box column">
          <p><span class=" text-bold cursor-pointer ">{{props.username[index].login}}</span>  <span class=" text-grey-7 q-ml-lg">{{ message.timestamp }}</span></p>
          <p class="">{{message.text }}</p>
        </div>
      </div>
    </q-item>
    
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { User } from 'src/types/User';
import { Message } from 'src/types/Message';
import { ref } from 'vue';

const props = defineProps<{
  username: User[];
  message: {[key: number]: Message};
}>();

const messages = ref<{[key: number]: Message;}>();
const users = ref<User[]>();
const messageList = ref<HTMLElement|null>(null);

if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }

const onLoad = () => {
  console.log('loading');
  // fetch more messages
};


</script>

<style>
.text-frame{
   max-height: 82.5vh;
}


</style>
