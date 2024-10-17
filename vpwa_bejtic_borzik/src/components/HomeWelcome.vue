<template>
    <div class="text-center welcome-section window-height row flex-center flex-md-column">
      <div class="flex-container">
        <div class="left-column">
          <h4 class="welcome-title">Welcome to <span class="text-bold text-primary">Comb-bot</span></h4>
          <p class="welcome-subtitle text-subtitle1">Your all-in-one platform for connecting, sharing, and discovering!</p>
          <p class="q-mt-md welcome-description">Join our community and stay updated with the latest features and enhancements. Explore, interact, and make the most out of your experience!</p>
          <q-btn label="Register Now" color="primary" class="register-button" @click="goToRegister"/>
        </div>
        
        <div class="right-column">
          <div class="q-gutter-md">
            <q-card class="feature-card">
              <q-card-section>
                <h4 class="text-h6">🔒 Safe and Private Chatting</h4>
                <p>Your safety is our priority. All your messages are encrypted, so you can chat without worries.</p>
              </q-card-section>
            </q-card>
  
            <q-card class="feature-card">
              <q-card-section>
                <h4 class="feature-title text-h6">👥 Connect with Your Community</h4>
                <p>Create and manage groups, share ideas, and connect with people who share your interests.</p>
              </q-card-section>
            </q-card>
  
            <q-card class="feature-card">
              <q-card-section>
                <h4 class="feature-title text-h6">🎉 Organize Events</h4>
                <p>Create and plan events with friends, so you can meet in person and celebrate special moments.</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
</template>


<script setup lang="ts">
    import { useRouter } from 'vue-router'
    const router = useRouter()
    function goToRegister() {
      router.push('/register')
    }
</script>
  
  
<style scoped>
  
  .flex-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* Ensures both columns have equal height */
}

.welcome-title {
  margin-top: 65px;
}

.welcome-subtitle {
  margin-top: 50px;
  width: 80%;
}

.welcome-description {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 80%;
}

.left-column {
  flex: 1;
  margin-right: 20px;
  display: flex;
  flex-direction: column; /* Stacks content vertically */
  justify-content: flex-start; /* Centers content vertically */
  align-items: center; /* Centers content horizontally */
  border: var(--q-primary) 3px solid;
  border-radius: 1.5rem;
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures equal distribution of cards */
}

.feature-card {
  background-color: #1e2021;
  border-radius: 1.5rem;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: scale(1.02);
}

.register-button {
  margin-top: 65px;
  border-radius: 20rem;
  width: 45%;
  text-align: center;
  transition: transform 0.3s;
}

.register-button:hover {
  transform: scale(1.02);
}

  </style>
  