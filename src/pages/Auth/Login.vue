<template>
  <q-page class="flex flex-center relative-position overflow-hidden auth-page">
    <!-- Distinct Background Layer -->
    <div class="auth-mesh-bg"></div>
    <div class="floating-orb orb-1"></div>
    <div class="floating-orb orb-2"></div>

    <!-- Back to Home Button -->
    <div class="absolute-top-left q-pa-md z-top back-btn-container">
      <q-btn
        flat
        no-caps
        color="white"
        icon="arrow_back"
        :label="$q.screen.gt.xs ? 'Back to Home' : ''"
        class="glass-btn-sm"
        to="/"
      />
    </div>

    <div class="row justify-center items-center auth-container">
      <div class="auth-card-container animate-fade-up">
        <q-card class="bg-glass-ultra auth-card border-glow-premium q-pa-xl">
          <q-card-section class="text-center q-pb-lg">
            <div class="logo-wrapper q-mb-md">
              <q-icon name="auto_stories" color="primary" size="64px" class="animate-pulse" />
            </div>
            <div class="brand-text text-weight-bolder text-white">NEBULA</div>
            <div class="subtitle text-primary text-weight-bold text-uppercase">
              Galaxy IQ Ecosystem
            </div>
            <p class="text-grey-5 q-mt-sm">Your portal to educational excellence awaits</p>
          </q-card-section>

          <q-form @submit="handleLogin" class="q-gutter-y-lg q-mt-md">
            <div class="auth-input-group">
              <span class="input-label">Digital Identity (Email)</span>
              <q-input
                v-model="email"
                placeholder="commander@nebula.io"
                dark
                outlined
                dense
                class="premium-input-glass"
                :rules="[(val) => !!val || 'Email is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="alternate_email" color="cyan" size="20px" />
                </template>
              </q-input>
            </div>

            <div class="auth-input-group">
              <span class="input-label">Security Protocol (Password)</span>
              <q-input
                v-model="password"
                placeholder="••••••••"
                dark
                outlined
                dense
                type="password"
                class="premium-input-glass"
                :rules="[(val) => !!val || 'Password is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_open" color="cyan" size="20px" />
                </template>
              </q-input>
            </div>

            <div class="q-pt-md">
              <q-btn
                label="Initialize Session"
                type="submit"
                unelevated
                class="full-width btn-modern text-weight-bolder"
                :loading="loading"
              />
            </div>
          </q-form>
          <div class="row justify-between items-center q-pt-sm q-mb-lg">
            <q-checkbox
              v-model="rememberMe"
              label="Persist Session"
              dark
              dense
              class="text-grey-5 text-caption"
            />
            <q-btn
              flat
              no-caps
              label="Lost Access?"
              color="primary"
              class="text-caption hover-glow-text"
            />
          </div>

          <q-separator dark class="q-my-md opacity-05" />

          <div class="text-center q-pt-sm">
            <p class="text-grey-6 text-caption">
              New to the Galaxy?
              <q-btn
                flat
                no-caps
                label="Join Ecosystem"
                color="primary"
                class="text-weight-bold hover-glow-text"
                to="/register"
              />
            </p>
          </div>
        </q-card>
      </div>

      <div class="text-center q-mt-xl text-grey-7 text-caption letter-spacing-2">
        ENCRYPTED CORE SYNC v2.6.0
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

// Setting name to satisfy ESLint multi-word component rule
defineOptions({
  name: 'LoginPage',
})

const $q = useQuasar()
const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  console.log('Attempting login with:', email.value)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      console.error('Login Error:', error)
      throw error
    }

    console.log('Login Success:', data)
    $q.notify({
      color: 'positive',
      message: 'Authentication successful. Welcome Commander.',
      icon: 'verified_user',
      position: 'top',
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Catch Error:', error)
    $q.notify({
      color: 'negative',
      message: error.message || 'Authentication failed',
      caption: error.status === 400 ? 'Please check your credentials or confirm your email.' : '',
      icon: 'security_update_warning',
      position: 'top',
      timeout: 5000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  background: #020617;
}

.auth-mesh-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 40%);
  z-index: 0;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.1;
  animation: float-slow 15s infinite alternate ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: #06b6d4;
  top: -100px;
  right: -50px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: #3b82f6;
  bottom: -50px;
  left: -50px;
  animation-delay: -5s;
}

@keyframes float-slow {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(50px, 30px) scale(1.1);
  }
}

.auth-card-container {
  width: 100%;
  max-width: 520px; // Slightly wider for premium feel
}

// Styles
.auth-container {
  min-height: 90vh;
  position: relative;
  z-index: 1;
}

.auth-card-container {
  width: 100%;
  max-width: 520px;
}

.auth-card {
  border-radius: 40px !important;
  overflow: hidden;
}

.logo-wrapper {
  background: rgba(6, 182, 212, 0.1);
  width: 100px;
  height: 100px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px solid rgba(6, 182, 212, 0.2);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);
}

.brand-text {
  font-size: 2.2rem;
  letter-spacing: 4px;
  line-height: 1;
}

.subtitle {
  font-size: 10px;
  letter-spacing: 2px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(6, 242, 254, 0.5));
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
    filter: drop-shadow(0 0 15px rgba(6, 242, 254, 0.8));
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(6, 242, 254, 0.5));
  }
}

.animate-pulse {
  animation: pulse 3s infinite ease-in-out;
}

// Premium inputs now handled globally via .premium-input-glass or .premium-input
.premium-input-glass {
  :deep(.q-field__control) {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.03) !important;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    height: 56px;

    &::before {
      border-color: rgba(255, 255, 255, 0.1);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05) !important;
      &::before {
        border-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  &.q-field--focused :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.15);
    transform: scale(1.01);
  }
}

.btn-premium-cta {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
  color: white;
  border-radius: 18px;
  height: 60px;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 1px;
  transition: all 0.4s ease;
  box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.4);

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 35px -5px rgba(6, 182, 212, 0.6);
    filter: brightness(1.1);
  }
}

.hover-glow-text:hover {
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.animate-fade-up {
  animation: fade-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.z-top {
  z-index: 10;
}

.glass-btn-sm {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    transform: translateX(-5px);
  }
}

@media (max-width: 599px) {
  .back-btn-container {
    padding-top: 30px !important;
    padding-left: 20px !important;
  }
  .auth-container {
    padding-top: 80px;
    min-height: auto;
  }
  .auth-card {
    padding: 24px !important;
    border-radius: 30px !important;
  }
  .brand-text {
    font-size: 1.8rem;
  }
}
</style>
