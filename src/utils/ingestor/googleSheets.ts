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

    return new Date(year, month, day);
}

export async function fetchSheetData(spreadsheetId: string) {
    try {
        const doc = new GoogleSpreadsheet(spreadsheetId, { apiKey: 'a' });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[13];

        // Parse date from sheet title
        const testDate = parseSheetDate(sheet.title);
        console.log('Parsed test date:', testDate);

        const rows = await sheet.getRows();

        // Transform Google Sheet rows into the format expected by processCSVData
        const formattedData = rows.map(row => ({
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
            '1st 500': row.get('1st 500') || '',
            '2nd 500': row.get('2nd 500') || '',
            '3rd 500': row.get('3rd 500') || '',
            '4th 500': row.get('4th 500') || ''
        }));

        // Process the data using the existing CSV handler
        await processCSVData(formattedData, testDate);
        return { formattedData, testDate };
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
}
