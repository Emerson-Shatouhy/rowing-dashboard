'use client'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
    const supabase = createClient();
    async function signInWithAzure() {
        const { } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                scopes: 'email profile openid User.Read Directory.Read.All User.ReadBasic.All',
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }
    return (
        <Button onClick={signInWithAzure}>Sign in with Azure</Button>

    )
}