<template>
  <div class="overflow-auto q-pr-md" ref="messageList"
    :style = "{maxHeight: $q.screen.gt.sm ? '77.5vh' : '70vh'}"
  >
  <q-infinite-scroll :offset="250" reverse @load="addMessages">
    <template v-slot:loading>
        <div v-if="display_loader" class="row justify-center" >
          <q-spinner-dots color="primary" size="40px"/>
          <!-- <p v-else>No more messages ... You have found the beginning!</p> -->
        </div>
    </template>

    <q-item class="q-pa-none" v-for="(message) in wholeMessage" :key="message.id">
      <div class="row item-section-msg full-width q-pa-sm q-my-sm rounded-borders" :class="{'bg-primary':isMentioned(message.content)}">
        <q-avatar class="profile-box q-mr-md">
          <img :src="`https://ui-avatars.com/api/?name=${message.login}`" class=" full-height"/>
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
import { useQuasar } from 'quasar';
import { get } from 'http';

const $q = useQuasar();
const allnotifications = ref<boolean>(false);
const main_user_status = ref<string>('');
const main_user_nickname = ref<string>('');
const display_loader = ref<boolean>(false);

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
const additionalMsgs = ref<number>(5);
const maximumMsgs = ref<number>(0);
const scrollTop = ref(0);
const totalChannelsMessages = ref<number>();
let currentAdditionalMsgs = ref<number>(0);
let subCollector : any[] = [];

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
  }, 300);
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
  currentAdditionalMsgs.value = currentAdditionalMsgs.value + additionalMsgs.value;

  setTimeout(async () => {
    await loadMessages(props.receiverId);
  }, 1500);
}

function isMentioned(content: string) {
  const temp = content.includes('@' + localStorage.getItem('login'));

  return temp;
}

const showNotification = async (text: string, currentChannel: string) => {
  
  const visibility = $q.appVisible

  console.log('App visibility:', visibility);

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if(visibility){
    return;
  }

  if(main_user_status.value == 'Do Not Disturb'){
    return;
  }

  if(!allnotifications.value && !text.includes('@'+ main_user_nickname.value)){
    return;
    
  }
    const notification = new Notification('Comb Bot', {
      body: `${currentChannel}:\t ${text}`,
    });

    notification.onclick = () => {
      window.focus();
    };
   
};

async function subscribeToMessages() {
  let broadcast=''
  
  console.log('Server ID:', props.serverId, 'Friendship ID:', props.friendshipId);

  if(props.receiverId === undefined || props.receiverId < 0){
    return;
  }

  if(props.friendshipId === undefined || props.friendshipId < 0){
    return;
  }
  
  console.log('Subscribing to messages:', props.friendshipId);

  if (props.serverId != -1){
    broadcast = `channel:${props.receiverId}`;
  }else{
    broadcast = `friendship:${props.friendshipId}`;
  }

  let activeSubscription = transmit.subscription(broadcast); // Create a subscription to the channel
  await activeSubscription.create()

  console.log('Subscribed to:', broadcast);
   
  const unsub = activeSubscription.onMessage(async (message:any) => {
        await getMainUser();

        if (main_user_status.value == 'Offline'){
          return
        }

        console.log('Received message:', message); // Process the message
          
        try{
          await showNotification( message.message.content , message.message.login );
        }catch(e){
          console.log(e);
        }
        
        try{
          wholeMessage.value.push({
            id: message.message.id,
            login: message.message.login,
            content: message.message.content,
            timestamp: message.message.createdAt
          });
        }catch(e){
          console.log("Problém s pridaním správy: ",e);
        }
        
        try{
          scrollBottom();
        }catch{
          console.log("Problém so scrollom");
        }
      });

  subCollector.push(unsub, activeSubscription);
      
}

const loadMessages = async (newId : number) =>{
  await getMainUser();

  if (main_user_status.value == 'Offline'){
    wholeMessage.value = [];
    return;
  }

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

      const dataList = response.data.messages

      dataList.reverse();

      dataList.forEach((element:any) => {

        wholeMessage.value.push({
          id: element.messageId,
          login: element.senderName,
          content: element.messageContent,
          timestamp: element.createdAt
        });
      });

      console.log('Maximum messages:', response.data.totalMessagesCount);
      
      maximumMsgs.value = response.data.totalMessagesCount;

      await subscribeToMessages();
    });
}


const getMainUser = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:3333/user/get-main-user', {}, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      }
    });
    
    const mainUserData = response.data.formattedMainUser;  

    main_user_nickname.value = mainUserData.nickname;
    main_user_status.value = mainUserData.status;
    allnotifications.value = mainUserData.allnotifications;

    
  } catch (error : any) {
    console.error('Error during fetching main user:', error.response ? error.response.data : error.message);
  }
};

async function subscribeUpdateUser(){
  await getMainUser();

  console.log("Subscribing to user status with login: ", main_user_nickname.value);

  let activeSubscription = transmit.subscription(`updatedUser:${main_user_nickname.value}`); // Create a subscription to the channel
  await activeSubscription.create()

  console.log('Subscribed to:', `updatedUser:${main_user_nickname.value}`);
   
  const unsub = activeSubscription.onMessage(async (message:any) => {
      if (message.userStatus !== "Offline"){
        await loadMessages(props.receiverId);
      }
  });

  subCollector.push(unsub,activeSubscription);
}

//Event listeners for scrolling
onMounted(async() => {
  await getMainUser();

  if (messageList.value) {
    messageList.value.addEventListener('scroll', handleScroll);
  }

  // await subscribeUpdateUser();

});

onBeforeUnmount(async() => {
  if (messageList.value) {
    messageList.value.removeEventListener('scroll', handleScroll);
  }

  subCollector.forEach(async (unsub,index) => {
    console.log('Unsubscribing:', unsub);
    try{
      if (index % 2 == 0){
        await unsub();
      }else{
        await unsub.delete();
        console.log("Is deleted?", unsub.isDeleted());
      }
    }catch(e){
      console.log('Error during unsubscribing:', e);
    }
    
});
  
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

watch(
  () => main_user_status.value,
  (newVal, oldVal) =>{
    if (oldVal == 'Offline'){
      loadMessages(props.receiverId);
    }
  }
)

watch(
  () => currentAdditionalMsgs.value,
  (newVal) => {

    if (newVal < maximumMsgs.value-2){
      display_loader.value = true;
    }else{
      display_loader.value = false;
    }

    console.log("Display loader: ", display_loader.value);

  }
)


</script>


