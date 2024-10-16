<template>
    <q-layout>
      <!-- Header -->
      <q-header elevated class="bg-primary text-white">
        <div class="page">
          <q-toolbar>
            <q-toolbar-title>
              <img src="path/to/your/logo.png" alt="Comb-bot Logo" class="logo" @click="goToHomepage"/> Comb-bot
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
              <h2 class="text-h4 q-mt-lg">O nás</h2>
              <p>
                Sme tím nadšených jednotlivcov, ktorí veria v moc spojenia a zdieľania informácií. 
                Náš cieľ je vytvoriť platformu, ktorá spojí ľudí zo všetkých kútov sveta.
              </p>
              <p>
                Naša aplikácia ponúka široké spektrum funkcií, vrátane chatovania, vytvárania skupín, 
                organizovania udalostí a zdieľania multimediálneho obsahu. Chceme, aby ste sa cítili ako doma, 
                kým zdieľate svoje myšlienky a zážitky s ostatnými.
              </p>
              <p>
                V Comb-bote sa snažíme neustále zlepšovať a prispôsobovať našu platformu 
                potrebám našich používateľov. Vaša spätná väzba je pre nás veľmi dôležitá!
              </p>
  
              <h3 class="text-h5 q-mt-lg">Funkcie našej aplikácie</h3>
              <ul class="q-list">
                <li><q-icon name="chat" /> Rýchle a bezpečné chatovanie s priateľmi a skupinami.</li>
                <li><q-icon name="group" /> Vytváranie a správa skupín pre diskusie a spoluprácu.</li>
                <li><q-icon name="event" /> Organizovanie udalostí a plánovanie stretnutí.</li>
                <li><q-icon name="image" /> Zdieľanie obrázkov, videí a iného multimediálneho obsahu.</li>
                <li><q-icon name="settings" /> Možnosti prispôsobenia a nastavenia účtu.</li>
              </ul>
  
              <h3 class="text-h5 q-mt-lg">Ako to funguje?</h3>
              <p>
                Na začiatok sa zaregistrujete a vytvoríte si svoj profil. Potom môžete začať chatovať s priateľmi, 
                pripojiť sa k skupinám alebo vytvárať nové. Naša platforma je navrhnutá tak, aby bola užívateľsky 
                prívetivá a intuitívna, takže sa rýchlo dostanete do kontaktu so všetkými funkciami.
              </p>
  
              <h3 class="text-h5 q-mt-lg">Kontaktujte nás</h3>
              <p>
                Ak máte akékoľvek otázky alebo návrhy, neváhajte nás kontaktovať na <a href="mailto:support@combbot.com">support@combbot.com</a>.
              </p>
            </div>
          </q-page>
        </div>
      </div>
    </q-layout>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
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
    router.push('/'); // Presmerovanie na domovskú stránku
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
    margin: 0 auto; /* Centerthetoolbar */ 
  }
  
  .q-list {
    text-align: left; /* Zarovnanie textu v zozname */
    margin: 0 auto; /* Centrum zoznamu */
    max-width: 600px; /* Maximálna šírka zoznamu */
  }
  </style>
  