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
        console.error('Supabase client not initialized. Check environment variables.')
        throw new Error('Database connection not available')
    }

    const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()

    if (error) {
        console.error('Error saving lead:', error)
        throw error
    }

    return data
}
