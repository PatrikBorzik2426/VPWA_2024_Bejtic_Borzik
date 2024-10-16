<template>
  <q-layout>
    <!-- Header -->
    <q-header elevated class="q-mb-lx bg-primary text-white">
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
    <div class="page">
      <q-page>
        <div class="q-pa-md text-center">
          <h1 class="q-mt-xl text-h3">Vitajte na Comb-bot!</h1>
          <p class="text-subtitle2">Objavte naše najnovšie funkcie a spojte sa s priateľmi.</p>

          <q-btn unelevated rounded color="secondary" label="Zaregistrovať sa" @click="goToRegister" />

          <q-separator class="q-my-md" />

          <h2 class="text-h4">Prečo si vybrať Comb-bot?</h2>
          <div class="q-gutter-md">
            <q-card>
              <q-card-section>
                <h4 class="text-h6">🔒 Bezpečné a súkromné chatovanie</h4>
                <p>
                  Vaša bezpečnosť je pre nás prvoradá. Všetky vaše správy sú šifrované, aby ste si mohli chatovať bez obáv.
                </p>
              </q-card-section>
            </q-card>

            <q-card>
              <q-card-section>
                <h4 class="text-h6">👥 Spojte sa so svojou komunitou</h4>
                <p>
                  Vytvárajte a spravujte skupiny, zdieľajte myšlienky a spojte sa s ľuďmi, ktorí majú podobné záujmy.
                </p>
              </q-card-section>
            </q-card>

            <q-card>
              <q-card-section>
                <h4 class="text-h6">🎉 Zorganizujte udalosti</h4>
                <p>
                  Vytvárajte a plánujte udalosti s priateľmi, aby ste sa mohli stretnúť naživo a osláviť špeciálne chvíle.
                </p>
              </q-card-section>
            </q-card>
          </div>

          <q-separator class="q-my-md" />

          <h2 class="text-h4">Posledné novinky</h2>
          <ul class="q-list">
            <li>🔹 Nové funkcie na správu notifikácií!</li>
            <li>🔹 Zlepšená mobilná verzia pre pohodlné používanie.</li>
            <li>🔹 Nové možnosti prispôsobenia profilu.</li>
          </ul>
        </div>
      </q-page>
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

function goToRegister() {
  router.push('/register'); // Presmerovanie na stránku registrácie
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

.q-list {
  text-align: left; /* Zarovnanie textu v zozname */
  margin: 0 auto; /* Centrum zoznamu */
  max-width: 600px; /* Maximálna šírka zoznamu */
}
</style>
