'use client';

import { fetchSheetData, fetchSheetTabs } from '@/utils/ingestor/googleSheets';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const googleSheets = [
    'https://docs.google.com/spreadsheets/d/1Mt-AkHULzKs3Dx3wctQL92uzm-oD6VPmzpnUPa6oHsk/edit?gid=2128374416#gid=2128374416',
    // Add more Google Sheets URLs here
];

export default function FileUpload() {
    const [status, setStatus] = useState<string>('');
    const [selectedSheet, setSelectedSheet] = useState<string>(googleSheets[0]); // Selected Google Sheet
    const [sheetTabs, setSheetTabs] = useState<string[]>([]); // List of tabs in the selected sheet
    const [selectedTab, setSelectedTab] = useState<string>(''); // Selected tab within the sheet

    useEffect(() => {
        // Automatically fetch tabs for the first sheet on load
        const initializeTabs = async () => {
            toast("Event has been created.")

            try {
                const initialSheet = googleSheets[0];
                setSelectedSheet(initialSheet);
                setStatus('Fetching sheet tabs...');
                const spreadsheetId = initialSheet.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
                if (!spreadsheetId) {
                    setStatus('Invalid Google Sheet URL');
                    setSheetTabs([]);
                    return;
                }

                const { tabs } = await fetchSheetTabs(spreadsheetId);
                setSheetTabs(tabs);
                setSelectedTab(''); // Reset selected tab
                setStatus('Sheet tabs loaded. Please select a tab.');
            } catch (error) {
                console.error('Error fetching sheet tabs on load:', error);
                setStatus('Error fetching sheet tabs');
                setSheetTabs([]);
            }
        };

        initializeTabs();
    }, []);

    const handleGoogleSheetChange = async (value: string) => {
        try {
            console.log('Google Sheet Changed:', value);
            setSelectedSheet(value);
            setStatus('Fetching sheet tabs...');
            const spreadsheetId = value.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            console.log('Extracted Spreadsheet ID:', spreadsheetId);
            if (!spreadsheetId) {
                setStatus('Invalid Google Sheet URL');
                setSheetTabs([]);
                return;
            }

            const { tabs } = await fetchSheetTabs(spreadsheetId);
            console.log('Fetched Sheet Tabs:', tabs);
            setSheetTabs(tabs);
            setStatus('Sheet tabs loaded. Please select a tab.');
        } catch (error) {
            console.error('Error fetching sheet tabs:', error);
            setStatus('Error fetching sheet tabs');
            setSheetTabs([]);
        }
    };

    const handleTabSelection = async () => {
        try {
            console.log('Selected Tab:', selectedTab);
            if (!selectedTab) {
                setStatus('Please select a tab');
                return;
            }

            setStatus('Processing selected tab...');
            toast.loading('Processing selected tab...');
            const spreadsheetId = selectedSheet.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            console.log('Extracted Spreadsheet ID for Tab Processing:', spreadsheetId);

            const { formattedData, testDate } = await fetchSheetData(spreadsheetId, selectedTab);

            toast.dismiss();
            console.log('Processed Data:', formattedData);
            console.log('Test Date:', testDate);
            toast.success(`Successfully processed ${formattedData.length} rows from tab "${selectedTab}" for date ${testDate.toLocaleDateString()}`);
            setStatus(`Successfully processed ${formattedData.length} rows from tab "${selectedTab}" for date ${testDate.toLocaleDateString()}`);

        } catch (error) {
            console.error('Error processing tab:', error);
            setStatus('Error processing tab');
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col rounded-md border mb-4 gap-4 p-4 bg-gray-200">
                <div>
                    <div className="text-xl font-semibold">Google Sheet Selection</div>
                    <div className="text-sm text-gray-700">
                        Select a Google Sheet and tab to process data
                    </div>
                </div>

                <div className="flex gap-4">
                    <Select onValueChange={handleGoogleSheetChange} value={selectedSheet}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="-- Select a Google Sheet --" />
                        </SelectTrigger>
                        <SelectContent>
                            {googleSheets.map((sheet, index) => (
                                <SelectItem key={index} value={sheet}>
                                    {sheet}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-4">
                    <Select onValueChange={(value) => {
                        console.log('Tab Changed:', value);
                        setSelectedTab(value);
                    }} value={selectedTab}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="-- Select a Tab --" />
                        </SelectTrigger>
                        <SelectContent>
                            {sheetTabs.length > 0 ? (
                                sheetTabs.map((tab, index) => (
                                    <SelectItem key={index} value={tab}>
                                        {tab}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem disabled value="no-tabs">
                                    No tabs available
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <button
                        onClick={handleTabSelection}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={!selectedTab}
                    >
                        Process Tab
                    </button>
                </div>
            </div>

        </div>
    );
}
