'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone_number') as string

  // Upsert the profiles table (Update if exists, Insert if missing)
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id, // Must include primary key for upsert
      full_name: fullName,
      phone_number: phone,
      email: user.email, // Best practice to sync email
      role: 'customer',
    })

  if (error) {
    return { error: error.message }
  }

  // Revalidate the account page so it fetches fresh data
  revalidatePath('/account')
  
  return { success: true }
}
