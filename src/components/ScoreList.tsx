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


interface ScoreListProps {
    scores: Scores[];
}

export default function ScoreList({ scores }: ScoreListProps) {
    // Process workout dates and types only once for the initial render
    const uniqueDates = Array.from(new Set(scores.map(score =>
        new Date(score.date).toLocaleDateString()
    ))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const uniqueWorkoutTypes = Array.from(new Set(scores.map(score => score.type.name)));

    // State for filters
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>('');

    // Initialize default values after we've extracted unique dates/types
    useEffect(() => {
        if (uniqueDates.length > 0 && selectedDate === '') {
            setSelectedDate(uniqueDates[0]);
        }
        if (uniqueWorkoutTypes.length > 0 && selectedWorkoutType === '') {
            setSelectedWorkoutType(uniqueWorkoutTypes[0]);
        }
    }, [uniqueDates, uniqueWorkoutTypes, selectedDate, selectedWorkoutType]);

    // Filter scores based on selection
    const filteredScores = scores.filter(score =>
        (selectedDate === '' || new Date(score.date).toLocaleDateString() === selectedDate) &&
        (selectedWorkoutType === '' || score.type.name === selectedWorkoutType)
    );


    // Handle date selection change
    const handleDateChange = (value: string) => {
        setSelectedDate(value);
    };

    // Handle workout type selection change  
    const handleWorkoutTypeChange = (value: string) => {
        setSelectedWorkoutType(value);
    };

    const testScores: Scores[] = [
        {
            id: '61d06297-44c5-4cd9-9759-edf6921be8a9',
            date: new Date(),
            type: {
                id: 1,
                name: "Row",
                description: "Rowing workout"
            },
            athlete: {
                id: '61d06297-44c5-4cd9-9759-edf6921be8a9',
                firstName: "John",
                lastName: "Doe",
                coxswain: false,
                personalRecords: "test"
            },
            totalTime: 1000,
            splits: [100],
            spm: 20,
            weight: 200,
            weightAdjusted: 200,
            averageWatts: 200,
        },
        {
            id: '61d06297-44c5-4cd9-9759-edf6921be8a9',
            date: new Date(),
            type: {
                id: 1,
                name: "Row",
                description: "Rowing workout"
            },
            athlete: {
                id: '61d06297-44c5-4cd9-9759-edf6921be8a9',
                firstName: "Not",
                lastName: "Rower",
                coxswain: false,
                personalRecords: "test"
            },
            totalTime: 1000,
            splits: [100],
            spm: 20,
            weight: 200,
            weightAdjusted: 200,
            averageWatts: 200,
        }
    ];

    return (
        <div className="w-full" >
            <div className="mb-4 flex gap-4">
                <Select onValueChange={handleDateChange} value={selectedDate}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Date" />
                    </SelectTrigger>
                    <SelectContent>
                        {uniqueDates.map(date => (
                            <SelectItem key={date} value={date}>
                                {date}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select onValueChange={handleWorkoutTypeChange} value={selectedWorkoutType}>
                    <SelectTrigger className="w-[180px]">
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
            </div>
            <div className="rounded-md border">
                {/* <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, i) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table> */}
                <DataTable columns={columns} data={testScores} />
            </div>

        </div >
    );
}