'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Pass the exact error message from Supabase (e.g., "Invalid login credentials")
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  // Standard customers go to home, admins could go to /admin if we added role checks
  redirect('/') 
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    phone: formData.get('mobile') as string,
    full_name: formData.get('full_name') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        phone_number: data.phone,
        full_name: data.full_name,
      }
    }
  })

  if (error) {
    // E.g. "Password should be at least 6 characters" or "User already registered"
    return redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  // Insert into profiles table immediately after signup
  if (authData.user) {
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email: data.email,
      phone_number: data.phone,
      full_name: data.full_name,
      role: 'customer', // Default to standard customer role
    })
  }

  revalidatePath('/', 'layout')
  
  // If email confirmation is enabled, session won't be established yet
  if (authData.session === null) {
    redirect('/login?message=Please check your email to verify your account.')
  } else {
    // If auto-confirm is enabled in Supabase, log them in immediately
    redirect('/')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
