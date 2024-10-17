<template>
  <div class=" row justify-between fullscreen bg-primary q-pa-sm">
    <div class="channel-rooms rounded-borders col-2  bg-dark">
       
    </div>

    <div class="chat-window rounded-borders col-10 bg-dark column q-pa-md">
      <div class=" col-11">
        
      </div>
      <div class="cli bg-primary col-1 q-mt-auto rounded-borders q-px-sm">
        <q-form @submit="sendMessage" class=" full-height full-width">
          <q-input class="no-border-input" borderless="true" color="transparent" outlined="false" autofocus hide-bottom-space="true" dense placeholder="Type your message here" />
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style>
.chat-window, .channel-rooms{
  border: var(--q-primary) 3px solid;
  border-radius: 1rem;
}

.cli{
  max-height: 40px !important;
}

</style>
