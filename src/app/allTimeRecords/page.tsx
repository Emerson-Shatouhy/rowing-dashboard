import { createClient } from '@/utils/supabase/server';
import { checkUserClient } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
import { formatTime } from '@/utils/time/time';
import AllTimeRecordsClient from './AllTimeRecordsClient';
import { Type } from '@/lib/types/scores';

export default async function AllTimeRecords() {
    // Check if user is logged in
    const user = await checkUserClient();
    if ('error' in user) {
        redirect('/login');
    }

    const supabase = await createClient();

    // Fetch all workout types
    const { data: types, error: typesError } = await supabase
        .from('types')
        .select('*');

    if (typesError) {
        console.error('Error fetching workout types:', typesError);
        return <div>Error fetching workout types</div>;
    }

    // For each workout type, fetch the best score for each athlete
    const allRecords: Record<number, any[]> = {};

    for (const type of types as Type[]) {
        // This query gets the fastest time for each athlete for this workout type
        // Filter out any NULL or 0 times (DNFs)
        const { data: records, error: recordsError } = await supabase
            .from('scores')
            .select(`
                id,
                athlete:athlete(id, firstName, lastName),
                totalTime,
                weightAdjusted,
                date,
                weight,
                averageWatts,
                spm
            `)
            .eq('type', type.id)
            .not('totalTime', 'is', null)
            .gt('totalTime', 0)
            .order('totalTime', { ascending: true });

        if (recordsError) {
            console.error(`Error fetching records for ${type.name}:`, recordsError);
            continue;
        }

        // Process records to get best time per athlete
        const bestPerAthlete = new Map();

        records?.forEach(record => {
            const athleteId = record.athlete?.id;
            // Skip if athlete ID is missing or if time is null/zero (DNF)
            if (!athleteId || !record.totalTime) return;

            if (!bestPerAthlete.has(athleteId) ||
                record.totalTime < bestPerAthlete.get(athleteId).totalTime) {
                bestPerAthlete.set(athleteId, record);
            }
        });

        // Convert map to array and sort by time
        const bestRecords = Array.from(bestPerAthlete.values())
            .sort((a, b) => a.totalTime - b.totalTime);

        allRecords[type.id] = bestRecords;
    }

    return (
        <div className="flex flex-col w-full gap-4 p-4">
            <h1 className="text-2xl font-bold">All-Time Records</h1>
            <AllTimeRecordsClient types={types as Type[]} records={allRecords} />
        </div>
    );
}
