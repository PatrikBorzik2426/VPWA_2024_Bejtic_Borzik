<template>
    <div class="sidepannel q-pt-lg q-ma-sm bg-grey-9">
      <q-list>
        <q-item>
          <q-btn
            round
            unelevated
            :color="showaccount ? 'grey-8' : 'grey-9'"
            @click="ShowAccount">
            <q-icon
              center
              size="1.7rem"
              color="primary"
              name="account_circle" />
            <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
              Account
            </q-tooltip>
          </q-btn>
        </q-item>
  
        <q-item>
          <q-btn
            round
            unelevated
            :color="showfriends ? 'grey-8' : 'grey-9'"
            @click="ShowFriends">
            <q-icon
              center
              size="1.7rem"
              color="primary"
              name="group" />
            <q-badge v-if="unreadFriends > 0" color="red" floating rounded>{{ unreadFriends }}</q-badge>
            <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
              Friends
            </q-tooltip>
          </q-btn>
        </q-item>
  
        <q-item>
          <q-btn
            round
            unelevated
            :color="showservers ? 'grey-8' : 'grey-9'"
            @click="ShowServers">
            <q-icon
              center
              size="1.7rem"
              color="primary"
              name="dns" />
            <q-badge v-if="totalUnreadServers > 0" color="red" floating rounded>{{ totalUnreadServers }}</q-badge>
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
            <q-btn
              round
              elevated
              :class="{ 'selected-server': selectedServerId === server.id }"
              @click="selectServer(server.id)">
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

    <div v-else-if="selectedServer!=null && !showservers && showselectedserver">
        <q-item >
            <q-btn
              round
              elevated
              class="selected-server"
              @click="selectServer(selectedServer.id)">
              <q-avatar size="2.6rem">
                <img :src="selectedServer.avatar" alt="Server Avatar" />
              </q-avatar>
              <q-badge v-if="selectedServer.notifications > 0" color="red" floating rounded>{{ selectedServer.notifications }}</q-badge>
              <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-body2">
                {{ selectedServer.name }}
              </q-tooltip>
            </q-btn>
          </q-item>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, } from 'vue';

interface Server {
  id: number;
  name: string;
  avatar: string;
  notifications: number;
}

const page = ref('');
const unreadFriends = ref(4);
const showservers = ref(false);
const showfriends = ref(true);
const showaccount = ref(false);
const showselectedserver = ref(false);
const selectedServerId = ref<number | null>(null);

const serverList = ref<Server[]>([
  { id: 1, name: 'Server 1', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 2 },
  { id: 2, name: 'Server 2', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 3 },
  { id: 3, name: 'Server 3', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 0 },
  { id: 4, name: 'Server 4', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 1 },
  { id: 5, name: 'Server 5', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 4 },
  { id: 6, name: 'Server 6', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 0 },
  { id: 7, name: 'Server 7', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 5 },
  { id: 8, name: 'Server 8', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 2 },
  { id: 9, name: 'Server 9', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 0 },
  { id: 10, name: 'Server 10', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 3 },
  { id: 11, name: 'Server 11', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 0 },
  { id: 12, name: 'Server 12', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 1 },
  { id: 13, name: 'Server 13', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 0 },
  { id: 14, name: 'Server 14', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 2 },
  { id: 15, name: 'Server 15', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 0 },
  { id: 16, name: 'Server 16', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 3 },
  { id: 17, name: 'Server 17', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 4 },
  { id: 18, name: 'Server 18', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 0 },
  { id: 19, name: 'Server 19', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 5 },
  { id: 20, name: 'Server 20', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', notifications: 1 },
]);

const totalUnreadServers = computed(() => {
  return serverList.value.reduce((acc, server) => acc + server.notifications, 0);
});

const selectedServer = computed(() => { 
    return serverList.value.find((server) => server.id === selectedServerId.value) || null; 
}); 

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
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  color: grey;
}

.scrollable {
  overflow: auto !important;
  max-height: calc(100vh - 285px) !important;
  max-width: 250px !important;
}

.selected-server {
  background-color: rgba(255, 255, 255, 0.1); /* Change this to your desired selection color */
}

::-webkit-scrollbar {
  display: none;
}

</style>
