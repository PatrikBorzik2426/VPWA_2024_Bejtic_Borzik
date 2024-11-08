<template>
  <div 
  v-if="!showMobileChat || $q.screen.gt.md"
  class="sidepannel column no-wrap q-pt-lg bg-grey-9 shadow-7"
  :style="{ paddingTop : $q.screen.gt.sm ? '1rem' : '0' }">
    <q-list style=" height: fit-content">
      <q-item>
        <q-btn round unelevated :color="showaccount ? 'grey-8' : 'grey-9'" @click="ShowAccount">
          <q-icon center size="1.7rem" color="primary" name="account_circle" />
          <q-badge rounded floating color="transparent" class="q-pa-none">
            <q-icon :color="statusColor" :name="statusIcon" />
          </q-badge>
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

    <div class="content-center"  style=" height: 1%">
      <q-separator inset color="primary"/>
    </div>
      
    <div  :style="{ height: $q.screen.gt.sm ? '78%' : '68%' }" class=" ">
      <div v-if="showservers" class=" full-height">
        <q-list class="scrollable full-height">
            <q-item>
            <q-btn round flat @click="showCreateServer = true, halabala()" class="q-my-sm">
                <q-icon center name="add" size="2.6rem" color="primary"/>
              <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
                Create Server
              </q-tooltip>
            </q-btn>
          </q-item>

          <q-dialog v-model="showCreateServer">
            <q-card dark class="bg-grey-9 " style="border-radius: 0.3rem; width: 27rem;"  >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-h6">Create Server</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.3rem"
                    @click="showCreateServer = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                <q-card-section >
                  <div class="text-subtitle2 text-center text-grey-6">Give your new server a personality with a name and an icon. You can always change it later.</div>
                  
                </q-card-section>
                  <q-card-section class="text-center">
            <q-avatar size="5rem" class="file-avatar">
              <q-file v-model="image" class="file-circle file-input" filled rounded multiple accept=".jpg, image/*" @update:model-value="previewImage"/>
              <img :src="uploadimglink" alt="Avatar" class="accavatar file-image"/>
              <q-icon name="edit" size="2rem" class="hover-icon" />
            </q-avatar>
                  </q-card-section>
                <q-card-section class="q-pt-none ">
                  

                  <div class="text-subtitle2 text-grey-6">Server name</div>
                  <q-input dark outlined v-model="newServerName" style="border-radius: 10rem;" class="q-my-sm">
                  </q-input>
                  <q-card-section class=" row items-center justify-between q-pb-none q-pt-sm q-pl-xs">
                  <q-toggle
                  dark
                  v-model="privateserver"
                  checked-icon="lock"
                  color="red"
                  label="Private Server"
                  unchecked-icon="clear"
                  class="q-mt-sm"
                  />
                  <q-btn
                        no-caps    
                        label="Create"
                        color="grey-8"
                        class="q-mt-sm"
                        style="border-radius: 0.8rem;"
                        @click="newServerName = ''"
                      />
                    </q-card-section>
                  </q-card-section>
                  
              </q-card>
          </q-dialog>

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
  </div>


    <q-dialog v-model="showaccount">
      <div class="popup bg-dark column">
        <div class="text-h6 text-white q-mt-md">Account Information</div>
        <q-card elevated dark class="account-card bg-grey-9 ">
          <q-card-section class="text-center">
            <q-avatar size="5rem" class="file-avatar">
              <q-file v-model="filesImages" class="file-circle file-input" filled rounded single accept=".jpg, image/*" />
              <img :src="Mainuser.avatar" alt="Avatar" class="accavatar file-image"/>
              <q-icon name="edit" size="2rem" class="hover-icon" />
            </q-avatar>
          </q-card-section>

          <q-card-section>
            
            <div class="row items-center justify-between">
              <p><strong>Name:</strong> {{ Mainuser.name }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('name')" /> -->
            </div>
            <div class="row items-center justify-between">
              <p><strong>Surname:</strong> {{ Mainuser.surname }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('surname')" /> -->
            </div>
            <div class="row items-center justify-between">
              <p><strong>Nickname:</strong> {{ Mainuser.nickname }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('nickname')" /> -->
            </div>
            <div class="row items-center justify-between">
              <p><strong>Email:</strong> {{ Mainuser.email }}</p>
              <!-- <q-btn icon="edit" flat @click="editField('email')" /> -->
            </div>
          </q-card-section>
          <!-- Status Picker -->
          <q-card-section>
          <p><strong>Status:</strong></p>
          <q-select v-model="Mainuser.status" :options="options" emit-value rounded standout dark bg-color="grey-8"
          popup-content-class="bg-grey-9 popup-status" >
            <template v-slot:prepend>
              <q-icon :color="statusColor" :name="statusIcon" />
             </template>
            <template v-slot:option="scope"> 
              <q-item v-bind="scope.itemProps" class="q-ml-sm"> 
                <q-icon :name="scope.opt.icon" :color="scope.opt.color" class="q-mr-xs">
                </q-icon>
                  <q-item-section> 
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label style="max-width: 60%" caption>{{ scope.opt.description }}</q-item-label>
                  </q-item-section> 
              </q-item> 
            </template> 
          </q-select>
          </q-card-section>

        </q-card>
        <div class="q-mt-md">
          <q-btn rounded label="Log Out" color="red-9" @click="LogOut"/>
          <q-btn flat rounded class="q-ml-md" label="Close" color="primary" @click="showaccount = false"/>
        </div>

      </div>
    </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';

onBeforeMount(() => {
  page.value = 'ChatApp';
});

const router = useRouter();
const $q = useQuasar();

(() => {
  page.value = 'ChatApp';
});

// Interfaces
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

// Refs and State
const page = ref('');
const MainUserId = ref(1);
const filesImages = ref<File[]>([]);
const unreadFriends = ref(4);
const showservers = ref(false);
const showfriends = ref(true);
const showaccount = ref(false);
const showCreateServer = ref(false);
const showselectedserver = ref(false);
const selectedServerId = ref<number>(-1);
const showMobileChat = ref<boolean>(false);
const privateserver = ref<boolean>(false);
const uploadimglink = ref<string>('https://www.google.com/url?sa=i&url=https%3A%2F%2Fuxwing.com%2Ffile-upload-icon%2F&psig=AOvVaw3AzPtOKcxMdZhfz9XMnR-X&ust=1730073096318000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCkqd-erYkDFQAAAAAdAAAAABAE');


let image = ref(null);
let imageUrl = ref('');

const previewImage = () => {
  if (image.value) {
    imageUrl.value = URL.createObjectURL(image.value[0]);
  }
};

function halabala() {
  imageUrl.value = uploadimglink.value;
  previewImage();
}

const Mainuser = reactive<User>({
  id: 0,
  nickname: "",
  name: "",
  surname: "",
  email: "",
  avatar: "",
  status: ""
});

const newServerName = ref<string>(Mainuser.name + '\'s Server');

// Emit events
const emit = defineEmits(['emit-friends', 'emit-server-id']);
emit('emit-friends', true);

// Props
const props = defineProps<{
  receivedShowMobileChat: boolean;
}>();

// Watchers
watch(
  () => props.receivedShowMobileChat,
  () => {
    console.log('watch', props.receivedShowMobileChat);
    showMobileChat.value = props.receivedShowMobileChat;
  }
);

// Server List Generator
const generateServerList = (count: number): Server[] => {
  const serverList: Server[] = [];
  for (let i = 1; i <= count; i++) {
    serverList.push({
      id: i,
      name: `Server ${i}`,
      avatar: `https://cdn.quasar.dev/img/avatar${i}.jpg`,
      notifications: Math.floor(Math.random() * 100),
    });
  }
  return serverList;
};

// Data
const serverList = ref<Server[]>(generateServerList(20));

const options = [
  {
    label: 'Online',
    value: 'Online',
    icon: 'circle',
    color: 'green'
  },
  {
    label: 'Do Not Disturb',
    value: 'Do Not Disturb',
    description: 'You will not receive any notifications.',
    icon: 'remove_circle',
    color: 'red'
  },
  {
    label: 'Offline',
    value: 'Offline',
    description: 'You will not appear online, but will have full access to all of Discord.',
    icon: 'trip_origin',
    color: 'grey'
  },
];

// Computed Properties
const statusColor = computed(() => {
  switch (Mainuser.status) {
    case 'Online': return 'green';
    case 'Do Not Disturb': return 'red';
    case 'Offline': return 'grey';
    default: return 'primary';
  }
});

const statusIcon = computed(() => {
  switch (Mainuser.status) {
    case 'Online': return 'circle';
    case 'Do Not Disturb': return 'remove_circle';
    case 'Offline': return 'trip_origin';
    default: return 'circle';
  }
});

const totalUnreadServers = computed(() => {
  return serverList.value.reduce((acc, server) => acc + server.notifications, 0);
});

const selectedServer = computed(() => {
  return serverList.value.find((server) => server.id === selectedServerId.value) || null;
});

// Functions
function selectServer(serverId: number) {
  console.log(selectedServerId.value, serverId, showfriends.value);
  if (selectedServerId.value != serverId) {
    emit('emit-server-id', serverId);
  }
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
  if (!showfriends.value) {
    emit('emit-friends', true);
    selectedServerId.value = -1;
  }
  showfriends.value = true;
  showaccount.value = false;
  showselectedserver.value = false;
}

function ShowAccount() {
  showaccount.value = !showaccount.value;
}

function LogOut() {
  axios.post('http://127.0.0.1:3333/auth/logout', {
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('bearer')
    }
  })
  .then(response => {
    console.log("Logout: " + response.data);
  })
  .catch(error => {
    console.error('Error during registration:', error.response ? error.response.data : error.message);
  });

  router.push('/login');
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

    Mainuser.id = mainUserData.id;
    Mainuser.nickname = mainUserData.nickname;
    Mainuser.name = mainUserData.name;
    Mainuser.surname = mainUserData.surname;
    Mainuser.email = mainUserData.email;
    Mainuser.avatar = mainUserData.avatar;
    Mainuser.status = mainUserData.status;

    console.log("Main User assigned:", Mainuser);
  } catch (error) {
    console.error('Error during fetching main user:', error.response ? error.response.data : error.message);
  }
};


const updateMainUser = async () => {
    axios.post('http://127.0.0.1:3333/user/update-main-user', {
      name: Mainuser.name,
      surname: Mainuser.surname,
      nickname: Mainuser.nickname,
      email: Mainuser.email,
      status: Mainuser.status
    }, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("User updated:", response.data);
    }).catch(error => {
    console.error('Error during updating user:', error.response ? error.response.data : error.message);
  });
};

watch(
  () => Mainuser, // Sledovanie celého objektu
  (newValue, oldValue) => {
    console.log('Mainuser changed:', newValue)
    console.log('Previous value:', oldValue)

    // Napríklad môžeš spustiť API na uloženie zmien
    updateMainUser();
  },
  { deep: true } // Povinné pre sledovanie vnútorných vlastností objektu
)


getMainUser();

</script>


<style scoped>
.sidepannel {
  max-height: 97.5vh !important;
  max-width: 75px;
  border-radius: 1rem;
  color: grey;
}

.scrollable {
  overflow: auto !important;
}

.server-dot {
  position: absolute;
  left: -9px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 15px;
  background-color: var(--q-primary);
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

.popup-status {
  max-width: 30px !important;
  border-radius: 20px !important; 
}

::-webkit-scrollbar {
  display: none;
}
</style>
