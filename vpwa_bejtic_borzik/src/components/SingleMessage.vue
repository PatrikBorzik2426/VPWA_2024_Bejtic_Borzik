<template>
  <div class="  overflow-auto q-pr-md" ref="messageList"
    :style = "{maxHeight: $q.screen.gt.sm ? '82.5vh' : '70vh'}"
  >
  <q-infinite-scroll @load="onLoad" :offset="250" reverse >
    <template v-slot:loading>
        <div class="row justify-center" >
          <q-spinner-dots color="primary" size="40px" v-if="wholeMessageLen<101"/>
          <p v-else>No more messages ... You have found the beginning!</p>
        </div>
    </template>

    <q-item class="q-pa-none" v-for="(message) in wholeMessage" :key="message.id">
      <div class="row item-section-msg full-width q-pa-sm rounded-borders" :class="{'bg-grey-10':isMentioned(message)}">
        <q-avatar class="profile-box q-mr-md">
          <img src="https://cdn.quasar.dev/img/avatar4.jpg" class=" full-height"/>
        </q-avatar>
        <div class=" message-box column">
          <p><span class=" text-bold cursor-pointer ">{{message.user.login}}</span>  <span class=" text-grey-7 q-ml-lg">{{ message.timestamp }}</span></p>
          <p class="">{{message.text}}</p>
        </div>
      </div>
    </q-item>
    
  </q-infinite-scroll>
</div>

</template>

<script setup lang="ts">
import { defineProps,ref,watch } from 'vue';
import { Message } from 'src/types/Message';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps<{
  message1: {[key: number]: Message};
  message2: {[key: number]: Message};
}>();

let wholeMessage = ref<{[key: number]: Message}>(props.message1); 
let wholeMessageLen = ref<number>(0);  
let messageList = ref<HTMLElement | null>(null);

const isMentioned = (message : Message) =>{
  if (message.text.toLowerCase().includes('@someone')) {
    console.log('someone mentioned')
    return true;
  }

  return false;
};

const onLoad = (index : number,done : any) => {
  console.log(index)
  setTimeout(()=>{
      const lenMessage2 = Object.keys(props.message2).length;

      wholeMessage.value={}

      Object.keys(props.message2).forEach((key,index)=>{
        wholeMessage.value[index] = props.message2[key]
      })

      Object.keys(props.message1).forEach((key,index)=>{
        wholeMessage.value[index+lenMessage2] = props.message1[key]
      });

      wholeMessageLen.value = Object.keys(wholeMessage.value).length;

    done();
  }, 500);
};

watch(
  () => props.message1,
  () => {
    onLoad(1,()=>{});

    setTimeout(()=>{
      if (messageList.value) {
        messageList.value.scrollTop = messageList.value.scrollHeight;
      }
    }, 501);
  },
  { deep: true } // Enable deep watching for nested changes
);


</script>

