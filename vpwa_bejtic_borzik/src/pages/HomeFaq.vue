<template>
    <q-layout>
      <!-- Header -->
      <q-header elevated class="bg-primary text-white">
        <div class="page">
          <q-toolbar>
            <q-toolbar-title>
              <img src="path/to/your/logo.png" alt="Comb-bot Logo" class="logo" @click="goToHomepage" /> Comb-bot
            </q-toolbar-title>
            <q-btn unelevated rounded flat label="News" @click="goToNews" />
            <q-btn unelevated rounded flat label="FAQ" @click="goToFAQ" />
            <q-btn unelevated rounded flat label="About us" @click="goToAbout" />
            <div class="q-spacer"></div>
            <q-btn unelevated rounded color="grey-4" label="Login" @click="goToLogin" />
          </q-toolbar>
        </div>
      </q-header>
  
      <!-- Hlavný obsah -->
      <div class="q-pa-md text-center">
        <div class="page">
          <q-page>
            <div class="q-mt-md q-mt-xl">
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
          </q-page>
        </div>
      </div>
    </q-layout>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const faqItems = ref([
    { id: 1, question: 'Čo je Comb-bot?', answer: 'Comb-bot je platforma na spojenie s priateľmi a zdieľanie informácií.' },
    { id: 2, question: 'Ako sa zaregistrovať?', answer: 'Jednoducho kliknite na registračné tlačidlo na domovskej stránke.' },
    { id: 3, question: 'Kde nájdem ďalšie informácie?', answer: 'Pozrite sa na našu FAQ sekciu alebo nás kontaktujte priamo.' },
    { id: 4, question: 'Aké funkcie Comb-bot ponúka?', answer: 'Comb-bot ponúka chatovanie, vytváranie skupín, zdieľanie súborov a organizovanie udalostí.' },
    { id: 5, question: 'Je Comb-bot bezpečný?', answer: 'Áno, Comb-bot používa šifrovanie na ochranu vašich osobných údajov a správ.' },
    { id: 6, question: 'Môžem získať prístup k Comb-bot z mobilu?', answer: 'Áno, Comb-bot je optimalizovaný pre mobilné zariadenia a môžete ho používať kdekoľvek.' },
    { id: 7, question: 'Ako môžem zmeniť svoje heslo?', answer: 'Prihláste sa a navštívte sekciu Nastavenia, kde môžete zmeniť svoje heslo.' },
    { id: 8, question: 'Môžem zrušiť svoj účet?', answer: 'Áno, zrušenie účtu môžete vykonať v sekcii Nastavenia pod "Správa účtu".' },
  ]);
  
  function goToNews() {
    router.push('/news'); // Presmerovanie na stránku Novinky
  }
  
  function goToFAQ() {
    router.push('/faq'); // Presmerovanie na stránku FAQ
  }
  
  function goToAbout() {
    router.push('/aboutus'); // Presmerovanie na stránku O nás
  }
  
  function goToLogin() {
    router.push('/login'); // Presmerovanie na stránku Login
  }
  
  function goToHomepage() {
    router.push('/'); // Presmerovanie na stránku domov
  }
  </script>
  
  <style scoped>
  .my-card {
    margin: 16px 0;
  }
  .logo {
    height: 40px; /* Prispôsob veľkosť loga podľa potreby */
    margin-right: 16px; /* Medzera medzi logom a názvom */
  }
  
  .page {
    max-width: 1200px;
    margin: 0 auto; /* Centrum stránky */
  }
  </style>
  