<template>
  <q-page>
    <div class="row fullscreen ">
      <SidePanel />
      <jebo />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SidePanel from '../components/SidePanel.vue'
import jebo from '../components/JeboPes.vue'

</script>

<style scoped>
  .q-page {
    background-color: var(--q-dark);
  }
</style>
