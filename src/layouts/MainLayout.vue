<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!isAuthPage" reveal class="bg-glass-dark text-white" height-hint="64">
      <q-toolbar class="q-px-sm q-px-md-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="lt-md q-mr-sm"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="cursor-pointer" @click="scrollTo('home')" style="min-width: 120px">
          <div class="row no-wrap items-center">
            <q-icon name="auto_stories" color="primary" size="24px" class="q-mr-sm" />
            <div class="column justify-center">
              <div class="row items-center no-wrap">
                <span class="text-gradient text-weight-bolder brand-text">NEBULA</span>
                <q-badge outline color="primary" label="2026" class="q-ml-xs brand-badge" />
              </div>
              <span
                class="text-grey-5 text-weight-medium text-uppercase gt-xs"
                style="font-size: 9px; line-height: 1.2; letter-spacing: 0.5px"
                >Management System</span
              >
            </div>
          </div>
        </q-toolbar-title>

        <q-space />

        <div class="gt-sm q-gutter-md">
          <q-btn
            flat
            no-caps
            label="Home"
            class="btn-modern link-btn text-grey-3"
            color="primary"
            @click="router.push('/')"
          />
          <q-btn
            v-if="currentUser"
            flat
            no-caps
            label="Dashboard"
            class="btn-modern link-btn text-primary text-weight-bolder"
            @click="router.push('/dashboard')"
          />
          <q-btn
            flat
            no-caps
            label="Features"
            class="btn-modern link-btn text-grey-3"
            @click="scrollTo('features')"
          />
          <q-btn
            flat
            no-caps
            label="Open Source"
            class="btn-modern link-btn text-grey-3"
            @click="scrollTo('opensource')"
          />
          <q-btn
            flat
            no-caps
            label="FAQ"
            class="btn-modern link-btn text-grey-3"
            @click="scrollTo('faq')"
          />
        </div>

        <q-separator vertical inset class="q-mx-lg gt-sm" color="grey-9" />

        <div class="q-gutter-sm row items-center no-wrap">
          <template v-if="!currentUser">
            <q-btn
              flat
              no-caps
              label="Login"
              class="btn-modern link-btn text-white gt-xs"
              to="/login"
            />
            <q-btn
              unelevated
              no-caps
              label="Get Started"
              class="btn-modern nav-cta-btn"
              to="/register"
            />
          </template>
          <template v-else>
            <!-- Notification Bell -->
            <q-btn flat round icon="notifications" class="q-mr-sm text-grey-4">
              <q-badge v-if="unreadCount > 0" color="negative" floating rounded>{{
                unreadCount
              }}</q-badge>
              <q-menu class="bg-glass-ultra text-white border-glow-premium" style="width: 350px">
                <div class="row items-center justify-between q-pa-md border-bottom-subtle">
                  <div class="text-subtitle2 text-weight-bold">Intelligence Feed</div>
                  <q-btn flat dense round icon="done_all" size="sm" @click="markAllRead"
                    ><q-tooltip>Mark all as read</q-tooltip></q-btn
                  >
                </div>
                <q-list dark separator class="notifications-list">
                  <q-item
                    v-for="notif in notifications"
                    :key="notif.id"
                    :class="{ 'bg-primary-05': !notif.is_read }"
                  >
                    <q-item-section avatar>
                      <q-icon
                        :name="notif.type === 'success' ? 'verified' : 'info'"
                        :color="notif.type === 'success' ? 'positive' : 'primary'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ notif.title }}</q-item-label>
                      <q-item-label caption class="text-grey-4">{{ notif.message }}</q-item-label>
                      <q-item-label caption class="text-grey-6 text-right">{{
                        formatTime(notif.created_at)
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="notifications.length === 0" class="text-center q-pa-lg text-grey-6">
                    <q-item-section>No alerts in the sector.</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <div class="gt-sm q-mr-md column items-end line-height-1">
              <div class="text-white text-weight-bold text-uppercase" style="font-size: 11px">
                {{ userProfile?.full_name || currentUser.email.split('@')[0] }}
              </div>
              <div
                class="text-primary text-weight-medium text-uppercase"
                style="font-size: 9px; letter-spacing: 1px"
              >
                {{ userProfile?.role || 'User' }}
              </div>
            </div>
            <q-btn
              unelevated
              no-caps
              icon="logout"
              color="negative"
              class="btn-modern flat shadow-none"
              @click="handleLogout"
            >
              <q-tooltip>Sign Out</q-tooltip>
            </q-btn>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="280"
      class="bg-glass-drawer text-white"
    >
      <div class="q-pa-lg text-center q-mt-md">
        <q-avatar size="100px" class="border-glow-primary q-mb-md">
          <q-icon name="person_outline" color="primary" size="60px" />
        </q-avatar>
        <div class="text-h6 text-weight-bold">{{ userProfile?.full_name || 'Explorer' }}</div>
        <q-badge color="primary" outline class="q-mt-xs text-uppercase letter-spacing-1">{{
          userProfile?.role || 'Guest'
        }}</q-badge>
      </div>

      <q-list padding class="q-mt-md">
        <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm" to="/dashboard">
          <q-item-section avatar><q-icon name="grid_view" /></q-item-section>
          <q-item-section>Command Center</q-item-section>
        </q-item>

        <!-- Role Specific Links -->
        <template v-if="userProfile?.role === 'admin'">
          <q-item-label
            header
            class="text-grey-6 text-uppercase q-mt-md q-ml-md"
            style="font-size: 10px; letter-spacing: 2px"
            >Core Control</q-item-label
          >
          <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm">
            <q-item-section avatar><q-icon name="manage_accounts" color="cyan" /></q-item-section>
            <q-item-section>User Governance</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm">
            <q-item-section avatar
              ><q-icon name="settings_input_component" color="purple"
            /></q-item-section>
            <q-item-section>System Params</q-item-section>
          </q-item>
        </template>

        <template v-else-if="userProfile?.role === 'teacher'">
          <q-item-label
            header
            class="text-grey-6 text-uppercase q-mt-md q-ml-md"
            style="font-size: 10px; letter-spacing: 2px"
            >Faculty Hub</q-item-label
          >
          <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm">
            <q-item-section avatar
              ><q-icon name="collections_bookmark" color="cyan"
            /></q-item-section>
            <q-item-section>My Subjects</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm">
            <q-item-section avatar><q-icon name="fact_check" color="purple" /></q-item-section>
            <q-item-section>Assignments</q-item-section>
          </q-item>
        </template>

        <template v-else-if="userProfile?.role === 'student'">
          <q-item-label
            header
            class="text-grey-6 text-uppercase q-mt-md q-ml-md"
            style="font-size: 10px; letter-spacing: 2px"
            >My Learning</q-item-label
          >
          <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm">
            <q-item-section avatar><q-icon name="school" color="cyan" /></q-item-section>
            <q-item-section>Enrolled Courses</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm">
            <q-item-section avatar><q-icon name="auto_graph" color="purple" /></q-item-section>
            <q-item-section>Progress Sync</q-item-section>
          </q-item>
        </template>

        <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm" to="/profile">
          <q-item-section avatar><q-icon name="person_outline" /></q-item-section>
          <q-item-section>My Identity</q-item-section>
        </q-item>

        <q-separator dark class="q-my-lg q-mx-lg opacity-05" />

        <q-item clickable v-ripple class="drawer-item q-mx-md q-mb-sm text-grey-5" to="/">
          <q-item-section avatar><q-icon name="public" /></q-item-section>
          <q-item-section>Public Portal</q-item-section>
        </q-item>
      </q-list>

      <div class="absolute-bottom q-pa-md text-center text-grey-7 text-caption">
        NEBULA CORE v2.6.0
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer v-if="!isAuthPage" class="bg-dark text-white q-pa-lg q-pa-md-xl">
      <div class="row q-col-gutter-xl justify-center">
        <div class="col-12 col-md-4">
          <div class="text-h6 text-gradient q-mb-md">Nebula</div>
          <p class="text-grey-5 leading-relaxed">
            Leading the digital transformation in education. Visualverse specializes in crafting
            high-performance, open-source solutions that empower educators and institutions
            worldwide.
          </p>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <div class="text-subtitle1 text-weight-bold q-mb-md text-primary">Contact Us</div>
          <div class="q-gutter-y-sm">
            <div class="row items-center text-grey-5 no-wrap">
              <q-icon name="mail" class="q-mr-sm" color="primary" />
              <a href="mailto:dnprog1@gmail.com" class="text-grey-5 text-decoration-none text-break"
                >dnprog1@gmail.com</a
              >
            </div>
            <div class="row items-center text-grey-5">
              <q-icon name="public" class="q-mr-sm" color="primary" />
              <span>Global Support</span>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <div class="text-subtitle1 text-weight-bold q-mb-md text-primary">Legal</div>
          <div class="q-gutter-y-sm">
            <div class="text-grey-5 cursor-pointer hover-text-white transition-03">
              Privacy Policy
            </div>
            <div class="text-grey-5 cursor-pointer hover-text-white transition-03">
              Terms of Service
            </div>
          </div>
        </div>
      </div>
      <q-separator dark class="q-my-xl" style="opacity: 0.05" />
      <div class="text-center text-grey-6 text-caption">
        © 2026 <span class="text-weight-bold text-grey-4">Visualverse</span>. All rights reserved.
        <br />
        Handcrafted for modern educators.
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const leftDrawerOpen = ref(false)
const currentUser = ref(null)
const userProfile = ref(null)
const notifications = ref([])
const unreadCount = computed(() => notifications.value.filter((n) => !n.is_read).length)
const isAuthPage = computed(() => ['/login', '/register'].includes(router.currentRoute.value.path))

async function fetchProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (!error) {
    userProfile.value = data
  }
}

async function fetchNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (!error) notifications.value = data
}

async function markAllRead() {
  if (unreadCount.value === 0) return
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', currentUser.value.id)

  if (!error) fetchNotifications()
}

function formatTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  currentUser.value = session?.user || null
  if (currentUser.value) {
    fetchProfile(currentUser.value.id)
    fetchNotifications()

    // Subscribe to new notifications
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.value.id}`,
        },
        () => {
          fetchNotifications()
          $q.notify({
            icon: 'notifications_active',
            message: 'New Intelligence Feed Received!',
            color: 'primary',
            position: 'bottom-right',
          })
        },
      )
      .subscribe()
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser.value = session?.user || null
    if (currentUser.value) {
      fetchProfile(currentUser.value.id)
      fetchNotifications()
    } else {
      userProfile.value = null
      notifications.value = []
    }
  })
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function scrollTo(id) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    leftDrawerOpen.value = false
  }
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    $q.notify({
      color: 'info',
      message: 'Securely logged out. See you soon!',
      icon: 'sync_alt',
    })
    router.push('/')
  }
}
</script>

<style lang="scss">
.text-break {
  word-break: break-all;
}
.bg-glass-dark {
  background: rgba(2, 6, 23, 0.45) !important;
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 20px;
  margin: 15px 20px;
  width: calc(100% - 40px);
  left: 50% !important;
  transform: translateX(-50%) !important;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
  z-index: 2000;

  &.q-header--hidden {
    transform: translateX(-50%) translateY(-200%) !important;
    opacity: 0;
  }
}

@media (max-width: 599px) {
  .bg-glass-dark {
    margin: 38px 12px 0 12px !important;
    width: calc(100% - 24px) !important;
    border-radius: 15px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  .brand-text {
    font-size: 1rem !important;
  }

  .brand-badge {
    font-size: 7px !important;
    padding: 1px 3px !important;
  }
}

.brand-text {
  font-size: 1.2rem;
  line-height: 1;
  letter-spacing: 1px;
}

.brand-badge {
  font-size: 8px;
  padding: 2px 4px;
}

.link-btn {
  opacity: 0.7;
  padding: 8px 16px !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  letter-spacing: 0.5px;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.08) !important;
    color: #00f2fe !important;
    transform: translateY(-1px);
  }
}

.nav-cta-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
  padding: 8px 24px !important;
  font-size: 0.85rem !important;
  border-radius: 12px !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(6, 182, 212, 0.4);
    filter: brightness(1.1);
  }
}
.bg-glass-drawer {
  background: rgba(2, 6, 23, 0.9) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-item {
  border-radius: 14px;
  transition: all 0.3s ease;
  color: #94a3b8;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  &.q-router-link--active {
    background: rgba(6, 182, 212, 0.1);
    color: #06b6d4;
    font-weight: bold;
    border: 1px solid rgba(6, 182, 212, 0.2);
  }
}

.border-glow-primary {
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
}

.line-height-1 {
  line-height: 1.2;
}

.bg-primary-05 {
  background: rgba(6, 182, 212, 0.05);
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
