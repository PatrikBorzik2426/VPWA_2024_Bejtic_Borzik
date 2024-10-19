<template>
  <div class="chat-frame row justify-between bg-grey-10">
    <div class="channel-rooms rounded-borders col-2 bg-grey-9 shadow-7 q-mt-sm q-mb-sm">
      <h2 class=" text-h5 text-center">Server Name</h2>
      <q-list class=" full-width text-center ">
        <q-item class="hover-fill" v-for="(channel, index) in listOfChannels" :key="index" :class="{ 'selected-channel': currentChannel === channel }"
>
          <q-item-section @click="loadChannel(channel)" class=" cursor-pointer">
            <q-item-label># {{ channel }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="chat-window rounded-borders bg-grey-9 col-10 q-pa-md q-mt-sm q-mb-sm column shadow-7" style=" max-width: 82.75%;">
      <div class="message-holder">
        <h6 class=" q-mb-lg q-ma-none">{{ currentChannel }}</h6>
        <div>
          <SingleMessage :message1="userMessage1" :message2="userMessage2"/>
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
import { ref, defineProps } from 'vue';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';

const inputValue = ref<string>('');
const inputCli = ref<null|any>(null);
const showComponent = ref<boolean>(false);
const currentChannel = ref<string>('Channel 1');
const listOfChannels = ref(['Channel 1', 'Channel 2']);
const $q = useQuasar();

let messageBeingTyped = ref<string>('Someone is typing ...')
let someIsTypingBool = ref<boolean>(false);
let filteredCommands = ref({});
let userMessage1 = ref< { [key: number]: Message }>({});
let userMessage2 = ref< { [key: number]: Message }>({});

const props = defineProps<{
  showFriends: boolean|number;
}>();

const showFriendsValue = ref<boolean|number>(props.showFriends || true);

const commands = {
  '/create': 'Create a new channel',
  '/join': 'Join an existing channel',
  '/leave': 'Leave a channel',
  '/delete': 'Delete a channel',
}

const loadMessages = () => {

console.log('loading messages');

userMessage1.value = {};
userMessage2.value = {};

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
  

  userMessage1.value[i] = message1;
  userMessage2.value[i+100] = message2;

}
};

loadMessages();

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

</script>

<style>
.chat-window,
.channel-rooms {
  /* border: var(--grey) 3px solid; */
  border-radius: 1rem;
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

</style>
