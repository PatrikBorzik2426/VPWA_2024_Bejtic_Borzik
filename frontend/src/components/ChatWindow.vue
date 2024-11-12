<template>
  <div class=" row chat-frame full-width bg-grey-10" style="gap: 0.5%">
    <div
      v-if="!mobileShowChat || $q.screen.gt.sm"
      class="channel-rooms rounded-borders bg-grey-9 shadow-7"
      :style="{ width: $q.screen.gt.sm ? '18%' : '99.5%' }"
    >
      <div v-if="showChannels">
        <q-btn flat push align="between" class="full-width">
          <div class="row items-center">
            <q-icon :name="activeServer.private ? 'lock' : 'public'" color="primary" size="1rem" />
            <p class="q-ma-sm text-subtitle1" style="text-transform: none;"> {{ activeServer.name }}</p>
          </div>
          <q-icon :name="true ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" color="primary" size="1rem q-mr-xs"/>
        <q-menu dark fit auto-close class="bg-grey-9">
          <q-list style="min-width: 100px">
            <q-separator dark/>
            <q-item v-if="activeServer.role !== 'member'" clickable @click="cloneServer(), showServerSettings = true">
              <q-item-section avatar class="q-ma-auto">
                <q-icon name="settings" color="primary" size="1.3rem"/>
              </q-item-section>
              <q-item-section>Server Settings</q-item-section>
            </q-item>
            <q-item clickable @click="showInviteFriend = true">
              <q-item-section avatar>
                <q-icon name="person_add" color="primary" size="1.3rem"/>
              </q-item-section>
              <q-item-section>Invite Friends</q-item-section>
            </q-item>
            <q-item clickable @click="getMemberList">
              <q-item-section avatar class="q-ma-auto">
                <q-icon name="groups" color="primary" size="1.3rem"/>
              </q-item-section>
              <q-item-section>Member List</q-item-section>
            </q-item>
            <q-item v-if="activeServer.role !== 'creator'" clickable color="red-9" text-color="white" @click="leaveServer()">
              <q-item-section avatar >
                <q-icon name="reply" color="primary" size="1.3rem"/>
              </q-item-section>
              <q-item-section>Leave Server</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-dialog v-model="showServerSettings">
            <q-card dark class="bg-grey-9 " style="border-radius: 0.3rem; width: 27rem;"  >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-h6">Server Settings</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.3rem"
                    @click="showServerSettings = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                  <q-card-section class="text-center">
                    <q-avatar size="5rem" class="file-avatar">
                      <q-file v-model="filesImages" class="file-circle file-input" filled rounded single        accept=".jpg, image/*" />
                      <img :src="activeServer.avatar" alt="Avatar" class="accavatar file-image"/>
                      <q-icon name="edit" size="2rem" class="hover-icon" />
                    </q-avatar>
                  </q-card-section>
                <q-card-section class="q-pt-none ">
                  

                  <div class="text-subtitle2 text-grey-6">Server name</div>
                  <q-input dark outlined v-model="editingServer.name" style="border-radius: 10rem;" class="q-my-sm">
                  </q-input>
                  <q-card-section class=" row items-center justify-between q-pb-none q-pt-sm q-px-xs">
                  <q-toggle
                  dark
                  keep-color
                  v-model="editingServer.private"
                  checked-icon="lock"
                  color="red"
                  unchecked-icon="public"
                  :label="editingServer.private ? 'Private Server' : 'Public Server'"
                  class="q-mt-sm"
                  />
                  <q-card-section class=" row items-center q-pa-none">
                  <q-btn
                        no-caps    
                        label="Delete"
                        color="red"
                        class="q-mt-sm"
                        style="border-radius: 0.8rem;"
                        @click="deleteServer(), showServerSettings = false"
                      />
                  <q-btn
                        no-caps    
                        label="Update"
                        color="grey-8"
                        class="q-mt-sm q-ml-md"
                        style="border-radius: 0.8rem;"
                        @click="updateServer(), showServerSettings = false"
                      />
                  </q-card-section>
                    </q-card-section>
                  </q-card-section>
              </q-card>
          </q-dialog>

      <q-dialog v-model="showInviteFriend">
            <q-card dark class="bg-grey-9 " style="border-radius: 0.3rem; width: 27rem;"  >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-h6">Invite Friend</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.3rem"
                    @click="showInviteFriend = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                <q-card-section class="q-pt-none ">
                  <div class="text-subtitle2 text-grey-6">Friends name</div>
                  <q-input dark outlined v-model="invitedFriendsName" style="border-radius: 10rem;" class="q-my-sm" placeholder="Nickname">
                    <template v-slot:prepend>
                      <q-icon name="tag" />
                    </template>
                  </q-input>
                  <q-card-section class="row justify-end q-pb-none q-pt-sm q-pr-xs">
                  <q-btn
                        no-caps    
                        label="Invite"
                        color="grey-8"
                        class="q-mt-sm"
                        style="border-radius: 0.8rem;"
                        @click="inviteFriend(); showInviteFriend = false"
                      />
                    </q-card-section>
                  </q-card-section>
              </q-card>
          </q-dialog>

          <q-dialog v-model="showMemberList">
            <q-card dark class="bg-grey-9 " style="border-radius: 0.3rem; width: 27rem;"  >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-h6">Member List</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.3rem"
                    @click="showMemberList = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                  <q-list>
                    <q-card-section class=" scroll q-px-none" style="max-height: 25.5rem;">
                      <div v-for="{ role, members } in membersByRole" :key="role" class="q-mx-md">
                        <div class="text-subtitle2 text-grey-6 q-mt-sm">{{ roleDisplayNames[role] }}</div>
                        <q-item
                          v-for="member in members"
                          :key="member.id"
                          class="q-mt-xs q-px-xs row items-center"
                        >
                        <q-avatar size="2rem" class="q-mr-sm">
                          <img :src="member.avatar" alt="Friend Avatar" />
                          <q-badge rounded floating color="grey-9" class="q-pa-none">
                            <q-icon
                              :color="getStatusColor(member.status)"
                              :name="getStatusIcon(member.status)"
                              size="0.8rem"
                            />
                          </q-badge>
                          <q-img />
                        </q-avatar>
                          <q-item-section>
                            <q-item-label>{{ member.name }}</q-item-label>
                          </q-item-section >
                            <q-btn
                              v-if="activeServer.role !== 'member' && role !== 'creator' && member.id !== activeServer.userid"
                              flat
                              rounded
                              icon="logout"
                              color="orange"
                              class="q-px-sm"
                              @click="kickMember(member.id)"
                              size="sm"
                            ><q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
                              Kick Member
                            </q-tooltip></q-btn>
                            <q-btn
                              v-if="activeServer.role !== 'member' && role !== 'creator' && member.id !== activeServer.userid"
                              flat
                              rounded
                              icon="block"
                              color="red"
                              class="q-px-sm"
                              @click="banMember(member.id)"
                              size="sm"
                            ><q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
                              Ban Member
                            </q-tooltip></q-btn>
                            <q-btn
                              v-if="!member.isFriend && member.id !== activeServer.userid"
                              flat
                              rounded
                              icon="person_add"
                              class="q-px-sm"
                              color="primary"
                              @click="AddedFriend = member.name, addFriend()"
                              size="sm"
                            >
                            <q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
                              Add Friend
                            </q-tooltip></q-btn>
                            <q-btn
                              v-else-if="member.id !== activeServer.userid"
                              flat
                              rounded
                              icon="person_remove"
                              color="primary"
                              class="q-px-sm"
                              @click="removeFriend(member.id)"
                              size="sm"
                            >
                            <q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
                              Remove Friend
                            </q-tooltip></q-btn>
                        </q-item>
                      </div>
                  </q-card-section>
                </q-list>
              </q-card>
          </q-dialog>


        
         <div class="q-mx-md q-my-none row items-center justify-between">
        <h2 class="q-my-xs text-caption text-left color-grey">Text Channels</h2>
        <q-icon v-if="activeServer.role !== 'member'" center color="primary" name="add" class="cursor-pointer" size="1.25rem" style="padding-right: 2px;" @click="showCreateChannel = true">
          <q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
            Create Channel
          </q-tooltip>
        </q-icon>
      </div>

      <q-dialog v-model="showCreateChannel">
            <q-card dark class="bg-grey-9 " style="border-radius: 0.3rem; width: 27rem;"  >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-h6">Create Channel</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.3rem"
                    @click="showCreateChannel = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                <q-card-section class="q-pt-none ">
                  <div class="text-subtitle2 text-grey-6">Channel name</div>
                  <q-input dark outlined v-model="newChannelName" style="border-radius: 10rem;" class="q-my-sm" placeholder="New Channel">
                    <template v-slot:prepend>
                      <q-icon name="tag" />
                    </template>
                  </q-input>
                  <q-card-section class="row justify-end q-pb-none q-pt-sm q-pr-xs">
                  <q-btn
                        no-caps    
                        label="Create"
                        color="grey-8"
                        class="q-mt-sm"
                        style="border-radius: 0.8rem;"
                        @click="createChannel(); showCreateChannel = false"
                      />
                    </q-card-section>
                  </q-card-section>
              </q-card>
          </q-dialog>

          <draggable
            v-model="channelList"
            item-key="id"
            class="full-width"
            :disabled="activeServer.role === 'member'"
            @end="updateChannelposition"
          >
            <template #item="{ element }">
              <q-item class="q-px-xs q-py-xs">
                <q-btn
                  rounded
                  flat
                  @click="mobileShowChat = true; loadChannel(element.name);"
                  align="between"
                  class="full-width"
                  style="border-radius: 0.7rem">
                  <div class="row items-center ">
                    <q-icon name="tag" color="primary" size="1.2rem"/>
                    <p class="q-mx-sm q-my-none text-subtitle2" style="text-transform: none;"> {{ element.name }}</p>
                  </div>
                  <q-icon v-if="activeServer.role !== 'member'" name="settings" color="primary" size="1rem" class="cursor-pointer" @click.stop="openChannelSettings(element)">
                    <q-tooltip anchor="bottom middle" self="top middle" class="bg-grey-8 text-caption">
                      Channel Settings
                    </q-tooltip>
                  </q-icon>
              </q-btn>
              </q-item>
            </template>
          </draggable>

          <q-dialog v-model="showChannelSettings">
            <q-card dark class="bg-grey-9 " style="border-radius: 0.3rem; width: 27rem;"  >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-h6">Channel Settings</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.3rem"
                    @click="showChannelSettings = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                <q-card-section class="q-pt-none ">
                  <div class="text-subtitle2 text-grey-6">Channel name</div>
                  <q-input dark outlined v-model="selectedChannelSettings.name" style="border-radius: 10rem;" class="q-my-sm" placeholder="Channel name">
                    <template v-slot:prepend>
                      <q-icon name="tag" />
                    </template>
                  </q-input>
                  <q-card-section class="row justify-between q-pb-none q-pt-sm q-px-xs">
                    <q-btn
                        no-caps    
                        label="Delete"
                        color="red-8"
                        class="q-mt-sm"
                        style="border-radius: 0.8rem;"
                        @click="deleteChannel(); showChannelSettings = false"
                      />
                    <q-btn
                        no-caps    
                        label="Update"
                        color="grey-8"
                        class="q-mt-sm"
                        style="border-radius: 0.8rem;"
                        @click="updateChannel(); showChannelSettings = false"
                      />
                    </q-card-section>
                  </q-card-section>
                  
              </q-card>
          </q-dialog>

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
              @click="getFriendRequests();showFriendRequests = true"
            >
              <div v-if="friendrequests.length > 0" class="absolute bg-red text-white q-ml-md q-mb-md"
              style="width: 0.7rem; height: 0.7rem; font-size: 1rem; border-radius: 0.3rem;"></div>
              <q-tooltip
                anchor="bottom middle"
                self="top middle"
                class="bg-grey-8 text-caption"
              >
                Friend Requests
              </q-tooltip>
            </q-icon>

            <q-dialog no-focus v-model="showFriendRequests" position="top">
              <q-card dark class="bg-grey-9" style="border-radius: 1.1rem; height: 20rem; width: 22rem;" :style="{marginTop: $q.screen.gt.sm ? '4rem' : '10rem', marginLeft: $q.screen.gt.sm ? '-63vw' : '0'} " >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-subtitle1" >Friend Requests</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.1rem"
                    @click="showFriendRequests = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                  <q-card-section class=" scroll q-pa-none" style="max-height: 15.5rem;">
                <q-list v-if="friendrequests.length > 0">
                  <q-item v-for="request in friendrequests" :key="request.id" class="justify-in-between items-center q-mx-sm q-mb-sm">
                      <q-avatar size="2.5rem">
                         <img :src="request.avatar" alt="Avatar" /> 
                      </q-avatar>
                      <q-item-label class="q-ml-sm q-mr-xl">{{ request.name }}</q-item-label>
                    <div class="q-ml-auto">
                        <q-btn round size="0.5rem" color="green-7" icon="done" class="q-mr-sm" @click="acceptFriendRequest(request.id)">
                        <q-tooltip anchor="center start" self="center end" class="bg-grey-8 text-caption">
                          Accept 
                        </q-tooltip>
                      </q-btn>
                        <q-btn round size="0.5rem" color="red-7" icon="close" @click="rejectFriendRequest(request.id)">
                        <q-tooltip anchor="center end" self="center start" class="bg-grey-8 text-caption">
                          Reject
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item>
                </q-list>
              
                <q-card-section v-else style="margin-top: 4rem;">
                  <div class="text-subtitle2 text-center text-grey-6">Oooops... Looks like nobody wants to be your friend</div>
                </q-card-section>
              </q-card-section>
              </q-card>
            </q-dialog>

            <q-icon
              center
              color="primary"
              name="add_circle"
              class="cursor-pointer"
              size="1.25rem"
              @click="showAddFriend = true"
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

        <q-dialog v-model="showAddFriend" position="top">
              <q-card dark class="bg-grey-9" style="border-radius: 1.1rem; height: 14rem; width: 25rem; " :style="{marginTop: $q.screen.gt.sm ? '4rem' : '10rem', marginLeft: $q.screen.gt.sm ? '-60vw' : '0'} " >
                <q-toolbar class="row justify-between items-center q-py-sm">
                  <div class="text-subtitle1" >Add Friend</div>   
                  <q-icon
                    flat
                    round
                    class="cursor-pointer"
                    name="close"
                    color="primary"
                    size="1.1rem"
                    @click="showAddFriend = false"></q-icon>
                  </q-toolbar>
                  <q-separator color="grey-8" class="q-mb-sm"/>
                <q-card-section>
                  <q-input dark outlined v-model="AddedFriend" placeholder="You can add friends with their nickname" style="border-radius: 10rem;" class="q-my-sm">
                  </q-input>
                  <q-card-section class="row justify-end q-pb-none q-pt-sm q-pr-xs">
                  <q-btn
                        no-caps    
                        label="Add"
                        color="grey-8"
                        class="q-mt-sm"
                        style="border-radius: 0.8rem;"
                        @click="addFriend()"
                      />
                    </q-card-section>
                </q-card-section>
                  
              </q-card>
            </q-dialog>

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
              <q-menu touch-position context-menu auto-close class="bg-red text-white" style="border-radius: 1rem">
                <q-list>
                  <q-item class="q-px-sm" v-close-popup clickable @click="removeFriend(friend.id)">
                    <q-item-section>Remove Friend</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
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
import { ref, defineProps, watch, reactive, computed} from 'vue';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';
import axios from 'axios';
import draggable from "vuedraggable";

// Refs and State
const inputValue = ref<string>('');
const inputCli = ref<null | any>(null);
const showComponent = ref<boolean>(false);
const currentChannel = ref<string>('');
const channelList = ref<ServerChannel[]>([]);
const mobileShowChat = ref<boolean>(false);
const showChannels = ref<boolean>(false);
const showCreateChannel = ref<boolean>(false);
const showChannelSettings = ref<boolean>(false);
const showMemberList = ref<boolean>(false);
const showServerSettings = ref<boolean>(false);
const showInviteFriend = ref<boolean>(false);
const showServerInvites = ref<boolean>(false);
const newChannelName = ref<string>('');
const invitedFriendsName = ref<string>('');
const showFriendRequests = ref<boolean>(false);
const showAddFriend = ref<boolean>(false);
const AddedFriend = ref<string>('');
const messageBeingTyped = ref<string>('Someone is typing ...');
const someIsTypingBool = ref<boolean>(false);
const filteredCommands = ref({});
const userMessage1 = ref<{ [key: number]: Message }>({});
const userMessage2 = ref<{ [key: number]: Message }>({});
const dmMessageDict1 = ref<{ [key: number]: Message }>({});
const friendChatStatus = ref<boolean>(true);
const seeMessagePresent = ref<boolean>(false);
const friendrequests = ref<FriendRequest[]>([]); 
const friendsList = ref<Friend[]>([]);
const memberList = ref<ServerMember[]>([]);
const filesImages = ref<File[]>([]);

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

const roleDisplayNames: Record<string, string> = {
  creator: 'Creator',
  admin: 'Admins',
  member: 'Members',
};

// Interfaces
interface Friend {
  id: number;
  friendId: number;
  name: string;
  notifications: number;
  avatar: string;
  status: string;
}

interface FriendRequest {
  id: number;
  name: string;
  avatar: string;
}

interface ServerChannel {
  id: number;
  name: string;
  notifications: number;
  position: number;
}

interface Server {
  id: number;
  name: string;
  avatar: string;
  private: boolean;
  role: string;
  userid: number;
}

interface ServerMember {
  id: number;
  name: string;
  avatar: string;
  status: string;
  role: string;
  isFriend: boolean;
}

const activeServer = reactive<Server>({
  id: 0,
  name: "",
  avatar: "",
  private: false,
  role: "",
  userid: 0,

});

const editingServer = reactive<Server>({
  id: 0,
  name: "",
  avatar: "",
  private: false,
  role: "",
  userid: 0,
});

const selectedChannelSettings = reactive<ServerChannel>({
  id: 0,
  name: '',
  notifications: 0,
  position: 0,
});

// Functions

const membersByRole = computed(() => {
  const roles = ['creator', 'admin', 'member'];
  return roles
    .map((role) => ({
      role,
      members: memberList.value.filter((member) => member.role === role),
    }))
    .filter((entry) => entry.members.length > 0); // Exclude empty roles
});

const openChannelSettings = (channel: ServerChannel) => {
  Object.assign(selectedChannelSettings, channel); 
  showChannelSettings.value = true;
};

const requestNotificationPermission = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

function cloneServer(){
  editingServer.id = activeServer.id;
  editingServer.name = activeServer.name;
  editingServer.avatar = activeServer.avatar;
  editingServer.private = activeServer.private;
  editingServer.role = activeServer.role;
  editingServer.userid = activeServer.userid;
}

requestNotificationPermission();

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

// Backend Calls
async function addFriend(){
  console.log('Adding friend:', AddedFriend);

  axios.post('http://127.0.0.1:3333/friend/add-friend-request',{
    receiverLogin: AddedFriend.value
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    AddedFriend.value = '';
    $q.notify({
        type: 'positive',
        message: 'Friend request sent',
        timeout: 5000, 
        position: 'bottom' 
      });
    
  }).catch(error => {
      const message = error.response?.data?.message || 'An error occurred';
      AddedFriend.value = '';
      $q.notify({
        type: 'negative',
        message: message,
        timeout: 5000, 
        position: 'bottom' 
      });
    });

}

async function acceptFriendRequest(requestId: number){
  console.log('Accepting friend request:', friendrequests.value[0].name);

  axios.post('http://127.0.0.1:3333/friend/accept-friend-request',{
    friendRequestId: requestId
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    deleteFriendRequest(requestId);
    getFriendsList();
  }).catch(error => {
    console.error('Error during accepting friendrequest:', error.response ? error.response.data : error.message);
  });
}

const deleteFriendRequest = (requestId: number) => {
  const index = friendrequests.value.findIndex(request => request.id === requestId);
  if (index > -1) {
    friendrequests.value.splice(index, 1);
  }
};

async function rejectFriendRequest(requestId: number){
  console.log('Rejecting friend request:', friendrequests.value[0].name);

  axios.post('http://127.0.0.1:3333/friend/reject-friend-request',{
    friendRequestId: requestId
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data.friend);
    deleteFriendRequest(requestId);
  }).catch(error => {
    console.error('Error during rejecting friendrequest:', error.response ? error.response.data : error.message);
  });

  console.log(friendrequests.value);
}



const getFriendRequests = () => {

  friendrequests.value = [];

  axios.post('http://127.0.0.1:3333/friend/list-friend-requests',{},{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data.mappedRequests);

    response.data.mappedRequests.forEach((element : any) => {
      console.log('Element:', element);

      friendrequests.value.push({
        id: element.friendRequestId,
        name: element.senderName,
        avatar: element.senderAvatar,
      });

      console.log(friendrequests.value);
    })

  }).catch(error => {
    console.error('Error during fetching friend requests:', error.response ? error.response.data :  error.message);
  });

};

const getFriendsList = () => {

  axios.post('http://127.0.0.1:3333/friend/list-friends',{},{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data.mappedFriends);

    console.log('daco to urobilo');

    friendsList.value = [];

    response.data.mappedFriends.forEach((friend : any) => {
      console.log('Friend:', friend);

      friendsList.value.push({
        id: friend.friendId,
        friendId: friend.id,
        name: friend.friendName,
        avatar: friend.friendAvatar,
        status: friend.friendStatus,
        notifications: friend.friendUnreadMessages,
      });

      console.log(friendsList.value);
    })

  }).catch(error => {
    console.error('Error during fetching friend requests:', error.response ? error.response.data :  error.message);
  });

}


const removeFriend = (friendId: number) => {
  console.log('Removing friend:', friendId);

  axios.post('http://127.0.0.1:3333/friend/remove-friend',{
    friendId: friendId
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    if(showChannels.value){
      getMemberList();
    } else {
      getFriendsList();
    }
  }).catch(error => {
    console.error('Error during fetching friend requests:', error.response ? error.response.data :  error.message);
  });

}

const getActiveServer = async (serverId: number) => {
  try {
    const response = await axios.post('http://127.0.0.1:3333/server/get-active-server', {
      serverId: serverId
    }, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      }
    });
    
    const activeServerData = response.data.formattedActiveServer;  

    activeServer.id = activeServerData.id;
    activeServer.name = activeServerData.name;
    activeServer.avatar = activeServerData.avatar;
    activeServer.private = activeServerData.privacy;
    activeServer.role = activeServerData.role;
    activeServer.userid = activeServerData.userid;

    console.log("Active server assigned:", activeServer);
  } catch (error) {
    console.error('Error during fetching active server:', error.response ? error.response.data : error.message);
  }
};

const getServerChannels = async (serverId: number) => {
  channelList.value = [];
  try {
    const response = await axios.post('http://127.0.0.1:3333/server/get-server-channels',{
      serverId: serverId
    },{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
        'Content-Type': 'application/json',
      },
    })

    response.data.serverChannels.forEach((channel: any) => {
      console.log('channel:', channel)

      channelList.value.push({
        id: channel.id,
        name: channel.name,
        notifications: channel.notifications || 0,
        position: channel.position,
      })

      console.log('channel List:', channelList)
    })
    channelList.value.sort((a, b) => a.position - b.position)
    // console.log('Sorted Server List:', serverList)
  } catch (error) {
    console.error('Error fetching channel list:', error.response?.data || error.message)
  }
}

const leaveServer = async () => {
  axios.post('http://127.0.0.1:3333/server/leave-server',{
    serverId: activeServer.id
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getFriendsList();
    showChannels.value = false;
    loadChannel(friendsList.value[0].name);
  }).catch(error => {
    console.error('Error during updating channel:', error.response ? error.response.data :  error.message);
  });
}

const updateServer = async () => {
  axios.post('http://127.0.0.1:3333/server/update-server',{
    serverId: activeServer.id,
    name: editingServer.name,
    privacy: editingServer.private,
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getActiveServer(activeServer.id);
  }).catch(error => {
    console.error('Error during leaving server:', error.response ? error.response.data :  error.message);
  });
}

const deleteServer = async () => {
  axios.post('http://127.0.0.1:3333/server/delete-server',{
    serverId: activeServer.id
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getFriendsList();
    showChannels.value = false;
    loadChannel(friendsList.value[0].name);
  }).catch(error => {
    console.error('Error during deleting server:', error.response ? error.response.data :  error.message);
  });
}

const getMemberList = async () => {
  showMemberList.value = true;
  memberList.value = [];
  axios.post('http://127.0.0.1:3333/server/get-member-list',{
    serverId: activeServer.id,
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data.members);

    response.data.members.forEach((member : any) => {
      console.log('Member:', member);

      memberList.value.push({
        id: member.id,
        name: member.username,
        avatar: member.avatar,
        status: member.status,
        role: member.role,
        isFriend: member.isFriend,
      });

      console.log(memberList.value);
    })

  }).catch(error => {
    console.error('Error during fetching friend requests:', error.response ? error.response.data :  error.message);
  });

}

const kickMember = async (memberId: number) => {
  axios.post('http://127.0.0.1:3333/server/kick-server-member',{
    memberId: memberId,
    serverId: activeServer.id
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getMemberList();
  }).catch(error => {
    console.error('Error creating channel:', error.response ? error.response.data :  error.message);
  });
}

const banMember = async (memberId: number) => {
  console.log('Banning member:', memberId);
  axios.post('http://127.0.0.1:3333/server/ban-server-member',{
    serverId: activeServer.id,
    memberId: memberId
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getMemberList();
  }).catch(error => {
    console.error('Error creating channel:', error.response ? error.response.data :  error.message);
  });
}




const inviteFriend = async () => {
  axios.post('http://')
}

const createChannel = async () => {
  axios.post('http://127.0.0.1:3333/server/create-channel',{
    name: newChannelName.value,
    serverId: activeServer.id,
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getServerChannels(activeServer.id);
    currentChannel.value = newChannelName.value;
    newChannelName.value = '';
  }).catch(error => {
    console.error('Error creating channel:', error.response ? error.response.data :  error.message);
  });
}

const updateChannelposition = async () => {
  const channelPositions = channelList.value.map((channel, index) => {
    return {
      id: channel.id,
      position: index + 1
    }
  })

  axios.post('http://127.0.0.1:3333/server/update-channel-positions',{
    channels: channelPositions,
    serverId: activeServer.id
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    // getServerList();
  }).catch(error => {
    console.error('Error during updating server positions:', error.response ? error.response.data :  error.message);
  });
}

const updateChannel = async () => {
  axios.post('http://127.0.0.1:3333/server/update-channel',{
    channelId: selectedChannelSettings.id,
    name: selectedChannelSettings.name,
    serverId: activeServer.id
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getServerChannels(activeServer.id);
  }).catch(error => {
    console.error('Error during updating channel:', error.response ? error.response.data :  error.message);
  });
}

const deleteChannel = async () => {
  axios.post('http://127.0.0.1:3333/server/delete-channel',{
    channelId: selectedChannelSettings.id,
    serverId: activeServer.id
  },{
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data);
    getServerChannels(activeServer.id);
  }).catch(error => {
    console.error('Error during updating channel:', error.response ? error.response.data :  error.message);
  });
}

// Watchers
watch(
  () => [props.receivedServerId, props.lastUpdate],
  ([newId]) => {
    console.log('receivedServerId value:', newId);
    if (newId !== undefined && newId !== null) {
      getActiveServer(props.receivedServerId);
      getServerChannels(props.receivedServerId);
      showChannels.value = true;
      if (channelList.value.length > 0) {
        currentChannel.value = channelList.value[0].name;
      }

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
      getFriendsList();
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
// loadChannel(friendsList.value[0].name);
getFriendsList()
getFriendRequests();
</script>


<style>

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

.fr-badge {
  font-size: 0.001rem !important;
  margin-top: -0.2rem;
  margin-right: -0.3rem;
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

.scrollable::-webkit-scrollbar {
  display: none;
}
</style>
