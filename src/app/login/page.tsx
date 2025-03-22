'use client'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

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
        <div className='flex flex-col items-center h-screen p-4'>
            <Button onClick={signInWithAzure} className='text-xl rounded-none p-6'>
                <Image src="/ms-logo.svg" alt="ErgScoreManager" width={25} height={25} />
                Sign in with Microsoft</Button>
        </div>


    )
}