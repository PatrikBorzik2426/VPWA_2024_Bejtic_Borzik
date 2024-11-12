<template>
  <div class="overflow-auto q-pr-md" ref="messageList"
    :style = "{maxHeight: $q.screen.gt.sm ? '82.5vh' : '70vh'}"
  >
  <q-infinite-scroll :offset="250" reverse >
    <template v-slot:loading>
        <div class="row justify-center" >
          <q-spinner-dots color="primary" size="40px"/>
          <!-- <p v-else>No more messages ... You have found the beginning!</p> -->
        </div>
    </template>

    <q-item class="q-pa-none" v-for="(message) in wholeMessage" :key="message.id">
      <div class="row item-section-msg full-width q-pa-sm q-my-sm rounded-borders" :class="{'bg-primary':isMentioned(message.content)}">
        <q-avatar class="profile-box q-mr-md">
          <img src="https://cdn.quasar.dev/img/avatar4.jpg" class=" full-height"/>
        </q-avatar>
        <div class=" message-box column">
          <p><span class=" text-bold cursor-pointer ">{{message.login}}</span>  <span class="q-ml-lg" :class="isMentioned(message.content) ? 'text-white' : 'text-grey-7'">{{ message.timestamp }}</span></p>
          <p class="">{{message.content}}</p>
        </div>
      </div>
    </q-item>
    
  </q-infinite-scroll>
</div>

</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { Transmit } from '@adonisjs/transmit-client';
import axios from 'axios';

interface Member{
  id : number,
  login: string,
  content: string,
  timestamp : string
}

const transmit = new Transmit({
    baseUrl: 'http://127.0.0.1:3333',
  });
const wholeMessage = ref<Member[]>([]);
const messageList = ref<HTMLElement | null>(null);

let stopListening : any;

const props = defineProps<{ receiverId: number, friendshipId : number }>();

function scrollBottom(){
  setTimeout(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    }
  }, 100);
}

function isMentioned(content: string) {
  const temp = content.includes('@' + localStorage.getItem('login'));

  return temp;
}

async function subscribeToMessages() {
  console.log('Subscribing to messages:', props.friendshipId);

  const activeSubscription = transmit.subscription(`friendship:${props.friendshipId}`); // Create a subscription to the channel

  await activeSubscription.create()
   
  return activeSubscription.onMessage((message:any) => {
        console.log('Received message:', message); // Process the message
        
        wholeMessage.value.push({
          id: message.message.id,
          login: message.message.login,
          content: message.message.content,
          timestamp: message.message.createdAt
        });
  });

}

// Watch for changes in `receiverId` to update the messages
watch(
  () => props.receiverId,
  async (newId) => {
    console.log(stopListening);

    if (stopListening !== undefined) {
      stopListening();
    }

    console.log('Receiver ID changed:', newId);
    
    await axios.post('http://127.0.0.1:3333/messages/get-personal-messages', {
      receiverId: newId
    }, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      }
    }).then(async response => {
      wholeMessage.value = [];  

      response.data.messages.forEach((element:any) => {

        wholeMessage.value.push({
          id: element.messageId,
          login: element.senderName,
          content: element.messageContent,
          timestamp: element.createdAt
        });
      });

      stopListening = await subscribeToMessages();
    });
  },
  { immediate: true },
);

watch(wholeMessage, () => {
  scrollBottom();
},
{ immediate: true, deep: true });

</script>


