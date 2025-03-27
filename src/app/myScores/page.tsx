import { createClient } from '@/utils/supabase/server';
import { Scores } from '@/lib/types/scores';
import { checkUserClient, getSignedInAthlete } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
import { MyScoreList } from '@/components/ScoreTables/MyScoreList';

export default async function MyScores() {
    const user = await checkUserClient()
    if ('error' in user) {
        redirect('/login')
    }
    const client = await createClient();

    const athleteData = await getSignedInAthlete()

    // Then use that ID to get all their scores/workouts
    if (athleteData && 'id' in athleteData) {
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

        </div>
    );
}
