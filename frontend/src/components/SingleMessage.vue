<template>
  <div class="overflow-auto q-pr-md" ref="messageList"
    :style = "{maxHeight: $q.screen.gt.sm ? '82.5vh' : '70vh'}"
  >
  <q-infinite-scroll :offset="250" reverse @load="addMessages">
    <template v-slot:loading>
        <div class="row justify-center" >
          <q-spinner-dots color="primary" size="40px" />
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
import { ref, defineProps, watch, onMounted, onBeforeUnmount } from 'vue';
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
const additionalMsgs = 5;
const maximumMsgs = ref<number>(0);
let currentAdditionalMsgs = ref<number>(0);
const scrollTop = ref(0);


let stopListening : any;

const props = defineProps<{ 
  receiverId: number, 
  friendshipId : number,
  serverId: number
 }>();

function scrollBottom(){
  setTimeout(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    }
  }, 100);
}

function handleScroll() {
  if (messageList.value) {
    scrollTop.value = messageList.value.scrollTop;
    if (scrollTop.value === 0 && currentAdditionalMsgs.value+5 < maximumMsgs.value) {
      addMessages();
    }else{
      console.log("ScrollTop: ", scrollTop.value, "CurrentAdditional: ", currentAdditionalMsgs.value+5, "Maximum Msg:", maximumMsgs.value)
    }
  }
}

async function addMessages(){
  currentAdditionalMsgs.value = currentAdditionalMsgs.value + additionalMsgs;

  setTimeout(async () => {
    await loadMessages(props.receiverId);
  }, 1500);
}

function isMentioned(content: string) {
  const temp = content.includes('@' + localStorage.getItem('login'));

  return temp;
}

async function subscribeToMessages() {
  console.log('Subscribing to messages:', props.friendshipId);
  let broadcast=''

  if (props.serverId != -1){
    broadcast = `channel:${props.receiverId}`;
  }else{
    broadcast = `friendship:${props.friendshipId}`;
  }

  const activeSubscription = transmit.subscription(broadcast); // Create a subscription to the channel

  await activeSubscription.create()
   
  return activeSubscription.onMessage((message:any) => {
        console.log('Received message:', message); // Process the message
        
        wholeMessage.value.push({
          id: message.message.id,
          login: message.message.login,
          content: message.message.content,
          timestamp: message.message.createdAt
        });

        scrollBottom();
  });

}

const loadMessages = async (newId : number) =>{
  if (stopListening !== undefined) {
      stopListening();
    }

    console.log('Receiver ID changed:', newId);

    let endpoint = '';

    if (props.serverId != -1){
      endpoint = 'http://127.0.0.1:3333/messages/get-server-messages';
    }else{
      endpoint = 'http://127.0.0.1:3333/messages/get-personal-messages';
    }
    
    await axios.post(endpoint, {
      receiverId: newId,
      additionalMsgs: currentAdditionalMsgs.value
    }, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      }
    }).then(async response => {
      wholeMessage.value = [];  

      const dataList = response.data.messages.reverse()

      dataList.forEach((element:any) => {

        wholeMessage.value.push({
          id: element.messageId,
          login: element.senderName,
          content: element.messageContent,
          timestamp: element.createdAt
        });
      });

      maximumMsgs.value = response.data.totalMessagesCount;

      console.log('Maximum messages:', maximumMsgs.value);

      stopListening = await subscribeToMessages();
    });
}

//Event listeners for scrolling
onMounted(() => {
  if (messageList.value) {
    messageList.value.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (messageList.value) {
    messageList.value.removeEventListener('scroll', handleScroll);
  }
});

// Watch for changes in `receiverId` to update the messages
watch(
  () => props.receiverId,
  async (newId) => {
    console.log(props.receiverId, props.friendshipId, props.serverId);
    loadMessages(newId);
    scrollBottom();
  },
  { immediate: true },
);

// watch(wholeMessage, () => {
// },
// { immediate: true, deep: true });


</script>


