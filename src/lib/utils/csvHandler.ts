import { createClient } from '@/utils/supabase/client';
import { parseTimeToMilliseconds } from '@/utils/time/time';
import { parseAthleteNameAndMachine } from '@/utils/athlete/athlete';

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
    // 2k splits
    '1st 500'?: string;
    '2nd 500'?: string;
    '3rd 500'?: string;
    '4th 500'?: string;
    // 5k splits
    '1st 1000'?: string;
    '2nd 1000'?: string;
    '3rd 1000'?: string;
    '4th 1000'?: string;
    '5th 1000'?: string;
    // 6-minute test splits
    '1st 90"'?: string;
    '2nd 90"'?: string;
    '3rd 90"'?: string;
    '4th 90"'?: string;
    // Additional fields for 6-minute test
    'Distance'?: string;
    'Weight Adjusted Distance'?: string;
}

export async function processCSVData(csvData: CsvRow[], testDate: Date, typeId: number = 1) {
    const client = createClient();
    console.log('Processing CSV data for test date:', testDate, 'type:', typeId);

    // First, check if this date exists in the dates table
    let dateId: number;
    const { data: existingDate, error: dateCheckError } = await client
        .from('dates')
        .select('id')
        .eq('date', testDate.toISOString().split('T')[0])
        .eq('type', typeId)
        .single();

    if (dateCheckError && dateCheckError.code !== 'PGRST116') {
        console.error('Error checking for existing date:', dateCheckError);
        return;
    }

    if (existingDate) {
        dateId = existingDate.id;
        console.log('Found existing date with ID:', dateId);
        
        // Check if scores already exist for this date
        const { data: existingScores, error: scoresCheckError } = await client
            .from('scores')
            .select('id')
            .eq('date', dateId)
            .limit(1);
            
        if (scoresCheckError) {
            console.error('Error checking for existing scores:', scoresCheckError);
            return;
        }
        
        if (existingScores && existingScores.length > 0) {
            console.log('Scores already exist for this date. Skipping processing.');
            return;
        }
    } else {
        // Create new date entry
        const newDateData = {
            date: testDate.toISOString().split('T')[0],
            type: typeId,
            year: testDate.getFullYear()
        };

        const { data: newDate, error: createDateError } = await client
            .from('dates')
            .insert(newDateData)
            .select('id')
            .single();

        if (createDateError || !newDate) {
            console.error('Error creating new date:', createDateError);
            return;
        }

        dateId = newDate.id;
        console.log('Created new date with ID:', dateId);
    }

    for (const row of csvData) {
        try {
            console.log('Processing row:', row);

            // If the row is empty, skip it
            if (!row['Last Name'] && !row['First Name']) {
                console.log('Skipping empty row:', row);
                continue;
            }

            // Parse athlete name and extract machine type
            const { firstName: cleanFirstName, lastName: cleanLastName, machineType } = parseAthleteNameAndMachine(
                row['First Name'], 
                row['Last Name']
            );

            console.log('Parsed athlete data:', { cleanFirstName, cleanLastName, machineType });

            // Search for existing athlete using clean names
            const { data: athletes, error: searchError } = await client
                .from('athletes')
                .select('*')
                .eq('lastName', cleanLastName)
                .eq('firstName', cleanFirstName);

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
                    firstName: cleanFirstName,
                    lastName: cleanLastName,
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

            // Build splits array based on test type
            const splits: number[] = [];
            if (typeId === 1) {
                // 2k test - 4 x 500m splits
                console.log('Processing 2k splits');
                const splitColumns = ['1st 500', '2nd 500', '3rd 500', '4th 500'];
                splitColumns.forEach(splitColumn => {
                    if (row[splitColumn as keyof CsvRow]) {
                        splits.push(parseTimeToMilliseconds(row[splitColumn as keyof CsvRow] as string));
                    }
                });
            } else if (typeId === 2) {
                // 5k test - 5 x 1000m splits
                console.log('Processing 5k splits');
                const splitColumns = ['1st 1000', '2nd 1000', '3rd 1000', '4th 1000', '5th 1000'];
                splitColumns.forEach(splitColumn => {
                    if (row[splitColumn as keyof CsvRow]) {
                        splits.push(parseTimeToMilliseconds(row[splitColumn as keyof CsvRow] as string));
                    }
                });
            } else if (typeId === 5) {
                // 6-minute test - 4 x 90 second splits
                console.log('Processing 6-minute test splits');
                const splitColumns = ['1st 90"', '2nd 90"', '3rd 90"', '4th 90"'];
                splitColumns.forEach(splitColumn => {
                    if (row[splitColumn as keyof CsvRow]) {
                        splits.push(parseTimeToMilliseconds(row[splitColumn as keyof CsvRow] as string));
                    }
                });
            } else {
                // Default to 2k format for unknown types
                console.log('Using default 2k splits for unknown type');
                const splitColumns = ['1st 500', '2nd 500', '3rd 500', '4th 500'];
                splitColumns.forEach(splitColumn => {
                    if (row[splitColumn as keyof CsvRow]) {
                        splits.push(parseTimeToMilliseconds(row[splitColumn as keyof CsvRow] as string));
                    }
                });
            }
            console.log('Processed splits for row:', splits);

            const scoreData = {
                athlete: athleteId,
                dateId: dateId,
                type: typeId,
                totalTime: parseTimeToMilliseconds(row['Time']),
                splits: splits,
                spm: parseInt(row['SPM']),
                averageWatts: parseFloat(row['Avg Watt']),
                weight: parseFloat(row['Weight']),
                weightAdjusted: parseTimeToMilliseconds(row['Weight Adjusted Time']),
                machineType: machineType
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
