import { createClient } from '@/utils/supabase/client';
import { parseTimeToMilliseconds } from '@/utils/time/time';

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
    console.log('Processing CSV data for test date:', testDate);

    // Check to see if the test date already exists in the database
    const { data: existingScores, error: checkError } = await client
        .from('scores')
        .select('*')
        .eq('date', testDate.toISOString());
    if (checkError) {
        console.error('Error checking for existing scores:', checkError);
        return;
    }
    if (existingScores && existingScores.length > 0) {
        console.log('Scores already exist for this date. Skipping processing.');
        return;
    }

    for (const row of csvData) {
        try {
            console.log('Processing row:', row);

            // If the row is empty, skip it
            if (!row['Last Name'] && !row['First Name']) {
                console.log('Skipping empty row:', row);
                continue;
            }

            // Search for existing athlete
            const { data: athletes, error: searchError } = await client
                .from('athletes')
                .select('*')
                .eq('lastName', row['Last Name'])
                .eq('firstName', row['First Name']);

            if (searchError) {
                console.error('Error searching for athlete:', searchError);
                continue;
            }

            let athleteId;
            if (athletes && athletes.length > 0) {
                athleteId = athletes[0].id;
                console.log('Found existing athlete with ID:', athleteId);
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
                console.log('New athlete data:', newAthleteData);

                if (createError || !newAthlete) {
                    console.error('Error creating new athlete:', createError);
                    continue;
                }

                athleteId = newAthlete.id;
                console.log('Created new athlete with ID:', athleteId);

                if (!athleteId) {
                    console.error('Athlete ID is missing after creation.');
                    continue;
                }
            }

            const scoreData = {
                athlete: athleteId,
                date: testDate.toISOString(),
                type: 1,
                totalTime: parseTimeToMilliseconds(row['Time']),
                splits: [
                    parseTimeToMilliseconds(row['1st 500']),
                    parseTimeToMilliseconds(row['2nd 500']),
                    parseTimeToMilliseconds(row['3rd 500']),
                    parseTimeToMilliseconds(row['4th 500'])
                ],
                spm: parseInt(row['SPM']),
                averageWatts: parseFloat(row['Avg Watt']),
                weight: parseFloat(row['Weight']),
                weightAdjusted: parseTimeToMilliseconds(row['Weight Adjusted Time'])
            };

            const { error: insertError } = await client
                .from('scores')
                .insert(scoreData)
                .select()
                .single();

            if (insertError) {
                console.error('Error inserting score data:', insertError);
                continue;
            }

            console.log('Successfully inserted score data:', scoreData);

        } catch (error) {
            console.error('Error processing row:', error);
            continue;
        }
    }
    console.log('Finished processing CSV data.');
}
