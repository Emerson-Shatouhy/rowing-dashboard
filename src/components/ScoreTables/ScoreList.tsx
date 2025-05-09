'use client'
import { Scores } from '@/lib/types/scores';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from 'react';


import { columns } from "./columns"
import { DataTable } from './DataTable';
import Stats from '../Stats/stats';


interface ScoreListProps {
    scores: Scores[];
}

export default function ScoreList({ scores }: ScoreListProps) {
    // Process workout dates and types only once for the initial render
    const uniqueWorkoutTypes = Array.from(new Set(scores.map(score => score.type.name)));

    // State for filters
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>('');
    const [selectedRows, setSelectedRows] = useState<Scores[]>([]);

    // Get unique years based on scores
    const uniqueYears = Array.from(new Set(
        scores.map(score => new Date(score.date).getFullYear().toString())
    )).sort((a, b) => parseInt(b) - parseInt(a));

    // Get filtered dates based on selected year and workout type
    const filteredDates = Array.from(new Set(
        scores
            .filter(score =>
                (selectedYear === '' || new Date(score.date).getFullYear().toString() === selectedYear) &&
                score.type.name === selectedWorkoutType
            )
            .map(score => new Date(score.date).toLocaleDateString())
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Initialize default year and workout type only once on mount
    useEffect(() => {
        if (uniqueYears.length > 0) {
            setSelectedYear(uniqueYears[0]);
        }
        if (uniqueWorkoutTypes.length > 0) {
            setSelectedWorkoutType(uniqueWorkoutTypes[0]);
        }
    }, []);

    // Update selected date when year or workout type changes, but only if current date is invalid
    useEffect(() => {
        if (selectedYear && selectedWorkoutType && filteredDates.length > 0) {
            if (!filteredDates.includes(selectedDate)) {
                setSelectedDate(filteredDates[0]);
            }
        }
    }, [selectedYear, selectedWorkoutType, filteredDates]);

    // Filter scores based on selection
    const filteredScores = scores.filter(score =>
        (selectedYear === '' || new Date(score.date).getFullYear().toString() === selectedYear) &&
        (selectedDate === '' || new Date(score.date).toLocaleDateString() === selectedDate) &&
        (selectedWorkoutType === '' || score.type.name === selectedWorkoutType)
    );

    // Handle year selection change
    const handleYearChange = (value: string) => {
        setSelectedRows([]);
        setSelectedYear(value);
    };

    // Handle date selection change
    const handleDateChange = (value: string) => {
        setSelectedRows([]);
        setSelectedDate(value);
    };

    // Handle workout type selection change  
    const handleWorkoutTypeChange = (value: string) => {
        setSelectedRows([]);
        setSelectedWorkoutType(value);
    };

    const handleSelectionChange = (rows: Scores[]) => {
        setSelectedRows(rows);
    };

    return (
        <div className="w-full" >
            <div className="flex flex-col rounded-md border mb-4 gap-4 p-4 bg-gray-200">
                <div>
                    <div className="text-xl font-semibold">Test Selection</div>
                    <div className='text-sm text-gray-700'>
                        Select workout type, year, and date
                    </div>
                </div>

                <div className='flex gap-4'>
                    <Select onValueChange={handleWorkoutTypeChange} value={selectedWorkoutType}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Workout" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueWorkoutTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleYearChange} value={selectedYear}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueYears.map(year => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleDateChange} value={selectedDate}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Date" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredDates.length > 0 ? (
                                filteredDates.map(date => (
                                    <SelectItem key={date} value={date}>
                                        {date}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem disabled value="no-dates">
                                    No dates available
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div className="my-4">
                <Stats scores={selectedRows.length > 0 ? selectedRows : filteredScores} />
            </div>
            <div className="rounded-md border">
                <DataTable
                    columns={columns}
                    data={filteredScores}
                    onSelectionChange={handleSelectionChange}
                />
            </div>


        </div >
    );
}