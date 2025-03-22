import { createClient } from "../supabase/server"

// Chekcs if the user is signed in via supabase
export async function checkUserClient() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
        return { error }
    }
    return data
}

