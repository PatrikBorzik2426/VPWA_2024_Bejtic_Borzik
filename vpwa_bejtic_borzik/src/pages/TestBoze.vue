<template>
    <q-layout>
    <q-header elevated class="bg-primary text-black">
        <div class="toolbar">
      <q-toolbar>
        <q-toolbar-title>
          <img src="path/to/your/logo.png" alt="Comb-bot Logo" class="logo" /> <!-- Tvoje logo -->
        </q-toolbar-title>
  
        <div class="q-gutter-sm"> <!-- Obal pre tlačidlá -->
          <q-btn unelevated rounded label="Novinky" @click="goToNews" />
          <q-btn unelevated rounded label="FAQ" @click="goToFAQ" />
          <q-btn unelevated rounded label="O nás" @click="goToAbout" />
        </div>
  
        <div class="spacer"></div> <!-- Medzera medzi tlačidlami a Login -->
        <div class="">
            <q-btn unelevated rounded color="grey-4" label="Login" @click="goToLogin"/> 
        </div>

      </q-toolbar>
    </div>
    </q-header>
    
  <q-page class="q-pa-md">
    <div class="text-center">
      <h1 class="text-h3">Vitajte na Comb-bot!</h1>
      <p class="text-subtitle2">Objavte naše najnovšie funkcie a spojte sa s priateľmi.</p>
    </div>

    <div class="q-mt-md">
      <q-card v-for="news in newsItems" :key="news.id" class="my-card">
        <q-card-section>
          <h2 class="text-h5">{{ news.title }}</h2>
          <p>{{ news.content }}</p>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-md">
      <q-separator />
      <h2 class="text-h4 q-mt-lg">FAQ</h2>
      <q-list>
        <q-item v-for="faq in faqItems" :key="faq.id">
          <q-item-section>
            <q-item-label class="text-h6">{{ faq.question }}</q-item-label>
            <q-item-label caption>{{ faq.answer }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="q-mt-md">
      <q-separator />
      <h2 class="text-h4 q-mt-lg">O nás</h2>
      <p>
        Sme tím nadšených jednotlivcov, ktorí veria v moc spojenia a zdieľania informácií.
        Náš cieľ je vytvoriť platformu, ktorá spojí ľudí zo všetkých kútov sveta.
      </p>
    </div>

    <div class="q-mt-md">
      <q-btn label="Prihláste sa teraz" color="primary" @click="goToLogin" />
    </div>
  </q-page>
</q-layout>
</template>


  
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const newsItems = ref([
  { id: 1, title: 'Novinka 1', content: 'Popis prvej novinky.' },
  { id: 2, title: 'Novinka 2', content: 'Popis druhej novinky.' },
  { id: 3, title: 'Novinka 3', content: 'Popis tretej novinky.' },
]);

const faqItems = ref([
  { id: 1, question: 'Čo je Comb-bot?', answer: 'Comb-bot je platforma na spojenie s priateľmi.' },
  { id: 2, question: 'Ako sa zaregistrovať?', answer: 'Jednoducho kliknite na registračné tlačidlo.' },
  { id: 3, question: 'Kde nájdem ďalšie informácie?', answer: 'Pozrite sa na našu FAQ sekciu.' },
]);


function goToNews() {
  router.push('/news'); // Presmerovanie na stránku Novinky
}

function goToFAQ() {
  router.push('/faq'); // Presmerovanie na stránku FAQ
}

function goToAbout() {
  router.push('/about'); // Presmerovanie na stránku O nás
}

function goToLogin() {
  router.push('/login'); // Presmerovanie na stránku Login
}
</script>

<style scoped>
.logo {
  height: 40px; /* Prispôsob veľkosť loga podľa potreby */
  margin-right: 16px; /* Medzera medzi logom a tlačidlami */
}

.q-toolbar-buttons {
  display: flex; /* Použitie flexboxu pre zarovnanie tlačidiel vedľa seba */
  gap: 16px; /* Medzera medzi tlačidlami */
}

.spacer {
  flex-grow: 1; /* Rovnako rozšíriť priestor medzi tlačidlami a Login */
}

.toolbar { max-width: 1200px; margin: 0 auto;/* Centerthetoolbar*/ 
}
</style>
  
