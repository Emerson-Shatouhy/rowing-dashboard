import { checkCoxswain } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Athlete } from '@/lib/types/athlete';
import RosterDisplay from '@/components/Roster/RosterDisplay';

export default async function Roster() {
    const user = await checkCoxswain()
    if (!user) {
        redirect('/')
    }

    const supabase = await createClient();
    const { data: athletes, error } = await supabase
        .from('athletes')
        .select('*')
        .order('lastName', { ascending: true });

    if (error) {
        console.error('Error fetching athletes:', error);
        return <div className="p-4">Error loading roster data</div>;
    }

    return (
        <div className="flex flex-col w-full gap-4 p-4">
            <h1 className="text-2xl font-bold">Team Roster</h1>
            <RosterDisplay athletes={athletes as Athlete[]} />
        </div>
    );
}
