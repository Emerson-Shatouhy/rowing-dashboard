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

export async function fetchSheetData(spreadsheetId: string, tabName: string) {
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



        const rows = await sheet.getRows();
        console.log('Retrieved rows:', rows.length);

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

        console.log('Formatted data:', formattedData);

        // Process the data using the existing CSV handler
        await processCSVData(formattedData, testDate);
        return { formattedData, testDate };
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw new Error(`Failed to fetch data for tab "${tabName}" in spreadsheet ID: ${spreadsheetId}`);
    }
}
