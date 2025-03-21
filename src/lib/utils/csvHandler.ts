import { createClient } from '@/utils/supabase/client';

interface CsvRow {
    'Last Name': string;
    'First Name': string;
    'Time': string;
    'Weight Adjusted Time': string;
    'Avg Split': string;
    'Goal': string;
    'Avg Watt': string;
    'SPM': string;
    'Weight': string;
    '1st 500': string;
    '2nd 500': string;
    '3rd 500': string;
    '4th 500': string;
}

export async function processCSVData(csvData: CsvRow[], testDate: Date) {
    const client = await createClient();

    for (const row of csvData) {
        try {
            // If the row is empty, skip it
            if (!row['Last Name'] && !row['First Name']) {
                continue;
            }
            // Search for existing athlete
            const { data: athletes, error: searchError } = await client
                .from('athletes')
                .select('*')
                .eq('lastName', row['Last Name'])
                .eq('firstName', row['First Name']);

            if (searchError) {
                continue;
            }

            let athleteId;
            if (athletes && athletes.length > 0) {
                athleteId = athletes[0].id;
            } else {
                const newAthleteData = {
                    firstName: row['First Name'],
                    lastName: row['Last Name'],
                    coxswain: false,
                    personalRecords: ''
                };

                const { data: newAthlete, error: createError } = await client
                    .from('athletes')
                    .insert(newAthleteData)
                    .select()
                    .single();

                if (createError || !newAthlete) {
                    continue;
                }

                athleteId = newAthlete.id;

                if (!athleteId) {
                    continue;
                }
            }

            const scoreData = {
                athlete: athleteId,
                date: testDate.toISOString(),
                type: 1,
                totalTime: parseTimeToSeconds(row['Time']),
                splits: [
                    parseTimeToSeconds(row['1st 500']),
                    parseTimeToSeconds(row['2nd 500']),
                    parseTimeToSeconds(row['3rd 500']),
                    parseTimeToSeconds(row['4th 500'])
                ],
                spm: parseInt(row['SPM']),
                averageWatts: parseFloat(row['Avg Watt']),
                weight: parseFloat(row['Weight']),
                weightAdjusted: parseTimeToSeconds(row['Weight Adjusted Time'])
            };

            await client
                .from('scores')
                .insert(scoreData)
                .select()
                .single();

        } catch (error) {
            continue;
        }
    }
}

function parseTimeToSeconds(timeStr: string): number {
    const [minutes, secondsWithDecimal] = timeStr.split(':');
    const seconds = parseFloat(secondsWithDecimal || '0');
    // Convert to milliseconds: (minutes * 60 + seconds) * 1000
    return Math.round((parseInt(minutes || '0') * 60 + seconds) * 1000);
}
