'use client'
import { Type, Scores } from '@/lib/types/scores';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { columns } from "./columns"
import { DataTable } from './DataTable';
import Stats from '../Stats/stats';

interface TieredScoreListProps {
    initialTypes: Type[];
}

interface TestDate {
    id: number;
    date: string;
    type: number;
    year: number;
}

export default function TieredScoreList({ initialTypes }: TieredScoreListProps) {
    const [selectedType, setSelectedType] = useState<Type | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [availableDates, setAvailableDates] = useState<TestDate[]>([]);
    const [selectedDate, setSelectedDate] = useState<TestDate | null>(null);
    const [scores, setScores] = useState<Scores[]>([]);
    const [selectedRows, setSelectedRows] = useState<Scores[]>([]);
    const [loading, setLoading] = useState(false);

    // Generate years from 2013 to current year
    const availableYears = Array.from(
        { length: new Date().getFullYear() - 2013 + 1 },
        (_, i) => 2013 + i
    ).reverse();

    const supabase = createClient();

    useEffect(() => {
        if (initialTypes.length > 0 && !selectedType) {
            setSelectedType(initialTypes[0]);
        }
    }, [initialTypes]);

    useEffect(() => {
        if (selectedType) {
            loadDatesForType(selectedType.id, selectedYear);
        }
    }, [selectedType, selectedYear]);

    useEffect(() => {
        if (selectedDate) {
            loadScoresForDate(selectedDate.id);
        }
    }, [selectedDate]);

    const loadDatesForType = async (typeId: number, year: number) => {
        setLoading(true);
        try {
            const { data: dates, error } = await supabase
                .from('dates')
                .select('*')
                .eq('type', typeId)
                .eq('year', year)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching dates:', error);
                return;
            }

            setAvailableDates(dates || []);
            if (dates && dates.length > 0) {
                setSelectedDate(dates[0]);
            } else {
                setSelectedDate(null);
                setScores([]);
            }
        } catch (error) {
            console.error('Error loading dates:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadScoresForDate = async (dateId: number) => {
        setLoading(true);
        try {
            const { data: scoresData, error } = await supabase
                .from('scores')
                .select('*, athlete:athlete(*), type:type(*)')
                .eq('dateId', dateId)
                .order('totalTime', { ascending: true });

            if (error) {
                console.error('Error fetching scores:', error);
                return;
            }

            setScores(scoresData || []);
        } catch (error) {
            console.error('Error loading scores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (typeId: string) => {
        const type = initialTypes.find(t => t.id.toString() === typeId);
        if (type) {
            setSelectedType(type);
            setSelectedRows([]);
        }
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(parseInt(year));
        setSelectedRows([]);
    };

    const handleDateChange = (dateId: string) => {
        const date = availableDates.find(d => d.id.toString() === dateId);
        if (date) {
            setSelectedDate(date);
            setSelectedRows([]);
        }
    };

    const handleSelectionChange = (rows: Scores[]) => {
        setSelectedRows(rows);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col rounded-md border mb-4 gap-4 p-4 bg-gray-200">
                <div>
                    <div className="text-xl font-semibold">Test Selection</div>
                    <div className='text-sm text-gray-700'>
                        Select workout type, year, and test date
                    </div>
                </div>

                <div className='flex gap-4'>
                    <Select
                        onValueChange={handleTypeChange}
                        value={selectedType?.id.toString() || ''}
                    >
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Workout Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {initialTypes.map(type => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={handleYearChange}
                        value={selectedYear.toString()}
                    >
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={handleDateChange}
                        value={selectedDate?.id.toString() || ''}
                        disabled={!selectedType || loading}
                    >
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Test Date" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableDates.length > 0 ? (
                                availableDates.map(date => (
                                    <SelectItem key={date.id} value={date.id.toString()}>
                                        {new Date(date.date).toLocaleDateString()}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem disabled value="no-dates">
                                    {loading ? 'Loading...' : 'No dates available'}
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="text-lg">Loading...</div>
                </div>
            )}

            {!loading && scores.length > 0 && (
                <>
                    <div className="my-4">
                        <Stats scores={selectedRows.length > 0 ? selectedRows : scores} />
                    </div>
                    <div className="rounded-md border">
                        <DataTable
                            columns={columns}
                            data={scores}
                            onSelectionChange={handleSelectionChange}
                        />
                    </div>
                </>
            )}

            {!loading && selectedDate && scores.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No scores found for the selected test date.
                </div>
            )}
        </div>
    );
}