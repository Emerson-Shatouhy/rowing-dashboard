import { createClient } from '@/utils/supabase/server';
import { Scores } from '@/lib/types/scores';
import { checkUserClient } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
import { MyScoreList } from '@/components/ScoreTables/MyScoreList';

export default async function MyScores() {
    const user = await checkUserClient()
    if ('error' in user) {
        redirect('/login')
    }
    const client = await createClient();

    // First, get the athlete's ID
    const { data: athleteData, error: athleteError } = await client
        .from('athletes')
        .select('id')
        .eq('firstName', 'Emerson')
        .eq('lastName', 'Shatouhy')
        .single();

    if (athleteError) {
        console.error('Error fetching athlete:', athleteError);
        return;
    }

    // Then use that ID to get all their scores/workouts
    if (athleteData) {
        const { data: scores, error: scoresError } = await client
            .from('scores')
            .select('*, type:type(*)')
            .eq('athlete', athleteData.id);

        if (scoresError) {
            console.error('Error fetching scores:', scoresError);
            return;
        }

        return (
            <div className="flex flex-col w-full gap-4 p-4">
                <h1 className="text-2xl font-bold">My Scores</h1>
                <MyScoreList scores={scores as Scores[]} />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-4 p-4">
            <h1 className="text-2xl font-bold">My Scores</h1>
            <p>No scores found.</p>

        </div>
    );
}
