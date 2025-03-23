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
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>('');
    const [selectedRows, setSelectedRows] = useState<Scores[]>([]);

    // Get filtered dates based on selected workout type
    const filteredDates = Array.from(new Set(
        scores
            .filter(score => score.type.name === selectedWorkoutType)
            .map(score => new Date(score.date).toLocaleDateString())
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Initialize default workout type only once on mount
    useEffect(() => {
        if (uniqueWorkoutTypes.length > 0) {
            setSelectedWorkoutType(uniqueWorkoutTypes[0]);
        }
    }, [uniqueWorkoutTypes]);

    // Update selected date when workout type changes, but only if current date is invalid
    useEffect(() => {
        if (selectedWorkoutType && filteredDates.length > 0) {
            if (!filteredDates.includes(selectedDate)) {
                setSelectedDate(filteredDates[0]);
            }
        }
    }, [selectedWorkoutType, filteredDates, selectedDate]);

    // Filter scores based on selection
    const filteredScores = scores.filter(score =>
        (selectedDate === '' || new Date(score.date).toLocaleDateString() === selectedDate) &&
        (selectedWorkoutType === '' || score.type.name === selectedWorkoutType)
    );

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
            <div className="flex flex-col rounded-md border mb-4 gap-4 p-4 bg-gray-100">
                <div>
                    <div className="text-xl font-semibold">Test Selection</div>
                    <div className='text-sm text-gray-500'>
                        Select workout type and date
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
                    <Select onValueChange={handleDateChange} value={selectedDate}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Date" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredDates.map(date => (
                                <SelectItem key={date} value={date}>
                                    {date}
                                </SelectItem>
                            ))}
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