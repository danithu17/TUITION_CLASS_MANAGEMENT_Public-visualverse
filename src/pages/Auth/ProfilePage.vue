<template>
  <q-page class="q-pa-lg profile-page">
    <div class="mesh-bg"></div>

    <div class="row justify-center q-mt-xl">
      <div class="col-12 col-md-6 animate-fade-up">
        <q-card class="card-advanced q-pa-lg overflow-hidden relative-position">
          <div class="absolute-top-right q-pa-md">
            <q-badge :color="roleColor" class="q-pa-sm text-uppercase letter-spacing-1">{{
              userProfile?.role
            }}</q-badge>
          </div>

          <q-card-section class="text-center">
            <div class="relative-position inline-block q-mb-lg">
              <q-avatar size="120px" class="border-glow-primary">
                <q-icon name="person" color="primary" size="80px" />
              </q-avatar>
              <q-btn round color="primary" icon="edit" size="sm" class="absolute-bottom-right" />
            </div>

            <h2 class="text-h4 text-weight-bolder text-white q-mt-none q-mb-xs">
              {{ userProfile?.full_name }}
            </h2>
            <p class="text-grey-5">{{ user?.email }}</p>
          </q-card-section>

          <q-separator dark class="q-my-xl opacity-05" />

          <q-card-section class="q-gutter-y-lg">
            <div class="auth-input-group">
              <span class="input-label">Full Name</span>
              <q-input v-model="profileForm.full_name" dark outlined dense class="premium-input" />
            </div>

            <div class="auth-input-group">
              <span class="input-label">Contact Number</span>
              <q-input
                v-model="profileForm.contact_number"
                dark
                outlined
                dense
                class="premium-input"
                placeholder="+94 7x xxx xxxx"
              />
            </div>

            <div class="auth-input-group">
              <span class="input-label">Bio / Academic Note</span>
              <q-input
                v-model="profileForm.bio"
                type="textarea"
                dark
                outlined
                dense
                class="premium-input"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div
              v-if="institute"
              class="auth-input-group q-pa-md bg-glass-dark rounded-borders-12 border-glow-subtle"
            >
              <div class="text-caption text-grey-5 text-uppercase letter-spacing-1 q-mb-xs">
                Affiliated Hub
              </div>
              <div class="text-h6 text-white text-weight-bold">{{ institute.name }}</div>
              <div class="text-caption text-cyan">
                Member since {{ new Date(userProfile?.created_at).toLocaleDateString() }}
              </div>
            </div>

            <div class="row justify-between items-center q-mt-xl">
              <div class="text-caption text-grey-6">Last sync: {{ lastSync }}</div>
              <q-btn
                unelevated
                color="primary"
                label="Save Changes"
                icon="save"
                class="btn-premium q-px-xl"
                @click="saveProfile"
                :loading="loading"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const user = ref(null)
const userProfile = ref(null)
const institute = ref(null)
const loading = ref(false)

const profileForm = ref({
  full_name: '',
  bio: '',
  contact_number: '',
})

const roleColor = computed(() => {
  if (userProfile.value?.role === 'admin') return 'negative'
  if (userProfile.value?.role === 'teacher') return 'cyan'
  return 'primary'
})

const lastSync = computed(() => {
  if (!userProfile.value?.updated_at) return 'Never'
  return new Date(userProfile.value.updated_at).toLocaleString()
})

async function fetchProfile() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  user.value = session?.user || null

  if (user.value) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()

    userProfile.value = data
    profileForm.value.full_name = data.full_name || ''
    profileForm.value.bio = data.bio || ''
    profileForm.value.contact_number = data.contact_number || ''

    if (data.institute_id) {
      const { data: inst } = await supabase
        .from('institutes')
        .select('*')
        .eq('id', data.institute_id)
        .single()
      institute.value = inst
    }
  }
}

async function saveProfile() {
  loading.value = true
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: profileForm.value.full_name,
      bio: profileForm.value.bio,
      contact_number: profileForm.value.contact_number,
      updated_at: new Date(),
    })
    .eq('id', user.value.id)

  if (!error) {
    $q.notify({
      color: 'positive',
      message: 'Profile updated in the Nebula core!',
      icon: 'verified',
      position: 'top',
    })
    fetchProfile()
  } else {
    $q.notify({ color: 'negative', message: 'Update failed: ' + error.message })
  }
  loading.value = false
}

onMounted(fetchProfile)
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: calc(100vh - 64px);
}
.inline-block {
  display: inline-block;
}
</style>
