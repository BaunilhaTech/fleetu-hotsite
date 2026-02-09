import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Lead {
    email: string
    role: string
    fleet_size: string
    created_at?: string
}

export async function saveLead(lead: Lead) {
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
