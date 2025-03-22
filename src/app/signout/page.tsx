'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SignoutPage() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const performLogout = async () => {
            try {
                const { error } = await supabase.auth.signOut()
                if (error) {
                    console.error('Error logging out:', error)
                    return
                }
                router.push('/login')
                router.refresh()
            } catch (error) {
                console.error('Unexpected error during logout:', error)
            }
        }

        performLogout()
    }, [router, supabase])

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <p>Logging out...</p>
            </div>
        </div>
    )
}