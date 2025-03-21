'use client';

import { processCSVData } from '../lib/utils/csvHandler';
import { useState } from 'react';

export default function FileUpload() {
    const [status, setStatus] = useState<string>('');
    const [testDate, setTestDate] = useState<string>('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!testDate) {
                setStatus('Please select a test date first');
                return;
            }

            const file = event.target.files?.[0];
            if (file) {
                console.log('File selected:', file.name);
                setStatus(`Processing file: ${file.name}`);

                const text = await file.text();
                console.log('File content loaded, processing rows...');
                const rows = text.split('\n').map(row => {
                    // Split by comma and trim whitespace
                    const values = row.split(',').map(value => value.trim());
                    return {
                        'Last Name': values[0],
                        'First Name': values[1],
                        'Time': values[2],
                        'Weight Adjusted Time': values[3],
                        'PR 2k': values[4],
                        'Avg Split': values[5],
                        'Goal': values[6],
                        'Avg Watt': values[7],
                        'SPM': values[8],
                        'Weight': values[9],
                        '1st 500': values[10],
                        '2nd 500': values[11],
                        '3rd 500': values[12],
                        '4th 500': values[13]?.replace('\r', '')
                    };
                });

                console.log(`Found ${rows.length} rows in CSV`);
                // print the first row of data
                console.log('First row:', rows[0]);

                if (rows[0]['Last Name'] === 'Last Name') {
                    rows.shift(); // Remove header row if present
                }

                console.log(`Processing ${rows.length} data rows (excluding header)`);

                await processCSVData(rows, new Date(testDate));
                setStatus('File processed successfully!');
            }
        } catch (error: unknown | null) {
            console.error('Error processing file:', error);
            // setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="test-date" className="text-sm font-medium">
                    Test Date
                </label>
                <input
                    id="test-date"
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
            </div>
            <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="p-2 border rounded"
            />

            {status && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                    {status}
                </div>
            )}
        </div>
    );
}
