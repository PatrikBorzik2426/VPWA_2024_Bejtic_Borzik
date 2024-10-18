<template>
  <div class="row justify-between fullscreen bg-primary q-pa-sm">
    <div class="channel-rooms rounded-borders col-2 bg-dark">
      <!-- Channel Rooms Content Here -->
    </div>

    <div class="chat-window rounded-borders col-10 bg-dark column q-pa-md">
      <div class="col-10">
        <!-- Additional Chat Content Here -->
      </div>

      <!-- Conditionally Render the Input Form -->
      <q-form class="col-1 full-width row bg-primary rounded-borders" v-if="showComponent">
        <q-input
          class=""
          borderless
          color="transparent"
          hide-bottom-space
          dense
          placeholder="Type your command here"
        />
      </q-form>

      <div class="cli bg-primary col-1 q-mt-auto rounded-borders q-px-sm">
        <q-form class="full-height full-width row justify-between items-center">
          <q-input
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
</template>

<script setup>
import { ref } from 'vue';

const inputValue = ref('');
const showComponent = ref(false);

const checkCommand = () => {
  showComponent.value = inputValue.value.startsWith('/');
};

</script>

<style>
.chat-window,
.channel-rooms {
  border: var(--q-primary) 3px solid;
  border-radius: 1rem;
}

.cli {
  max-height: 40px !important;
}
</style>
