<template>
  <q-list class=" text-frame overflow-auto q-pt-lg">
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
  </q-list>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { User } from 'src/types/User';
import { Message } from 'src/types/Message';

const props = defineProps<{
  username: User[];
  message: {[key: number]: Message};
}>();
</script>

<style>
.text-frame{
   max-height: 82.5vh;
}


</style>
