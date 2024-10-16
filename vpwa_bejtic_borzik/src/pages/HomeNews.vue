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
            <div class="q-pa-md q-mt-xl text-left">
              <q-timeline color="primary">
                <q-timeline-entry heading>
                    News and Updates
                </q-timeline-entry>
                  
                    <q-timeline-entry
                        title="Registration and Login"
                        subtitle="12 July 2021"
                    >
                    <div>
                        You can now easily register and log in using your email and nickname. Gain access to all features of Comb-bot!
                    </div>
                    </q-timeline-entry>
                    
                    <q-timeline-entry
                        title="Channel List"
                        subtitle="14 July 2021"
                    >
                    <div>
                        We've added a feature that displays a list of channels you're a member of. You can easily leave them or create new channels!
                    </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Command Line"
                        subtitle="16 July 2021"
                    >
                    <div>
                        New commands allow you to create channels and send messages directly through the command line. Try the /join or /invite command!
                    </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Notifications"
                        subtitle="20 July 2021"
                    >
                    <div>
                        The notification system informs you of new messages when you're not active. Set it up to receive only messages addressed to you!
                    </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="User Status"
                        subtitle="25 July 2021"
                    >
                    <div>
                        You can set your status (online, DND, offline), and other users will see if you're online or typing.
                    </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Message History"
                        subtitle="3 August 2021"
                    >
                    <div>
                        You can now browse message history with efficient infinite scroll, so you'll never miss important conversations.
                    </div>
                    </q-timeline-entry>


              </q-timeline>
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
    router.push('/'); // Presmerovanie na stránku domov
  }
  </script>
  
  <style scoped>
  .logo {
    height: 40px; /* Prispôsob veľkosť loga podľa potreby */
    margin-right: 16px; /* Medzera medzi logom a názvom */
  }
  
  .page {
    max-width: 1200px;
    margin: 0 auto; /* Centrum stránky */
  }
  
  .my-timeline-entry {
    margin-bottom: 16px;
  }
  </style>
  