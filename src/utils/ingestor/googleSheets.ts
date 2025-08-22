import { GoogleSpreadsheet } from 'google-spreadsheet';
import { processCSVData } from '@/lib/utils/csvHandler';

function parseSheetDate(sheetName: string): Date {
    // Expected format: "2/10/14" or similar
    const parts = sheetName.split('/');
    if (parts.length !== 3) {
        throw new Error('Invalid sheet name format. Expected MM/DD/YY');
    }

    const month = parseInt(parts[0]) - 1; // JS months are 0-based
    const day = parseInt(parts[1]);
    let year = parseInt(parts[2]);

    // Convert 2-digit year to 4-digit year
    if (year < 100) {
        year += year < 50 ? 2000 : 1900;
    }

    // Create date at 4pm EST (UTC-5, so 21:00 UTC)
    const date = new Date(year, month, day, 16, 0, 0, 0);
    return date;
}

function validateHeaders(headers: string[], typeId: number): boolean {
    const baseHeaders = ['Last Name', 'First Name', 'Weight'];
    
    // Check if base headers exist
    for (const header of baseHeaders) {
        if (!headers.includes(header)) {
            return false;
        }
    }

    // Check type-specific headers
    if (typeId === 1) {
        // 2k test headers
        const required2kHeaders = ['Time', '1st 500', '2nd 500', '3rd 500', '4th 500'];
        return required2kHeaders.every(header => headers.includes(header));
    } else if (typeId === 2) {
        // 5k test headers
        const required5kHeaders = ['Time', '1st 1000', '2nd 1000', '3rd 1000', '4th 1000', '5th 1000'];
        return required5kHeaders.every(header => headers.includes(header));
    } else if (typeId === 5) {
        // 6-minute test headers
        const required6minHeaders = ['Distance', '1st 90"', '2nd 90"', '3rd 90"', '4th 90"'];
        return required6minHeaders.every(header => headers.includes(header));
    }
    
    return false;
}

export async function fetchSheetTabs(spreadsheetId: string) {
    try {
        console.log('Fetching sheet tabs for spreadsheet ID:', spreadsheetId);
        const doc = new GoogleSpreadsheet(spreadsheetId, { apiKey: "AIzaSyDLDgpWxDN0rD3rX9-SdA1uNZ6yjZnpzsg" });
        await doc.loadInfo();
        console.log('Loaded spreadsheet info:', doc.title);

        // Retrieve all sheet titles
        const tabs = doc.sheetsByIndex.map(sheet => sheet.title);
        console.log('Retrieved sheet tabs:', tabs);
        return { tabs };
    } catch (error) {
        console.error('Error fetching sheet tabs:', error);
        throw new Error(`Failed to fetch sheet tabs for spreadsheet ID: ${spreadsheetId}`);
    }
}

export async function fetchSheetData(spreadsheetId: string, tabName: string, typeId: number = 1) {
    try {
        console.log('Fetching sheet data for spreadsheet ID:', spreadsheetId, 'and tab name:', tabName);
        const doc = new GoogleSpreadsheet(spreadsheetId, { apiKey: 'AIzaSyDLDgpWxDN0rD3rX9-SdA1uNZ6yjZnpzsg' });
        await doc.loadInfo();
        console.log('Loaded spreadsheet info:', doc.title);

        // Find the sheet by its title
        const sheet = doc.sheetsByTitle[tabName];
        if (!sheet) {
            throw new Error(`Tab "${tabName}" not found in the Google Sheet`);
        }
        console.log('Found sheet:', sheet.title);

        // Parse date from sheet title
        const testDate = parseSheetDate(sheet.title);
        console.log('Parsed test date:', testDate);

        // Load and validate headers
        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;
        console.log('Sheet headers:', headers);

        if (!validateHeaders(headers, typeId)) {
            throw new Error(`Tab "${tabName}" does not have the required headers for test type ${typeId}`);
        }

        const rows = await sheet.getRows();
        console.log('Retrieved rows:', rows.length);

        // Transform Google Sheet rows based on test type
        const formattedData = rows.map(row => {
            const baseData = {
                'Last Name': row.get('Last Name') || '',
                'First Name': row.get('First Name') || '',
                'Time': row.get('Time') || '',
                'Weight Adjusted Time': row.get('Weight Adjusted Time') || '',
                'PR 2k': row.get('PR 2k') || '',
                'Avg Split': row.get('Avg Split') || '',
                'Goal': row.get('Goal') || '',
                'Avg Watt': row.get('Avg Watt') || '',
                'SPM': row.get('SPM') || '',
                'Weight': row.get('Weight') || '',
            };

            // Add splits based on test type
            if (typeId === 1) {
                // 2k test - 4 x 500m splits
                return {
                    ...baseData,
                    '1st 500': row.get('1st 500') || '',
                    '2nd 500': row.get('2nd 500') || '',
                    '3rd 500': row.get('3rd 500') || '',
                    '4th 500': row.get('4th 500') || ''
                };
            } else if (typeId === 2) {
                // 5k test - 5 x 1000m splits
                return {
                    ...baseData,
                    '1st 1000': row.get('1st 1000') || '',
                    '2nd 1000': row.get('2nd 1000') || '',
                    '3rd 1000': row.get('3rd 1000') || '',
                    '4th 1000': row.get('4th 1000') || '',
                    '5th 1000': row.get('5th 1000') || ''
                };
            } else if (typeId === 3) {
                // 6 minute test - 4 x 9 second splits
                return {
                    'Last Name': row.get('Last Name') || '',
                    'First Name': row.get('First Name') || '',
                    'Distance': row.get('Distance') || '',
                    'Weight Adjusted Distance': row.get('Weight Adjusted Distance') || '',
                    'PR 2k': row.get('PR 2k') || '',
                    'Avg Split': row.get('Avg Split') || '',
                    'Goal': row.get('Goal') || '',
                    'Avg Watt': row.get('Avg Watt') || '',
                    'SPM': row.get('SPM') || '',
                    'Weight': row.get('Weight') || '',

                    '1st 90"': row.get('1st 90"') || '',
                    '2nd 90"': row.get('2nd 90"') || '',
                    '3rd 90"': row.get('3rd 90"') || '',
                    '4th 90"': row.get('4th 90"') || ''
                };
                    
            } else {
                // Skip tab if type is not recognized
                console.warn(`Skipping tab "${tabName}" for unknown type ID: ${typeId}`);
                return null;
            }
        });

        console.log('Formatted data:', formattedData);

        // Process the data using the existing CSV handler
        await processCSVData(formattedData, testDate, typeId);
        return { formattedData, testDate };
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw new Error(`Failed to fetch data for tab "${tabName}" in spreadsheet ID: ${spreadsheetId}`);
    }
}

export async function fetchAllSheetData(spreadsheetId: string, typeId: number) {
    try {
        console.log('Starting bulk import for spreadsheet ID:', spreadsheetId, 'type:', typeId);
        const doc = new GoogleSpreadsheet(spreadsheetId, { apiKey: 'AIzaSyDLDgpWxDN0rD3rX9-SdA1uNZ6yjZnpzsg' });
        await doc.loadInfo();
        
        const results = {
            processed: 0,
            skipped: 0,
            errors: 0,
            details: [] as string[]
        };

        for (const sheet of doc.sheetsByIndex) {
            try {
                console.log(`Processing tab: ${sheet.title}`);
                
                // Try to parse the date to validate tab format
                try {
                    parseSheetDate(sheet.title);
                } catch (error) {
                    console.log(`Skipping tab "${sheet.title}" - invalid date format`);
                    results.skipped++;
                    results.details.push(`Skipped "${sheet.title}" - invalid date format`);
                    continue;
                }

                // Validate headers before processing
                await sheet.loadHeaderRow();
                const headers = sheet.headerValues;
                
                if (!validateHeaders(headers, typeId)) {
                    console.log(`Skipping tab "${sheet.title}" - headers don't match test type ${typeId}`);
                    results.skipped++;
                    results.details.push(`Skipped "${sheet.title}" - headers don't match test type`);
                    continue;
                }

                // Process the sheet data
                await fetchSheetData(spreadsheetId, sheet.title, typeId);
                results.processed++;
                results.details.push(`Processed "${sheet.title}" successfully`);
                
            } catch (error) {
                console.error(`Error processing tab "${sheet.title}":`, error);
                results.errors++;
                results.details.push(`Error processing "${sheet.title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        return results;
    } catch (error) {
        console.error('Error in bulk import:', error);
        throw new Error(`Failed to perform bulk import for spreadsheet ID: ${spreadsheetId}`);
    }
}
