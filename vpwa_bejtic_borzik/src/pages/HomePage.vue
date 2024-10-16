<template>
  <q-page>
    <HomeTitleBar />
    <div class="page">
      <div class="container">
        <div class="content">
          <HomeWelcome />
          <HomeNews />
          <HomeFAQ />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import HomeTitleBar from '../components/HomeTitleBar.vue';
import HomeNews from '../components/HomeNews.vue';
import HomeFAQ from '../components/HomeFAQ.vue';
import HomeWelcome from '../components/HomeWelcome.vue';
</script>

<style scoped>

.page {
  max-width: 1200px;
  margin: 0 auto;
}

.container {
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%; 
}

.content > * {
  min-height: 100vh; 
  display: flex;
  justify-content: center;
  align-items: center;
}




</style>
