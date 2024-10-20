<template>
  <div class="chat-frame row bg-grey-10">
    
    <div class="channel-rooms rounded-borders col-2 bg-grey-9 shadow-7 q-mt-sm q-mb-sm q-mr-sm" style="width: 15%;">
    <div v-if="showChannels">
      <q-expansion-item
        dark
        header-class="server-name"
        expand-separator
        :label = "'Server ' + receivedServerId"
        class=" relative-position z-top"
        :duration = 0
      >
      <q-card dark class=" relative-position full-width">
        <div class=" absolute full-width bg-grey-9" style="top: 0; left: 0;">
          <q-card-section v-for="(value, key, index) in options" :key="key" class="cursor-pointer setting-row" :class="{ 'last-item-style': index === listOfChannels.length }" >
            <div class="row full-height full-width items-center setting-row" >
              <q-icon :name="key" color="" size="1.5rem" class="q-mr-sm" />
              <p class="q-ma-none">{{ value }}</p>
            </div>
          </q-card-section>
        </div>
      </q-card>
      </q-expansion-item>

      <q-list class=" full-width text-center ">
        <q-item class="hover-fill" v-for="(channel, index) in listOfChannels" :key="index" :class="{ 'selected-channel': currentChannel === channel }">
          <q-item-section @click="loadChannel(channel)" class=" cursor-pointer">
            <q-item-label># {{ channel }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      
    </div>
    <div v-else>
      <div class="q-mx-md row items-center">
        <h2 class=" q-ml-sm text-h6 text-left ">Friends List</h2>
        
          <div class="row q-ml-auto" style = "column-gap: 0.6rem;">
            <q-icon center color="primary" name="supervised_user_circle" class="cursor-pointer " size="1.25rem">
              <!-- <q-badge rounded floating color="red">3</q-badge> -->
              <q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
                Friend Requests
              </q-tooltip>
            </q-icon>
            
            <q-icon center color="primary" name="add_circle" class="cursor-pointer" size="1.25rem">
              <q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
                Add Friend
              </q-tooltip>
            </q-icon>
          </div>
      </div>
      
      <div class="scrollable">
      <q-list class=" q-pt-sm">
        <q-item v-for="friend in friendsList" :key="friend.id" class="q-pa-none hover-fill" :class="{ 'selected-channel': currentChannel === friend.name }">
        <q-btn
        rounded
        flat
        @click="selectFriend(friend.id)"
        class="q-pl-sm full-width row justify-center "
        style=" border-radius: .7rem;">
        <div class=" row justify-start items-center full-width " style=" max-width: 80%;">
          <q-avatar size="1.7rem" class="q-mr-sm " >
            <img :src="friend.avatar" alt="Friend Avatar" />
            <q-badge rounded floating color="grey-9" class="q-pa-none" >
              <q-icon :color="getStatusColor(friend.status)" :name="getStatusIcon(friend.status)" size="0.8rem"/>
            </q-badge>
            <q-img/>
          </q-avatar>
          <p class="q-ma-none">{{ friend.name }}</p>   

          <q-badge
            v-if="friend.notifications > 0"
            color="red"
            floating
            rounded
            class=" relative-position q-ml-auto"
            style=" top:0;"
          >{{ friend.notifications }}
          </q-badge>
        </div>  
    </q-btn>
    </q-item>
  </q-list>
    </div>
    </div>
  </div>
    

    <div class="chat-window rounded-borders bg-grey-9 col-10 q-pa-md q-mt-sm q-mb-sm column shadow-7" style="width:84.25%">
      <div class="message-holder">
        <h6 class=" q-mb-lg q-ma-none">{{ currentChannel }}</h6>
        <div>
          
          <SingleMessage :message1="userMessage1" :message2="userMessage2" v-if="!friendChatStatus"/>
          <SingleMessage :message1="dmMessageDict1" :message2="{}" v-else/>
        </div>
      </div>

      <div class=" q-mt-auto">
        <q-form class="full-width row bg-dark relative-position rounded-borders q-mb-md" v-if="showComponent">
          <q-list class=" full-width command-list z-top bg-dark rounded-borders">
            <q-item v-for="(value, key) in filteredCommands" :key="key" class="hover-fill">
              <q-item-section v-ripple class="command cursor-pointer" @click="pickCommand(key)">
                <q-item-label>{{ key }}</q-item-label>
                <q-item-label caption class="text-grey-9">{{ value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>

        <div class="someone-typing absolute z-top cursor-pointer" v-if="someIsTypingBool" @click="showWhatIsTyping" >
          <p class=" q-ma-none q-pb-md">{{messageBeingTyped}}</p>
        </div>

        <div class="cli bg-grey rounded-borders q-px-sm">
          <q-form class="full-height full-width row justify-between items-center" @submit.prevent="sendMessage">
            <q-input
              ref="inputCli"
              v-model="inputValue"
              class="no-border-input col-11"
              borderless
              color="transparent"
              autofocus
              hide-bottom-space
              dense
              placeholder="Type your message here"
              @update:model-value="checkCommand"
              @keyup.enter="sendMessage"
              autocomplete="off"
            />
            <q-btn icon="send" type="submit" flat unelevated color="black" />
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SingleMessage from './SingleMessage.vue';
import { User } from 'src/types/User'; 
import { Message } from 'src/types/Message';
import { ref, defineProps, watch } from 'vue';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';

const inputValue = ref<string>('');
const inputCli = ref<null|any>(null);
const showComponent = ref<boolean>(false);
const currentChannel = ref<string>('');
const listOfChannels = ref(['Channel 1', 'Channel 2']);
const $q = useQuasar();

let messageBeingTyped = ref<string>('Someone is typing ...')
let someIsTypingBool = ref<boolean>(false);
let filteredCommands = ref({});
let userMessage1 = ref< { [key: number]: Message }>({});
let userMessage2 = ref< { [key: number]: Message }>({});

let dmMessageDict1 = ref< { [key: number]: Message }>({});

const showChannels = ref<boolean>(false);

const props = defineProps<{
  receivedServerId: number;
  receivedShowFriends: boolean;
  lastUpdate: Date;
}>();

const friendChatStatus = ref<boolean>(true);

const commands = {
  '/create': 'Create a new channel',
  '/join': 'Join an existing channel',
  '/leave': 'Leave a channel',
  '/delete': 'Delete a channel',
}

const options = {
  'settings': 'Settings',
  'person_add' : 'Invite friend',
  'logout': 'Leave server'
}

interface Friend {
  id: number;
  name: string;
  notifications: number;
  avatar: string;
  status: string; 
}

const generateFriendsList = (count: number): Friend[] => {
  const friendsList: Friend[] = [];
  const statuses = ['Online', 'Offline', 'Do Not Disturb']; // Possible statuses

  for (let i = 1; i <= count; i++) {
    friendsList.push({
      id: i,
      name: `Friend ${i}`,
      notifications: Math.floor(Math.random() * 100),
      avatar: `https://cdn.quasar.dev/img/avatar${i}.jpg`,
      status: statuses[Math.floor(Math.random() * statuses.length)], 
    });
  }

  return friendsList;
};

const friendsList = ref<Friend[]>(generateFriendsList(20));

const selectFriend = (id: number) => {
  friendsList.value = friendsList.value.map((friend) => {
    console.log('Prop friend: ', props.receivedShowFriends);

    if (friend.id === id) {
      currentChannel.value = friend.name;
      friend.notifications = 0;

      friendChatStatus.value = props.receivedShowFriends;

      loadChannel(friendsList.value[id-1].name)
    }
    return friend;
  });

};

const getStatusColor = (status:string) => {
  switch (status) {
    case 'Online':
      return 'green';
    case 'Do Not Disturb':
      return 'red';
    case 'Offline':
      return 'grey';
    default:
      return 'primary';
  }
};

const getStatusIcon = (status:string) => {
  switch (status) {
    case 'Online':
      return 'circle';
    case 'Do Not Disturb':
      return 'remove_circle';
    case 'Offline':
      return 'trip_origin';
    default:
      return 'circle';
  }
};



const loadMessages = () => {

console.log('loading messages ', friendChatStatus.value);

userMessage1.value = {};
userMessage2.value = {};
dmMessageDict1.value = {};

for (let i = 0; i < 100; i++) {
  const user1: User = {
    id: i,
    login: 'User ' + i,
    password: 'password',
    email: 'user' + i + '@gmail.com',
  };

  const user2: User = {
    id: i+100,
    login: 'User ' + i+100,
    password: 'password',
    email: 'user' + i+100 + '@gmail.com',
  };

  const message1: Message = {
    id: i,
    text: 'Message ' + i,
    user: user1,
    timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
  };
  
  const message2: Message = {
    id: i+100,
    text: 'Message ' + i+100,
    user: user2,
    timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
  };  

  const dmMessage1: Message = {
    id: i,
    text: 'Message ' + i,
    user: {
      id: 0,
      login: 'Someone',
      password: 'password',
      email: ''},
    timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
  };
  
  const dmMessage2: Message = {
    id: i,
    text: 'Message ' + i,
    user: {
      id: 0,
      login: 'myDm',
      password: 'password',
      email: ''},
    timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
  };

  userMessage1.value[i] = message1;
  userMessage2.value[i+100] = message2;

  const dictLen = Object.keys(dmMessageDict1.value).length;

  dmMessageDict1.value[dictLen] = dmMessage1;
  dmMessageDict1.value[dictLen+1] = dmMessage2;

}
};

const sendMessage = () => {
  if (inputValue.value.length > 0) {
    const message: Message = {
      id: Object.keys(userMessage1.value).length,
      text: inputValue.value,
      user: {
        id: 0,
        login: 'Someone',
        password: 'password',
        email: 'someone@poop.com',
      },
      timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
    };
    userMessage1.value[Object.keys(userMessage1.value).length] = message;
  };

  showNotification(inputValue.value, currentChannel.value);
    
  inputValue.value = '';
  
  checkCommand();
};

const showNotification = (text: string, currentChannel :string) => {
  const htmlMessage = '<p class=" text-bold ">'+currentChannel+'</p>' + '<p>'+'Someone: '+text+'</p>';

  $q.notify({
    message:  htmlMessage,
    color: 'primary',
    position: 'bottom-right',
    timeout: 2000,
    html: true
  });
};

const showWhatIsTyping = () =>{
  let newValue = '';

  if (messageBeingTyped.value.split('\t')[1] === (inputValue.value) || newValue.split('\t')[1] === (inputValue.value)){
    messageBeingTyped.value = 'Someone is typing ...';
  }else{
    messageBeingTyped.value = 'Someone:\t' + inputValue.value
    newValue = messageBeingTyped.value;
  }
}

const checkCommand = () =>{
  showComponent.value = false; 

  filteredCommands.value = Object.fromEntries(
  Object.entries(commands).filter(([key]) => key.startsWith(inputValue.value) && inputValue.value.length > 0)
  );

  if (Object.keys(filteredCommands).length > 0) {
    showComponent.value = true;
  } else {
    showComponent.value = false;
  }

  if (inputValue.value.length > 0 && !inputValue.value.startsWith('/')) {
    someIsTypingBool.value = true;
  }else{
    someIsTypingBool.value = false;
  }

  console.log(someIsTypingBool.value);
};


const loadChannel = (channelName : string) => {
  currentChannel.value = channelName;
  loadMessages();
};

const pickCommand = (command : string) => {
  inputValue.value = command + ' ';
  showComponent.value = false;

  if(inputValue.value){
    inputCli.value.focus();
  }
  
};

watch(
  () => [props.receivedServerId, props.lastUpdate],
  ([newId]) => {
    console.log('receivedServerId value:', newId);
    if (newId !== undefined && newId !== null) {
      showChannels.value = true;

      if (newId !== -1) {
        friendChatStatus.value = false;
      }

      console.log('Server ID checked (same value too):', newId);
    }
  },
  { immediate: true }
);

watch(
  () => props.receivedShowFriends, 
  (newVal) => {

    
    if (newVal !== undefined) {
      showChannels.value = false
    }
    
    loadChannel(currentChannel.value);
  },
  {
    immediate: true,
    deep: true,
  }
);

loadChannel(friendsList.value[0].name);

</script>

<style>
.chat-window,
.channel-rooms {
  /* border: var(--grey) 3px solid; */
  border-radius: 1rem;
  max-height: 100vh !important;
}

.scrollable {
  overflow: auto !important;
  max-height: calc(100vh - 105px) !important;
}

.cli {
  max-height: 40px !important;
}

.hover-fill:hover {
  background-color: var(--q-primary);
  border-radius: 0.35rem;
}

.command-list{
  position: absolute;
  bottom: 10%;
}

.shadows {
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}


.someone-typing{
  bottom: 6% !important;
}

.selected-channel {
  background-color: var(--q-primary);
  border-radius: 0.35rem;
}

.server-name{
  border-radius: 1rem 1rem 0 0 !important;
}

.setting-row:hover{
  background-color: var(--q-primary);
}

.last-item-style{
  background-color: #ff0000;
}

::-webkit-scrollbar {
  display: none;
}

</style>
