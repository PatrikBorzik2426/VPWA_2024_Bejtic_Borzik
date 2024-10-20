<template>
  <div class=" row chat-frame full-width bg-grey-10" style="gap: 0.5%">
    <div
      v-if="!mobileShowChat || $q.screen.gt.sm"
      class="channel-rooms rounded-borders bg-grey-9 shadow-7"
      :style="{ width: $q.screen.gt.sm ? '18%' : '99.5%' }"
    >
      <div v-if="showChannels">
        <q-expansion-item
          dark
          header-class="server-name"
          expand-separator
          :label="'Server ' + receivedServerId"
          class="relative-position z-top full-width"
          :duration="0"
        >
          <q-card dark class="relative-position full-width">
            <div class="absolute full-width bg-grey-9" style="top: 0; left: 0">
              <q-card-section
                v-for="(value, key, index) in options"
                :key="key"
                class="cursor-pointer setting-row"
                :class="{ 'last-item-style': index === listOfChannels.length }"
              >
                <div
                  class="row full-height full-width items-center setting-row"
                >
                  <q-icon :name="key" color="" size="1.5rem" class="q-mr-sm" />
                  <p class="q-ma-none">{{ value }}</p>
                </div>
              </q-card-section>
            </div>
          </q-card>
        </q-expansion-item>
        
         <div class="q-mx-md q-my-none row items-center justify-between">
        <h2 class="q-my-xs text-caption text-left color-grey">Text Channel</h2>
        <q-icon center color="primary" name="add" class="cursor-pointer" size="1.25rem" style="padding-right: 2px;">
          <q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
            Add Channel
          </q-tooltip>
        </q-icon>
      </div>


        <q-list class="full-width text-center">
          <q-item
            class="hover-fill"
            v-for="(channel, index) in listOfChannels"
            :key="index"
            :class="{ 'selected-channel': currentChannel === channel }"
          >
            <q-item-section
              @click="mobileShowChat = true;loadChannel(channel);"
              class="cursor-pointer"
            >
              <q-item-label># {{ channel }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-else>
        <div class="q-mx-md row items-center">
          <h2 class="q-ml-sm text-h6 text-left">Friends List</h2>

          <div class="row q-ml-auto" style="column-gap: 0.6rem">
            <q-icon
              center
              color="primary"
              name="supervised_user_circle"
              class="cursor-pointer"
              size="1.25rem"
            >

              <!-- <q-badge rounded floating color="red">3</q-badge> -->
              <q-tooltip
                anchor="bottom middle"
                self="top middle"
                class="bg-grey-8 text-caption"
              >
                Friend Requests
              </q-tooltip>
            </q-icon>

            <q-icon
              center
              color="primary"
              name="add_circle"
              class="cursor-pointer"
              size="1.25rem"
            >
              <q-tooltip
                anchor="bottom middle"
                self="top middle"
                class="bg-grey-8 text-caption"
              >
                Add Friend
              </q-tooltip>
            </q-icon>
          </div>
        </div>

        <div class="scrollable">
          <q-list class="q-pt-sm">
            <q-item
              v-for="friend in friendsList"
              :key="friend.id"
              class="q-pa-none hover-fill"
              :class="{ 'selected-channel': currentChannel === friend.name }"
            >
              <q-btn
                rounded
                flat
                @click="selectFriend(friend.id)"
                class="q-pl-sm full-width row justify-center"
                style="border-radius: 0.7rem"
              >
                <div
                  class="row justify-start items-center full-width"
                  style="max-width: 80%"
                >
                  <q-avatar size="1.7rem" class="q-mr-sm">
                    <img :src="friend.avatar" alt="Friend Avatar" />
                    <q-badge rounded floating color="grey-9" class="q-pa-none">
                      <q-icon
                        :color="getStatusColor(friend.status)"
                        :name="getStatusIcon(friend.status)"
                        size="0.8rem"
                      />
                    </q-badge>
                    <q-img />
                  </q-avatar>
                  <p class="q-ma-none">{{ friend.name }}</p>

                  <q-badge
                    v-if="friend.notifications > 0"
                    color="red"
                    floating
                    rounded
                    class="relative-position q-ml-auto"
                    style="top: 0"
                    >{{ friend.notifications }}
                  </q-badge>
                </div>
              </q-btn>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <div
    v-if="$q.screen.gt.sm || mobileShowChat"
    class="chat-window rounded-borders bg-grey-9 q-pa-md column no-wrap shadow-7"
      :style="{ width: $q.screen.gt.sm ? '81%' : '100%'}"
    >
      <div class="message-holder" style="height: fit-content;">
        <div class="row items-center q-mb-lg">
          <q-btn
            v-if="!$q.screen.gt.sm"
            icon="arrow_back"
            round
            flat
            @click=" mobileShowChat = false"
            class=" q-mr-sm">
          </q-btn>
          <h6 class=" q-ma-none">{{ currentChannel }}</h6>
        </div>
      </div>

      <div >
          <SingleMessage
            class=" overflow-auto"
            :message1="userMessage1"
            :message2="userMessage2"
            v-if="!friendChatStatus"
          />
          <SingleMessage :message1="dmMessageDict1" :message2="{}" v-else />
      </div>

      <div class="q-mt-auto" style="height: fit-content;">
        <q-form
          class="full-width row bg-dark relative-position rounded-borders q-mb-md"
          v-if="showComponent"
        >
          <q-list class="full-width command-list z-top bg-dark rounded-borders">
            <q-item
              v-for="(value, key) in filteredCommands"
              :key="key"
              class="hover-fill"
            >
              <q-item-section
                v-ripple
                class="command cursor-pointer"
                @click="pickCommand(key)"
              >
                <q-item-label>{{ key }}</q-item-label>
                <q-item-label caption class="text-grey-9">{{
                  value
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        <div
          class="someone-typing absolute full-width z-top cursor-pointer"
          v-if="someIsTypingBool"
          @click="showWhatIsTyping"
          style=" height: fit-content;"
        >
          <p class="q-ma-none full-width bg-grey-9 q-pt-sm">{{ messageBeingTyped }}</p>
        </div>

      </q-form>


        <div class="cli bg-grey rounded-borders q-px-sm">
          <q-form
            class="full-height full-width row no-wrap items-center"
            @submit.prevent="sendMessage"
          >
            <q-input
              ref="inputCli"
              v-model="inputValue"
              borderless
              color="transparent"
              autofocus
              hide-bottom-space
              dense
              placeholder="Type your message here"
              @update:model-value="checkCommand"
              @keyup.enter="sendMessage"
              autocomplete="off"
              style="width: 100%;"
            />
            <q-btn icon="send" type="submit" flat unelevated color="black" style="width: fit-content;"/>
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

// Refs and State
const inputValue = ref<string>('');
const inputCli = ref<null | any>(null);
const showComponent = ref<boolean>(false);
const currentChannel = ref<string>('');
const listOfChannels = ref(['Channel 1', 'Channel 2']);
const mobileShowChat = ref<boolean>(false);
const showChannels = ref<boolean>(false);
const messageBeingTyped = ref<string>('Someone is typing ...');
const someIsTypingBool = ref<boolean>(false);
const filteredCommands = ref({});
const userMessage1 = ref<{ [key: number]: Message }>({});
const userMessage2 = ref<{ [key: number]: Message }>({});
const dmMessageDict1 = ref<{ [key: number]: Message }>({});
const friendChatStatus = ref<boolean>(true);
const seeMessagePresent = ref<boolean>(false);
const $q = useQuasar();

// Props
const props = defineProps<{
  receivedServerId: number;
  receivedShowFriends: boolean;
  lastUpdate: Date;
}>();

// Emit events
const emit = defineEmits(['emit-mobileShowChat']);

// Commands and Options
const commands = {
  '/create': 'Create a new channel',
  '/join': 'Join an existing channel',
  '/leave': 'Leave a channel',
  '/delete': 'Delete a channel',
};

const options = {
  settings: 'Settings',
  person_add: 'Invite friend',
  logout: 'Leave server',
};

// Interfaces
interface Friend {
  id: number;
  name: string;
  notifications: number;
  avatar: string;
  status: string;
}

// Functions
const requestNotificationPermission = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

requestNotificationPermission();

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
    mobileShowChat.value = true;

    if (friend.id === id) {
      currentChannel.value = friend.name;
      friend.notifications = 0;
      friendChatStatus.value = props.receivedShowFriends;
      loadChannel(friendsList.value[id - 1].name);
    }
    return friend;
  });
};

const getStatusColor = (status: string) => {
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

const getStatusIcon = (status: string) => {
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
      id: i + 100,
      login: 'User ' + (i + 100),
      password: 'password',
      email: 'user' + (i + 100) + '@gmail.com',
    };

    const message1: Message = {
      id: i,
      text: 'Message ' + i,
      user: user1,
      timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
    };

    const message2: Message = {
      id: i + 100,
      text: 'Message ' + (i + 100),
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
        email: '',
      },
      timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
    };

    const dmMessage2: Message = {
      id: i,
      text: 'Message ' + i,
      user: {
        id: 0,
        login: 'myDm',
        password: 'password',
        email: '',
      },
      timestamp: dayjs(new Date()).format('DD.MM.YYYY HH:mm'),
    };

    userMessage1.value[i] = message1;
    userMessage2.value[i + 100] = message2;

    const dictLen = Object.keys(dmMessageDict1.value).length;

    dmMessageDict1.value[dictLen] = dmMessage1;
    dmMessageDict1.value[dictLen + 1] = dmMessage2;
  }
};

const sendMessage = () => {
  if (inputValue.value.length > 0) {
    showNotification(inputValue.value, currentChannel.value);

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
  }

  inputValue.value = '';
  checkCommand();
};

const showNotification = (text: string, currentChannel: string) => {
  setTimeout(() => {
    console.log('App visible:', $q.appVisible);

    if (!$q.appVisible) {
      if (Notification.permission === 'granted') {
        const notification = new Notification('Quasar App', {
          body: `${currentChannel}:\t ${text}`,
          icon: 'https://cdn.quasar.dev/logo-v2/svg/quasar-logo.svg',
        });

        notification.onclick = () => {
          window.focus();
        };
      } else {
        console.error('Notification permission denied.');
      }
    } else {
      $q.notify({
        message: `${currentChannel}:\t ${text}`,
        color: 'primary',
        position: 'bottom-right',
        timeout: 2000,
      });
    }
  }, 1000);
};

const showWhatIsTyping = () => {
  let newValue = '';
  seeMessagePresent.value = !seeMessagePresent.value;  
};

const checkCommand = () => {
  showComponent.value = false;

  filteredCommands.value = Object.fromEntries(
    Object.entries(commands).filter(
      ([key]) => key.startsWith(inputValue.value) && inputValue.value.length > 0
    )
  );

  if (Object.keys(filteredCommands).length > 0) {
    showComponent.value = true;
  } else {
    showComponent.value = false;
  }

  if (inputValue.value.length > 0 && !inputValue.value.startsWith('/')) {
    someIsTypingBool.value = true;
  } else {
    someIsTypingBool.value = false;
  }

  console.log(someIsTypingBool.value);
};

const loadChannel = (channelName: string) => {
  currentChannel.value = channelName;
  loadMessages();
};

const pickCommand = (command: string) => {
  inputValue.value = command + ' ';
  showComponent.value = false;

  if (inputValue.value) {
    inputCli.value.focus();
  }
};

// Watchers
watch(
  () => [props.receivedServerId, props.lastUpdate],
  ([newId]) => {
    console.log('receivedServerId value:', newId);
    if (newId !== undefined && newId !== null) {
      showChannels.value = true;
      currentChannel.value = 'Channel ' + props.receivedServerId.toString();

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
      showChannels.value = false;
    }

    loadChannel(currentChannel.value);
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => mobileShowChat.value,
  (newVal) => {
    emit('emit-mobileShowChat', newVal);
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => [seeMessagePresent.value, inputValue.value],
  () => {
    if (seeMessagePresent.value){
      messageBeingTyped.value = 'Someone: ' + inputValue.value;
    }else{
      messageBeingTyped.value = 'Someone is typing ...';
    }
  }
)

// Initial load
loadChannel(friendsList.value[0].name);
</script>


<style>
.chat-window,
.channel-rooms {
  /* border: var(--grey) 3px solid; */
  border-radius: 1rem;
  max-height: 97.5
  vh !important;
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

.command-list {
  position: absolute;
  bottom: 10%;
}

.shadows {
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.someone-typing {
  bottom: 6% !important;
}

.selected-channel {
  background-color: var(--q-primary);
  border-radius: 0.35rem;
}

.server-name {
  border-radius: 1rem 1rem 0 0 !important;
}

.setting-row:hover {
  background-color: var(--q-primary);
}

.last-item-style {
  background-color: #ff0000;
}

::-webkit-scrollbar {
  display: none;
}
</style>
