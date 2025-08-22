'use client';

import { fetchSheetData, fetchSheetTabs, fetchAllSheetData } from '@/utils/ingestor/googleSheets';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Type } from '@/lib/types/scores';
import { getTestTypes } from '@/lib/data/scores';

const googleSheets = [
    {
        name: '2k Master Sheet',
        url: 'https://docs.google.com/spreadsheets/d/1Mt-AkHULzKs3Dx3wctQL92uzm-oD6VPmzpnUPa6oHsk/edit?gid=2128374416#gid=2128374416'
    },
    {
        name: '5k Master Sheet',
        url: 'https://docs.google.com/spreadsheets/d/1RDsMZuoHiz6Ylpr46JN6gQD4pn31fdOfmnZoqqvLbZ8/edit?gid=1275374019#gid=1275374019'
    },
    {
        name: '6-Minute Master Sheet',
        url: 'https://docs.google.com/spreadsheets/d/1CLtRILKYNpUuVEgGDSVLEqE6LtisSvks7DBS47fFzJA/edit?usp=sharing'
    }
];


export default function FileUpload() {

    const [status, setStatus] = useState<string>('');
    const [selectedSheet, setSelectedSheet] = useState<string>(googleSheets[0].url); // Selected Google Sheet
    const [sheetTabs, setSheetTabs] = useState<string[]>([]); // List of tabs in the selected sheet
    const [selectedTab, setSelectedTab] = useState<string>(''); // Selected tab within the sheet
    const [availableTypes, setAvailableTypes] = useState<Type[]>([]); // Available test types from database
    const [selectedType, setSelectedType] = useState<Type | null>(null); // Selected test type

    // Fetch available types from database
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const types = await getTestTypes();
                setAvailableTypes(types);
                if (types.length > 0) {
                    setSelectedType(types[0]); // Set first type as default
                }
            } catch (error) {
                console.error('Error fetching types:', error);
                setStatus('Error loading test types');
            }
        };

        fetchTypes();
    }, []);

    useEffect(() => {
        // Automatically fetch tabs for the first sheet on load
        const initializeTabs = async () => {
            try {
                const initialSheet = googleSheets[0].url;
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

            if (!selectedType) {
                setStatus('Please select a test type');
                return;
            }

            setStatus('Processing selected tab...');
            toast.loading('Processing selected tab...');
            const spreadsheetId = selectedSheet.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            console.log('Extracted Spreadsheet ID for Tab Processing:', spreadsheetId);

            if (!selectedTab) {
                throw new Error('Selected tab is undefined');
            }
            // @ts-expect-error convert to string
            const { formattedData, testDate } = await fetchSheetData(spreadsheetId, selectedTab, selectedType.id);

            toast.dismiss();
            console.log('Processed Data:', formattedData);
            console.log('Test Date:', testDate);
            console.log('Status', status);
            toast.success(`Successfully processed ${formattedData.length} rows from tab "${selectedTab}" for ${selectedType.name} test on ${testDate.toLocaleDateString()}`);
            setStatus(`Successfully processed ${formattedData.length} rows from tab "${selectedTab}" for ${selectedType.name} test on ${testDate.toLocaleDateString()}`);

        } catch (error) {
            console.error('Error processing tab:', error);
            toast.error('Error processing tab');
            setStatus('Error processing tab');
        }
    };

    const handleTypeChange = (value: string) => {
        const type = availableTypes.find(t => t.id.toString() === value);
        if (type) {
            setSelectedType(type);
        }
    };

    const handleBulkImport = async () => {
        try {
            if (!selectedType) {
                setStatus('Please select a test type');
                return;
            }

            setStatus('Starting bulk import...');
            toast.loading('Processing all tabs in the sheet...');

            const spreadsheetId = selectedSheet.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            if (!spreadsheetId) {
                setStatus('Invalid Google Sheet URL');
                return;
            }

            const results = await fetchAllSheetData(spreadsheetId, selectedType.id);

            toast.dismiss();

            const successMessage = `Bulk import completed! Processed: ${results.processed}, Skipped: ${results.skipped}, Errors: ${results.errors}`;
            setStatus(successMessage);

            if (results.processed > 0) {
                toast.success(successMessage);
            } else if (results.skipped > 0 && results.errors === 0) {
                toast.warning(successMessage);
            } else {
                toast.error(successMessage);
            }

        } catch (error) {
            console.error('Error in bulk import:', error);
            toast.error('Error during bulk import');
            setStatus('Error during bulk import');
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
                                <SelectItem key={index} value={sheet.url}>
                                    {sheet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={handleTypeChange} value={selectedType?.id.toString() || ''}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="-- Select Test Type --" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
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
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!selectedTab || !selectedType}
                    >
                        Process Tab
                    </button>
                    <button
                        onClick={handleBulkImport}
                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!selectedType}
                    >
                        Bulk Import All Tabs
                    </button>
                </div>

                {status && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="text-sm text-blue-800">
                            Status: {status}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
