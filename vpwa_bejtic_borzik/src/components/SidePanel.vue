<template>
    <div class="sidepannel q-pt-lg q-ma-sm rounded-borders bg-grey-9">

        <div v-if="page == 'friends'">
            <q-list>
              <q-item>
                <q-btn 
                round 
                unelevated 
                color="grey-9"  
                @click="ShowAccount">
                    <q-icon
                    size="1.7rem"
                    name="account_circle"/>
                </q-btn>
              </q-item>
          
              <q-item>
                <q-btn 
                round 
                unelevated
                icon="group" 
                color="grey-9" 
                label="Friends"
                style="font-size: 1rem"
                @click="ShowFriends">
                </q-btn>
              </q-item>
          
              <q-item>
                <q-btn 
                round 
                unelevated
                icon="dns" 
                color="grey-9" 
                label="Servers"
                style="font-size: 1rem"
                @click ="ShowServers">
                <q-icon
                    left
                    size="1rem"/>

                </q-btn>
              </q-item>
            </q-list>
        </div>  

        <div v-else>
            <q-list>
              <q-item>
                <q-btn 
                round 
                unelevated 
                icon="account_circle" 
                color="grey-9" 
                style="font-size: 1rem"   
                @click="ShowAccount">
                    <q-tooltip 
                    anchor="center end" s
                    elf="center start" 
                    class="bg-grey-8 text-body2">
                    Account
                    </q-tooltip>

                </q-btn>
              </q-item>
          
              <q-item>
                <q-btn 
                round 
                unelevated
                icon="group" 
                color="grey-9" 
                style="font-size: 1rem"
                @click="ShowFriends">
                    <q-tooltip 
                    anchor="center end" 
                    self="center start" 
                    class="bg-grey-8 text-body2">
                    Friends
                    </q-tooltip>
                </q-btn>
              </q-item>
          
              <q-item>
                <q-btn 
                round 
                unelevated
                icon="dns" 
                color="grey-9" 
                style="font-size: 1rem"
                @click ="ShowServers">
                    <q-tooltip 
                    anchor="center end" 
                    self="center start" 
                    class="bg-grey-8 text-body2">
                    Servers
                    </q-tooltip>
                </q-btn>
              </q-item>
            </q-list>
        </div>

        <q-separator inset color="primary" class="q-ma-md"/>

        <div v-if="page == 'friends'">

            <div class="scrollable">
            <q-list>
                <q-item class="q-ma-sm q-mt-md rounded-borders" clickable v-ripple style="flex"
                dense 
                v-for="n in 24" :key="n">
                    <q-item-section avatar>
                        <q-avatar>
                          <img src="https://cdn.quasar.dev/img/avatar2.jpg" size="1rem">
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>
                            <div class="text-subtitle1 text-gray-1">Friend Name</div>
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
            </div>

        </div>

        <div v-else-if="page == 'servers'">
            <div class="scrollable">
            <q-list>
                <q-item
                v-for="n in 24" :key="n">
                    <q-btn round elevated style="font-size: 1rem">
                        <q-avatar>
                          <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                        </q-avatar>
                        <q-tooltip anchor="center end" self="center start" class="bg-grey-8       text-body2">Server Name</q-tooltip>

                    </q-btn>
                </q-item>
            </q-list>
            </div>


        

        </div>


    </div>
  </template>



<script setup lang="ts">
    import { ref } from 'vue'; 
    const page = ref('');

    function ShowFriends() {
        if(page.value == 'friends') {
            page.value = '';
        }else{
            page.value = 'friends';
        }
    }

    function ShowServers() {
        if(page.value == 'servers') {
            page.value = '';
        }else{
            page.value = 'servers';
        }
    }

    function ShowAccount() {
        if(page.value == 'account') {
            page.value = '';
        }else{
            page.value = 'account';
        }
    }



</script>



<style scoped>

.sidepannel{
    max-height: 100vh !important;
    border-radius: 1rem;
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2); 
    color: grey;
}

.scrollable{
    overflow: auto !important;
    max-height: calc(100vh - 285px) !important;
    max-width: 250px !important;
}

</style>