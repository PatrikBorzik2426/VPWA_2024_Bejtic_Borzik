<template>
  <div class="sidepannel q-pt-lg q-ma-sm bg-grey-9 shadow-7">
    <q-list>
      <q-item>
        <q-btn round unelevated :color="showaccount ? 'grey-8' : 'grey-9'" @click="ShowAccount">
          <q-icon center size="1.7rem" color="primary" name="account_circle" />
          <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
            Account
          </q-tooltip>
        </q-btn>
      </q-item>

      <q-item>
        <q-btn round unelevated :color="showfriends ? 'grey-8' : 'grey-9'" @click="ShowFriends">
          <q-icon center size="1.7rem" color="primary" name="group" />
          <q-badge v-if="unreadFriends > 0" color="red" floating rounded>{{
            unreadFriends
            }}</q-badge>
          <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
            Friends
          </q-tooltip>
        </q-btn>
      </q-item>

      <q-item>
        <q-btn round unelevated :color="showservers ? 'grey-8' : 'grey-9'" @click="ShowServers">
          <q-icon center size="1.7rem" color="primary" name="dns" />
          <q-badge v-if="totalUnreadServers > 0" color="red" floating rounded>{{
            totalUnreadServers
            }}</q-badge>
          <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
            Servers
          </q-tooltip>
        </q-btn>
      </q-item>
    </q-list>

    <q-separator inset color="primary" class="q-ma-md" />

    <div v-if="showservers">
      <div class="scrollable" ref="serverListContainer">
        <q-list>
          <q-item v-for="server in serverList" :key="server.id">
            <q-btn round elevated @click="selectServer(server.id)">
              <div v-if="selectedServerId === server.id && showselectedserver" class="server-dot"></div>
              <q-avatar size="2.6rem">
                <img :src="server.avatar" alt="Server Avatar" />
              </q-avatar>
              <q-badge v-if="server.notifications > 0" color="red" floating rounded>{{ server.notifications }}</q-badge>
              <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
                {{ server.name }}
              </q-tooltip>
            </q-btn>
          </q-item>
        </q-list>
      </div>
    </div>

    <div v-else-if="selectedServer != null && !showservers && showselectedserver">
      <q-item>
        <q-btn round elevated @click="selectServer(selectedServer.id)">
          <div class="server-dot"></div>
          <q-avatar size="2.6rem">
            <img :src="selectedServer.avatar" alt="Server Avatar" />
          </q-avatar>
          <q-badge v-if="selectedServer.notifications > 0" color="red" floating rounded>{{ selectedServer.notifications
            }}</q-badge>
          <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
            {{ selectedServer.name }}
          </q-tooltip>
        </q-btn>
      </q-item>
    </div>

    <q-dialog v-model="showaccount">
      <div class="popup bg-dark column">
        <div class="text-h6 text-white q-mt-md">Account Information</div>
        <q-card elevated dark class="account-card bg-grey-9 ">
          <q-card-section class="text-center">
            <q-avatar size="5rem" class="file-avatar">
              <q-file v-model="filesImages" class="file-circle file-input" filled rounded single accept=".jpg, image/*" />
              <img src="https://cdn.quasar.dev/img/avatar1.jpg" alt="Avatar" class="accavatar file-image"/>
              <q-icon name="edit" size="2rem" class="hover-icon" />
            </q-avatar>
            
          </q-card-section>

          <q-card-section>
            <div class="row items-center justify-between">
              <p><strong>Name:</strong> {{ Mainuser?.name }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('name')" /> -->
            </div>
            <div class="row items-center justify-between">
              <p><strong>Surname:</strong> {{ Mainuser?.surname }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('surname')" /> -->
            </div>
            <div class="row items-center justify-between">
              <p><strong>Nickname:</strong> {{ Mainuser?.nickname }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('nickname')" /> -->
            </div>
            <div class="row items-center justify-between">
              <p><strong>Email:</strong> {{ Mainuser?.email }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('email')" /> -->
            </div>
          </q-card-section>
          <!-- Status Picker -->
          <q-card-section>
          <p><strong>Status:</strong></p>
          <q-select v-model="Mainuser.status" :options="options" emit-value dark>
            <!-- <template v-slot:option="scope"> 
              <q-item v-ripple> 
                <q-icon :name="scope.opt.icon" class="q-mr-sm"
                  :color="getIconColor(scope.opt.value)">
                  <q-item-section> 
                    {{ scope.opt.label }} 
                  </q-item-section> 
                </q-icon>
              </q-item> 
            </template>  -->
          </q-select>
          </q-card-section>

        </q-card>
        <q-btn flat rounded class="q-mt-md" label="Close" color="primary" @click="showaccount = false" />
      </div>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface User {
  id: number;
  nickname: string;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  status: string;
}

interface Server {
  id: number;
  name: string;
  avatar: string;
  notifications: number;
}

const page = ref('');
const MainUserId = ref(1);
const filesImages = ref<File[]>([]);
const unreadFriends = ref(4);
const showservers = ref(false);
const showfriends = ref(true);
const showaccount = ref(false);
const showselectedserver = ref(false);
const selectedServerId = ref<number | null>(null);


const Users = ref<User[]>([
  {
    id: 1,
    nickname: 'Jebo',
    name: 'Jane',
    surname: 'Doe',
    email: 'JaneDoe@gmail.com',
    avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
    status: 'Online',
  },
]);

const serverList = ref<Server[]>([
  {
    id: 1,
    name: 'Server 1',
    avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
    notifications: 2,
  },
  {
    id: 2,
    name: 'Server 2',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    notifications: 3,
  },
  {
    id: 3,
    name: 'Server 3',
    avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    notifications: 0,
  },
  {
    id: 4,
    name: 'Server 4',
    avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    notifications: 1,
  },
  {
    id: 5,
    name: 'Server 5',
    avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    notifications: 4,
  },
  {
    id: 6,
    name: 'Server 6',
    avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
    notifications: 0,
  },
  {
    id: 7,
    name: 'Server 7',
    avatar: 'https://cdn.quasar.dev/img/avatar7.jpg',
    notifications: 5,
  },
  {
    id: 8,
    name: 'Server 8',
    avatar: 'https://cdn.quasar.dev/img/avatar8.jpg',
    notifications: 2,
  },
  {
    id: 9,
    name: 'Server 9',
    avatar: 'https://cdn.quasar.dev/img/avatar9.jpg',
    notifications: 0,
  },
  {
    id: 10,
    name: 'Server 10',
    avatar: 'https://cdn.quasar.dev/img/avatar10.jpg',
    notifications: 3,
  },
  {
    id: 11,
    name: 'Server 11',
    avatar: 'https://cdn.quasar.dev/img/avatar11.jpg',
    notifications: 0,
  },
  {
    id: 12,
    name: 'Server 12',
    avatar: 'https://cdn.quasar.dev/img/avatar12.jpg',
    notifications: 1,
  },
  {
    id: 13,
    name: 'Server 13',
    avatar: 'https://cdn.quasar.dev/img/avatar13.jpg',
    notifications: 0,
  },
  {
    id: 14,
    name: 'Server 14',
    avatar: 'https://cdn.quasar.dev/img/avatar14.jpg',
    notifications: 2,
  },
  {
    id: 15,
    name: 'Server 15',
    avatar: 'https://cdn.quasar.dev/img/avatar15.jpg',
    notifications: 0,
  },
  {
    id: 16,
    name: 'Server 16',
    avatar: 'https://cdn.quasar.dev/img/avatar16.jpg',
    notifications: 3,
  },
  {
    id: 17,
    name: 'Server 17',
    avatar: 'https://cdn.quasar.dev/img/avatar17.jpg',
    notifications: 4,
  },
  {
    id: 18,
    name: 'Server 18',
    avatar: 'https://cdn.quasar.dev/img/avatar18.jpg',
    notifications: 0,
  },
  {
    id: 19,
    name: 'Server 19',
    avatar: 'https://cdn.quasar.dev/img/avatar19.jpg',
    notifications: 5,
  },
  {
    id: 20,
    name: 'Server 20',
    avatar: 'https://cdn.quasar.dev/img/avatar20.jpg',
    notifications: 1,
  },
]);

const options = [
        {
          label: 'Online',
          value: 'Online',
          icon: 'mdi-check-circle'
        },
        {
          label: 'Do Not Disturb',
          value: 'Do Not Disturb',
          description: 'You will not receive any notifications.',
          icon: 'mdi-minus-circle'
        },
        {
          label: 'Offline',
          value: 'Offline',
          description: 'You will not appear online, but will have full access to all of Discord.',
          icon: 'mdi-circle-outline'
        },
      ];

const totalUnreadServers = computed(() => {
  return serverList.value.reduce(
    (acc, server) => acc + server.notifications,
    0
  );
});

const selectedServer = computed(() => {
  return (
    serverList.value.find((server) => server.id === selectedServerId.value) ||
    null
  );
});

const Mainuser = computed(() => {
  return (
    Users.value.find((MainUser) => MainUser.id === MainUserId.value) ||
    null
  );
});

// function getIconColor(status: string): string {
//   switch (status) {
//     case 'Online':
//       return 'green';
//     case 'Do Not Disturb':
//       return 'red';
//     case 'Offline':
//       return 'grey';
//     default:
//       return 'primary';
//   }
// }



function selectServer(serverId: number) {
  selectedServerId.value = serverId;
  showselectedserver.value = true;
  showfriends.value = false;
  showaccount.value = false;
  page.value = '';
}
function ShowServers() {
  showservers.value = !showservers.value;
}

function ShowFriends() {
  showfriends.value = true;
  showaccount.value = false;
  showselectedserver.value = false;
}

function ShowAccount() {
  showaccount.value = !showaccount.value;
}
</script>

<style scoped>
.sidepannel {
  max-height: 100vh !important;
  border-radius: 1rem;
  color: grey;
}

.scrollable {
  overflow: auto !important;
  max-height: calc(100vh - 285px) !important;
  max-width: 250px !important;
}

.server-dot {
  position: absolute;
  left: -9px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 15px;
  background-color: white;
  border-radius: 25%;
}

.popup {
  width: 350px;
  height: 540px;
  border-radius: 20px;
  display: flex;
  align-items: center;
}

.account-card {
  background-color: var(--q-grey-7);
  border-radius: 20px;
  width: 90%;
  margin-top: 2%;
}

.file-avatar {
  position: relative;
  border-radius: 50%; 
  overflow: hidden;   
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; 
  z-index: 3; 
  cursor: pointer;
}

.file-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;       
}

.hover-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  opacity: 0; 
  z-index: 2; 
  color: white;
  transition: opacity 0.3s ease; 
}

.file-avatar:hover .hover-icon {
  opacity: 0.7;  
}

.file-avatar:hover .file-image { 
  opacity: 0.5; 
  filter: brightness(0.7); 
}

::-webkit-scrollbar {
  display: none;
}
</style>
