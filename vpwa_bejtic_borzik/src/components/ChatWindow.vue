<template>
  <div class="chat-frame row justify-between bg-dark q-pa-sm">
    <div class="channel-rooms rounded-borders col-2 bg-grey-9">
      <h2 class=" text-h5 text-center">Server Name</h2>
      <q-list class=" full-width text-center ">
        <q-item class="hover-fill" v-for="(channel, index) in listOfChannels" :key="index" >
          <q-item-section @click="loadChannel(channel)" class=" cursor-pointer">
            <q-item-label># {{ channel }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="chat-window rounded-borders bg-grey-9 col-10 q-pa-md column" style=" max-width: 82.75%;">
      <div class="message-holder">
        <h6 class=" q-mb-lg q-ma-none">{{ currentChannel }}</h6>
        <div>
          <SingleMessage :message="userMessage" :username="users"/>
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

        <div class="cli bg-grey rounded-borders q-px-sm">
          <q-form class="full-height full-width row justify-between items-center">
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
import { ref } from 'vue';
import dayjs from 'dayjs';

const inputValue = ref<string>('');
const inputCli = ref<null|any>(null);
const showComponent = ref<boolean>(false);
const currentChannel = ref<string>('Current Channel');

const listOfChannels = ref(['Channel 1', 'Channel 2']);

let filteredCommands = ref({});
let userMessage = ref< { [key: number]: Message }>({});
const users = ref<User[]>([]);

const commands = {
  '/create': 'Create a new channel',
  '/join': 'Join an existing channel',
  '/leave': 'Leave a channel',
  '/delete': 'Delete a channel',
}

for (let i = 0; i < 100; i++) {
  const user1: User = {
    id: i,
    login: 'User ' + i,
    password: 'password',
    email: 'user' + i + '@gmail.com',
  };

  const user2: User = {
    id: i+1,
    login: 'User ' + i+10,
    password: 'password',
    email: 'user' + i+10 + '@gmail.com',
  };

  const message1: Message = {
    id: i,
    text: 'Message ' + i,
    user: user1,
    timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
  };

  const message2: Message = {
    id: i+1,
    text: 'Message ' + i+10,
    user: user2,
    timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
  };  

  userMessage.value[i] = message1;
  userMessage.value[i+1] = message2;
  users.value.push(user1);
  users.value.push(user2);
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

  console.log(filteredCommands);

};


const loadChannel = (channelName : string) => {
  currentChannel.value = channelName;
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
</style>
