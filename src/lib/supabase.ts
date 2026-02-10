import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export interface Lead {
    email: string
    role: string
    fleet_size: string
    created_at?: string
}

export async function saveLead(lead: Lead) {
    if (!supabase) {
        throw new Error('Database connection not available')
    }

    const { error } = await supabase
        .from('leads')
        .upsert([lead], { onConflict: 'email', ignoreDuplicates: true })

    if (error) {
        console.error('Error saving lead:', error)
        throw error
    }
}
