import { createClient } from '@supabase/supabase-js'
import { boot } from 'quasar/wrappers'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Nebula Core Critical Error: Supabase credentials missing!')
  console.warn(
    'Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.',
  )
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export default boot(({ app }) => {
  if (supabase) {
    app.config.globalProperties.$supabase = supabase
  }
})

export { supabase }
