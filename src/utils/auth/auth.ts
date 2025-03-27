import { Athlete } from "@/lib/types/athlete"
import { createClient } from "../supabase/server"

// Chekcs if the user is signed in via supabase
export async function checkUserClient() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
        console.error('Error getting user:', error)
        return { error }
    }
    return data
}

// Check if the user is a coxswain
export async function checkCoxswain() {
    const athlete = await getSignedInAthlete()
    if ('error' in athlete) {
        console.error('Failed to fetch athlete data:', athlete.error)
        return null
    }
    return athlete.coxswain
}

export async function getSignedInAthlete(): Promise<Athlete | { error: unknown }> {
    const supabase = await createClient()
    const user = await checkUserClient()
    if ('error' in user) {
        return { error: user.error }
    }
    const lastName = user.user.user_metadata.full_name.split(',')[0];
    const firstName = user.user.user_metadata.full_name.split(' ')[1];

    const { data: athleteData, error: athleteError } = await supabase
        .from('athletes')
        .select('*')
        .eq('firstName', firstName)
        .eq('lastName', lastName)
        .single();

    if (athleteError) {
        console.error('Error fetching athlete:', athleteError);
        return { error: athleteError }
    }
    return athleteData
}

