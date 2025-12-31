<template>
  <q-page class="q-pa-lg dashboard-page">
    <div class="mesh-bg"></div>

    <!-- Global Loading Guard -->
    <div v-if="loading && (!userProfile && !allUsers.length)" class="flex flex-center column" style="min-height: 70vh;">
      <q-spinner-orbit color="primary" size="80px" />
      <div class="text-h6 text-primary q-mt-md">Synchronizing Galaxy Hub...</div>
    </div>

    <!-- Main Content Logic -->
    <template v-else>
      <!-- Case 1: Not Approved & Not Admin -->
      <div v-if="userProfile && !userProfile.is_approved && userProfile.role !== 'admin'" class="row justify-center items-center panorama-pending animate-fade-in">
        <div class="col-12 col-md-8 col-lg-6">
          <q-card class="bg-glass-ultra text-white border-glow-premium q-pa-xl text-center shadow-24">
            <q-card-section>
              <div class="pending-icon-wrap q-mb-xl">
                <q-icon name="hub" size="100px" color="primary" class="animate-pulse-slow" />
                <div class="icon-glow"></div>
              </div>

              <div class="text-h3 text-weight-bolder text-white q-mb-md brand-text-pending">CLEARANCE <span class="text-gradient">PENDING</span></div>
              <div class="separator-dots q-mb-lg"><span></span><span></span><span></span></div>

              <p class="text-h6 text-grey-4 q-mb-xl opacity-08 font-light">
                Your identity has been recorded in the Nebula core. <br>
                <span class="text-primary text-weight-bold">High Commander Authorization</span> is required for galactic sector access.
              </p>

              <div class="row justify-center q-gutter-md">
                <q-btn unelevated color="primary" label="Verify Status" icon="sync" @click="fetchData" :loading="loading" class="btn-premium q-px-xl q-py-md rounded-borders-16" />
              </div>
            </q-card-section>
          </q-card>

          <div class="text-center q-mt-xl">
             <q-badge color="primary-10" text-color="primary" class="q-pa-sm border-glow-subtle" v-if="user">Nebula Core ID: {{ user.id.split('-')[0] }}</q-badge>
          </div>
        </div>
      </div>

      <!-- Case 2: Approved or Admin (Show Dashboard) -->
      <div v-else class="animate-fade-in content-rendered">
        <!-- Header Section -->
        <div class="row items-center justify-between q-mb-xl">
          <div>
            <h1 class="text-h3 text-weight-bolder text-white q-mt-none q-mb-xs">Command <span class="text-gradient">Center</span></h1>
            <p class="text-grey-5">Welcome back, {{ userProfile?.full_name || 'Commander' }}. Galactic status is operational.</p>
          </div>
          <div class="row q-gutter-md">
            <q-btn v-if="userProfile?.role === 'admin'" unelevated color="primary" icon="add" label="New Enrollment" class="btn-premium q-px-md" @click="showEnrollModal = true" />
            <q-btn outline color="white" icon="download" label="Export Logs" class="btn-modern glass-btn q-px-md" @click="exportLogs" />
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="row q-col-gutter-lg q-mb-xl">
          <div v-for="(stat, index) in stats" :key="index" class="col-12 col-sm-6 col-md-3 animate-fade-up" :style="{ animationDelay: (index * 0.1) + 's' }">
            <q-card class="card-advanced q-pa-md height-100 shadow-glow-primary-hover">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <q-icon :name="stat.icon" :color="stat.color" size="32px" class="bg-glass-icon q-pa-sm rounded-borders-12" />
                  <q-badge v-if="stat.trend" :color="stat.trend > 0 ? 'positive' : 'negative'" outline class="q-pa-xs">
                    {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                  </q-badge>
                </div>
                <div class="text-h4 text-weight-bolder text-white q-my-sm">{{ stat.value }}</div>
                <div class="text-caption text-grey-5 text-uppercase letter-spacing-1">{{ stat.label }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Admin Control Panel -->
          <template v-if="userProfile?.role === 'admin'">
            <div v-if="pendingUsers.length > 0" class="col-12 animate-fade-up" style="animation-delay: 0.2s">
              <q-card class="card-advanced q-pa-none overflow-hidden q-mb-xl shadow-glow-primary">
                <q-card-section class="row items-center justify-between q-px-lg q-py-md border-bottom-subtle bg-primary-dark-opacity">
                  <div class="text-h6 text-weight-bold text-white row items-center">
                    <q-icon name="admin_panel_settings" color="primary" class="q-mr-sm" size="sm" />
                    Fleet Access Approvals
                    <q-badge color="negative" class="q-ml-md pulse-badge">{{ pendingUsers.length }} Pending</q-badge>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-none">
                  <q-table :rows="pendingUsers" :columns="approvalColumns" dark flat class="bg-transparent" :loading="loading">
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props" class="q-gutter-x-sm">
                        <q-btn unelevated color="positive" icon="verified" size="sm" label="Authorize" class="btn-modern rounded-borders-12" @click="approveUser(props.row.id)" />
                        <q-btn outline color="negative" icon="block" size="sm" label="Decline" class="btn-modern rounded-borders-12" @click="rejectUser(props.row.id)" />
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 animate-fade-up" style="animation-delay: 0.3s">
              <q-card class="card-advanced q-pa-none overflow-hidden q-mb-xl">
                <q-card-section class="row items-center justify-between q-px-lg q-py-md border-bottom-subtle">
                  <div class="text-h6 text-weight-bold text-white">Personnel Manifest</div>
                  <q-btn flat dense no-caps icon="sync" @click="fetchUsers" color="primary" label="Recalibrate" class="btn-modern q-px-sm" />
                </q-card-section>
                <q-card-section class="q-pa-none">
                  <q-table :rows="approvedUsers" :columns="userColumns" dark flat class="bg-transparent" :rows-per-page-options="[10, 20, 50, 0]">
                    <template v-slot:body-cell-role="props">
                      <q-td :props="props">
                        <q-select v-model="props.row.role" :options="['admin', 'teacher', 'student']" dense dark outlined class="role-select-glass" @update:model-value="(val) => updateRole(props.row.id, val)" />
                      </q-td>
                    </template>
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props" class="text-right">
                        <q-btn v-if="props.row.id !== user.id" flat round color="negative" icon="delete_sweep" size="sm" @click="deleteUser(props.row)">
                          <q-tooltip>Purge Personnel Data</q-tooltip>
                        </q-btn>
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 animate-fade-up" style="animation-delay: 0.4s">
              <q-card class="card-advanced q-pa-none overflow-hidden q-mb-xl">
                <q-card-section class="row items-center justify-between q-px-lg q-py-md border-bottom-subtle">
                  <div class="text-h6 text-weight-bold text-white">Academic Sector Hub</div>
                  <q-btn unelevated color="primary" label="Initialize Sector" icon="add" @click="showClassModal = true" class="btn-premium" />
                </q-card-section>
                <q-card-section class="q-pa-none">
                  <q-table :rows="allClasses" :columns="classColumns" dark flat class="bg-transparent" :loading="loading">
                    <template v-slot:no-data>
                      <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-lg">
                        <q-icon size="2em" name="rocket_launch" />
                        <span>No sectors identified in this quadrant.</span>
                      </div>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>
          </template>

          <!-- Teacher View -->
          <template v-else-if="userProfile?.role === 'teacher'">
             <div class="col-12 animate-fade-up">
              <q-card class="card-advanced q-pa-none overflow-hidden q-mb-xl">
                <q-card-section class="q-px-lg q-py-md border-bottom-subtle">
                  <div class="text-h6 text-weight-bold text-white">Academic Assignments</div>
                </q-card-section>
                <q-card-section class="q-pa-lg row q-col-gutter-lg">
                  <div v-for="cls in allClasses" :key="cls.id" class="col-12 col-sm-6 col-md-4">
                    <q-card class="glass-btn-dashboard q-pa-lg border-glow-premium hover-scale">
                      <div class="text-h6 text-primary text-weight-bold q-mb-xs">{{ cls.name }}</div>
                      <div class="text-caption text-grey-5 q-mb-lg" style="min-height: 40px">{{ cls.description || 'No mission briefing available.' }}</div>
                      <q-btn flat no-caps label="Sync Attendance" icon="fact_check" color="cyan" class="full-width rounded-borders-12" @click="markAttendance(cls.name)" />
                    </q-card>
                  </div>
                  <div v-if="allClasses.length === 0" class="col-12 text-center text-grey-6 q-pa-xl">
                    <q-icon name="upcoming" size="64px" class="q-mb-md opacity-03" />
                    <div>No sectors assigned to your command.</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>

          <!-- Student View -->
          <template v-else-if="userProfile?.role === 'student'">
            <div class="col-12 animate-fade-up">
              <q-card class="card-advanced q-pa-none overflow-hidden q-mb-xl">
                <q-card-section class="q-px-lg q-py-md border-bottom-subtle">
                  <div class="text-h6 text-weight-bold text-white">Coordinate Records (Enrollments)</div>
                </q-card-section>
                <q-card-section class="q-pa-none">
                  <q-table :rows="myEnrollments" :columns="enrollmentColumns" dark flat class="bg-transparent" :loading="loading">
                    <template v-slot:no-data>
                      <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-xl">
                        <q-icon size="3em" name="rocket" class="opacity-05" />
                        <div class="text-h6">Your mission log is empty.</div>
                      </div>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>
          </template>

          <!-- Core System Logs (Universal) -->
          <div class="col-12 col-md-8 animate-fade-up" style="animation-delay: 0.5s">
            <q-card class="card-advanced q-pa-none overflow-hidden shadow-24">
              <q-card-section class="row items-center justify-between q-px-lg q-py-md border-bottom-subtle bg-glass-dark">
                <div class="text-subtitle1 text-weight-bold text-white row items-center">
                   <q-icon name="list_alt" color="primary" class="q-mr-sm" />
                   Galactic Activity Log
                </div>
              </q-card-section>
              <q-card-section class="q-pa-none">
                <q-list dark separator>
                  <q-item v-for="(activity, index) in activities" :key="index" class="q-py-lg q-px-lg item-hover-glass transition-03">
                    <q-item-section avatar><q-avatar :color="activity.color + '-2'" :text-color="activity.color" size="44px"><q-icon :name="activity.icon" /></q-avatar></q-item-section>
                    <q-item-section><q-item-label class="text-weight-bold text-white">{{ activity.title }}</q-item-label><q-item-label caption class="text-grey-5">{{ activity.subtitle }}</q-item-label></q-item-section>
                    <q-item-section side><q-item-label caption class="text-grey-6 text-weight-bold">{{ activity.time }}</q-item-label></q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4 animate-fade-up" style="animation-delay: 0.5s">
            <q-card class="card-advanced q-pa-md height-100 shadow-24">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold text-white q-mb-xl row items-center">
                  <q-icon name="bolt" color="orange" class="q-mr-sm" />
                  Nexus Diagnostics
                </div>
                <div class="q-gutter-y-xl">
                  <div v-for="(system, index) in systemStatus" :key="index">
                    <div class="row justify-between q-mb-sm">
                      <div class="text-caption text-grey-4 text-weight-bolder text-uppercase letter-spacing-1">{{ system.label }}</div>
                      <div class="text-caption text-primary text-weight-bold">{{ system.value }}%</div>
                    </div>
                    <q-linear-progress :value="system.value / 100" color="primary" class="rounded-borders-10 bg-glass-dark shadow-glow-primary-subtle" height="10px" />
                  </div>
                </div>
                <q-separator dark class="q-my-xl opacity-05" />
                <div class="text-subtitle2 text-weight-bold text-grey-6 q-mb-md text-center">SYSTEM CONSOLE</div>
                <q-btn class="full-width glass-btn-dashboard q-pa-lg btn-premium-border" stack flat no-caps @click="fetchData" :loading="loading">
                  <q-icon name="sync" color="cyan" size="28px" class="q-mb-sm" />
                  <div class="text-caption text-weight-bold">Initiate Core Re-Sync</div>
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </template>

    <!-- Modals -->
    <q-dialog v-model="showClassModal" backdrop-filter="blur(10px)">
      <q-card class="bg-glass-ultra text-white border-glow-premium q-pa-lg" style="min-width: 450px; border-radius: 28px">
        <q-card-section class="q-pb-none">
          <div class="text-h5 text-weight-bolder text-gradient">Initialize Fleet</div>
          <div class="text-caption text-grey-5">Deploy a new educational sector to the galaxy.</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-lg q-pt-xl">
          <div class="auth-input-group">
            <span class="input-label">Sector Name (Class)</span>
            <q-input v-model="newClass.name" placeholder="e.g. Advanced Astrophysics" dark outlined dense class="premium-input-glass" />
          </div>

          <div class="auth-input-group">
            <span class="input-label">Mission Briefing (Description)</span>
            <q-input v-model="newClass.description" placeholder="Sector objectives and parameters..." dark outlined type="textarea" class="premium-input-glass" />
          </div>

          <div class="auth-input-group">
            <span class="input-label">Assign Commander (Teacher)</span>
            <q-select v-model="newClass.teacher_id" :options="teacherOptions" placeholder="Select lead explorer" dark outlined dense emit-value map-options class="premium-input-glass" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pt-lg">
          <q-btn flat label="Abort Mission" color="grey-5" v-close-popup no-caps />
          <q-btn unelevated label="Deploy Sector" color="primary" @click="createClass" :loading="loading" class="btn-modern q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEnrollModal" backdrop-filter="blur(10px)">
      <q-card class="bg-glass-ultra text-white border-glow-premium q-pa-lg" style="min-width: 450px; border-radius: 28px">
        <q-card-section class="q-pb-none">
          <div class="text-h5 text-weight-bolder text-gradient">Synchronize Personnel</div>
          <div class="text-caption text-grey-5">Link a student to a specific galactic coordinate.</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-lg q-pt-xl">
          <div class="auth-input-group">
            <span class="input-label">Select Explorer (Student)</span>
            <q-select v-model="enrollData.student_id" :options="studentOptions" placeholder="Choose identity" dark outlined dense emit-value map-options class="premium-input-glass" />
          </div>

          <div class="auth-input-group">
            <span class="input-label">Target Coordinate (Class)</span>
            <q-select v-model="enrollData.class_id" :options="classOptions" placeholder="Select destination" dark outlined dense emit-value map-options class="premium-input-glass" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pt-lg">
          <q-btn flat label="Decline" color="grey-5" v-close-popup no-caps />
          <q-btn unelevated label="Establish Sync" color="primary" @click="enrollStudent" :loading="loading" class="btn-modern q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'DashboardPage'
})

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const user = ref(null)
const userProfile = ref(null)
const allUsers = ref([])
const allClasses = ref([])
const myEnrollments = ref([])
const loading = ref(false)
const showClassModal = ref(false)
const showEnrollModal = ref(false)

const newClass = ref({ name: '', description: '', teacher_id: null })
const enrollData = ref({ student_id: null, class_id: null })

async function fetchData() {
  if (!user.value) return
  loading.value = true
  try {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
    if (profile) {
      userProfile.value = profile
    }

    await fetchUsers()
    await fetchClasses()

    // For counts in stats
    if (role.value === 'student' || role.value === 'teacher') {
      await fetchEnrollments()
    }
  } catch (e) {
    console.error('Fetch Error:', e)
  }
  loading.value = false
}

// Real-time subscription for profile changes (Auto-approval sync)
let profileSubscription = null
function subscribeToProfile() {
  if (!user.value || profileSubscription) return

  // Unique channel per user
  const channelName = `profile-sync-${user.value.id}`

  profileSubscription = supabase
    .channel(channelName)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${user.value.id}`
    }, (payload) => {
      console.log('Real-time Profile Update:', payload.new)
      userProfile.value = payload.new

      if (payload.new.is_approved) {
        $q.notify({
          color: 'positive',
          message: 'Clearance Granted. Welcome to the Nebula Fleet Command.',
          icon: 'verified',
          position: 'top',
          timeout: 4000
        })
        fetchData() // Refresh everything now that the user has access
      }
    })
    .subscribe((status) => {
      console.log(`Real-time subscription status for ${channelName}:`, status)
    })
}

function exportLogs() {
  $q.notify({ color: 'info', message: 'Generating system logs for export...', icon: 'cloud_download' })
}

function markAttendance(className) {
  $q.notify({ color: 'cyan', message: `Attendance session opened for ${className}`, icon: 'how_to_reg' })
}

async function fetchUsers() {
  const { data, error } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false })
  if (!error) allUsers.value = data
}

async function fetchClasses() {
  let query = supabase.from('classes').select(`*, profiles(full_name)`)
  if (role.value === 'teacher') query = query.eq('teacher_id', user.value.id)
  const { data, error } = await query
  if (!error) allClasses.value = data
}

async function fetchEnrollments() {
  const { data, error } = await supabase.from('enrollments').select(`*, classes(*, profiles(full_name))`).eq('student_id', user.value.id)
  if (!error) myEnrollments.value = data
}

async function createClass() {
  if (!newClass.value.name) return
  loading.value = true
  const { error } = await supabase.from('classes').insert([newClass.value])
  if (!error) {
    showClassModal.value = false
    newClass.value = { name: '', description: '', teacher_id: null }
    await fetchData() // Refresh everything
    $q.notify({
      color: 'positive',
      message: 'New Class Deployed Successfully!',
      icon: 'rocket_launch',
      badgeStyle: 'background-color: #06b6d4'
    })
  } else {
    $q.notify({ color: 'negative', message: 'Deployment failed: ' + error.message })
  }
  loading.value = false
}

async function enrollStudent() {
  loading.value = true
  const { error } = await supabase.from('enrollments').insert([enrollData.value])
  if (!error) {
    showEnrollModal.value = false
    fetchData()
    $q.notify({ color: 'positive', message: 'Student synchronized with class fleet!' })
  } else {
     $q.notify({ color: 'negative', message: 'Enrollment failed: ' + error.message })
  }
  loading.value = false
}

async function updateRole(userId, newRole) {
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
  if (!error) {
    $q.notify({ color: 'positive', message: 'Role updated successfully', icon: 'verified' })
    await fetchUsers()
  }
}

async function deleteUser(userItem) {
  $q.dialog({
    title: 'Purge Personnel Data',
    message: `Are you sure you want to permanently remove ${userItem.full_name} from the system? This action cannot be undone.`,
    dark: true,
    cancel: { flat: true, color: 'grey-5', label: 'Abort' },
    ok: { unelevated: true, color: 'negative', label: 'Confirm Purge' }
  }).onOk(async () => {
    loading.value = true
    const { error } = await supabase.from('profiles').delete().eq('id', userItem.id)
    if (!error) {
      $q.notify({
        color: 'warning',
        message: 'Personnel record removed from the galaxy.',
        icon: 'delete_forever'
      })
      await fetchData()
    } else {
      $q.notify({ color: 'negative', message: 'Purge failed: ' + error.message })
    }
    loading.value = false
  })
}

async function approveUser(userId) {
  loading.value = true
  const { error } = await supabase.from('profiles').update({ is_approved: true }).eq('id', userId)
  if (!error) {
    $q.notify({ color: 'positive', message: 'User authorized for galaxy operations!', icon: 'security' })
    fetchData()
  }
  loading.value = false
}

async function rejectUser(userId) {
  const userItem = allUsers.value.find(u => u.id === userId)
  $q.dialog({
    title: 'Decline Access Request',
    message: `Are you sure you want to deny access to ${userItem?.full_name || 'this user'} and purge the request?`,
    dark: true,
    cancel: { flat: true, color: 'grey-5', label: 'Abort' },
    ok: { unelevated: true, color: 'negative', label: 'Confirm Rejection' }
  }).onOk(async () => {
    loading.value = true
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (!error) {
      $q.notify({
        color: 'warning',
        message: 'Access request purged from the nebula.',
        icon: 'block'
      })
      await fetchData()
    } else {
      $q.notify({ color: 'negative', message: 'Operation failed: ' + error.message })
    }
    loading.value = false
  })
}

const pendingUsers = computed(() => allUsers.value.filter(u => !u.is_approved))
const approvedUsers = computed(() => allUsers.value.filter(u => u.is_approved))

const approvalColumns = [
  { name: 'full_name', label: 'IDENTITY', field: 'full_name', align: 'left' },
  { name: 'role', label: 'REQUESTED ROLE', field: 'role', align: 'left' },
  { name: 'actions', label: 'AUTHORIZATION', align: 'right' }
]

const userColumns = [
  { name: 'full_name', label: 'NAME', field: 'full_name', align: 'left', sortable: true },
  { name: 'role', label: 'ROLE', field: 'role', align: 'left', sortable: true },
  { name: 'updated_at', label: 'LAST SYNC', field: row => new Date(row.updated_at).toLocaleDateString(), align: 'center' },
  { name: 'actions', label: '', align: 'right' }
]

const classColumns = [
  { name: 'name', label: 'CLASS NAME', field: 'name', align: 'left' },
  { name: 'teacher', label: 'ASSIGNED TEACHER', field: row => row.profiles?.full_name || 'Unassigned', align: 'left' },
  { name: 'created_at', label: 'DEPLOYED', field: row => new Date(row.created_at).toLocaleDateString(), align: 'right' }
]

const enrollmentColumns = [
  { name: 'class', label: 'COURSE', field: row => row.classes?.name, align: 'left' },
  { name: 'teacher', label: 'TEACHER', field: row => row.classes?.profiles?.full_name, align: 'left' },
  { name: 'date', label: 'ENROLLED ON', field: row => new Date(row.enrolled_at).toLocaleDateString(), align: 'right' }
]

const teacherOptions = computed(() => allUsers.value.filter(u => u.role === 'teacher').map(u => ({ label: u.full_name, value: u.id })))
const studentOptions = computed(() => allUsers.value.filter(u => u.role === 'student').map(u => ({ label: u.full_name, value: u.id })))
const classOptions = computed(() => allClasses.value.map(c => ({ label: c.name, value: c.id })))

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null
  if (user.value) {
    await fetchData()
    subscribeToProfile()
  }
})

onUnmounted(() => {
  if (profileSubscription) {
    supabase.removeChannel(profileSubscription)
  }
})

const role = computed(() => userProfile.value?.role || 'student')
// Stats and other computed properties stay similarly dynamic

const stats = computed(() => {
  if (role.value === 'admin') {
    return [
      { label: 'Total Explorers', value: allUsers.value.length.toString(), icon: 'people', color: 'primary', trend: 12 },
      { label: 'Deployed Zones', value: allClasses.value.length.toString(), icon: 'rocket_launch', color: 'cyan', trend: 5 },
      { label: 'Live Core', value: 'Optimal', icon: 'shutter_speed', color: 'purple', trend: 0 },
      { label: 'Quantum Sync', value: '100%', icon: 'bolt', color: 'orange', trend: 0 }
    ]
  } else if (role.value === 'teacher') {
    const activeClasses = allClasses.value.length
    return [
      { label: 'Active Classes', value: activeClasses.toString(), icon: 'class', color: 'cyan', trend: 0 },
      { label: 'Assigned Missions', value: activeClasses > 0 ? 'High' : 'None', icon: 'assignment', color: 'primary', trend: 0 },
      { label: 'Academic Reach', value: 'Global', icon: 'public', color: 'purple', trend: 0 },
      { label: 'Sync Status', value: 'Online', icon: 'wifi_tethering', color: 'orange', trend: 0 }
    ]
  } else {
    const subjectsCount = myEnrollments.value.length
    return [
      { label: 'My Subjects', value: subjectsCount.toString(), icon: 'book', color: 'primary', trend: 0 },
      { label: 'Progress Rate', value: subjectsCount > 0 ? '75%' : '0%', icon: 'trending_up', color: 'cyan', trend: 0 },
      { label: 'Nebula Rank', value: subjectsCount > 0 ? 'Cadet' : 'Guest', icon: 'workspace_premium', color: 'purple', trend: 0 },
      { label: 'Sync Level', value: 'Stable', icon: 'track_changes', color: 'orange', trend: 0 }
    ]
  }
})

const activities = computed(() => {
  if (allClasses.value.length > 0) {
    return allClasses.value.slice(0, 3).map(c => ({
      title: 'Course Module Deployed',
      subtitle: `${c.name} is now live in the system`,
      time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: 'rocket_launch',
      color: 'cyan'
    })).concat([
      { title: 'Nebula Core Active', subtitle: 'Global synchronization established.', time: 'System', icon: 'auto_awesome', color: 'primary' }
    ])
  }
  return [
    { title: 'System Initialized', subtitle: 'Nebula Galaxy IQ is online. No recent sector movements.', time: 'Just now', icon: 'verified_user', color: 'primary' }
  ]
})

const systemStatus = computed(() => {
  return [
    { label: 'Real-time Sync', value: 100 },
    { label: 'Supabase Connectivity', value: 100 },
    { label: 'Encrypted Core', value: 100 }
  ]
})
</script>

<style lang="scss" scoped>
.panorama-pending {
  min-height: 80vh;
}

.brand-text-pending {
  letter-spacing: 8px;
}

.pending-icon-wrap {
  position: relative;
  display: inline-block;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
  filter: blur(20px);
  z-index: -1;
}

.separator-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  span {
    width: 6px;
    height: 6px;
    background: rgba(6, 182, 212, 0.4);
    border-radius: 50%;
  }
}

.animate-pulse-slow {
  animation: pulse 4s infinite ease-in-out;
}

.opacity-08 {
  opacity: 0.8;
}

.border-glow-subtle {
  border: 1px solid rgba(6, 182, 212, 0.2);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
}

.mesh-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 40%);
  z-index: -1;
}

.shadow-glow-primary {
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);
}

.bg-primary-dark-opacity {
  background: rgba(6, 182, 212, 0.08);
}

.pulse-badge {
  animation: pulse-simple 2s infinite;
}

@keyframes pulse-simple {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.role-select-glass {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  .q-field__native { color: white !important; }
}

.shadow-glow-primary-hover:hover {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.2);
}

.shadow-glow-primary-subtle {
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.1);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.opacity-03 { opacity: 0.3; }

.btn-premium-border {
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.content-rendered {
  min-height: 100vh;
}

.dashboard-page {
  min-height: calc(100vh - 64px);
  z-index: 1;
}

.bg-glass-icon {
  background: rgba(255, 255, 255, 0.05);
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.height-100 {
  height: 100%;
}

.item-hover-glass:hover {
  background: rgba(255, 255, 255, 0.03);
}

.glass-btn-dashboard {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(6, 182, 212, 0.3);
    transform: translateY(-2px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  opacity: 0;
  animation: fadeUp 0.6s ease-out forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.opacity-05 {
  opacity: 0.05;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}
</style>
