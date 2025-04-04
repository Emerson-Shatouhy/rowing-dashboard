'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Type } from '@/lib/types/scores';
import { formatTime, formatDate } from '@/utils/time/time';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

interface AllTimeRecordsClientProps {
    types: Type[];
    records: Record<number, any[]>;
}

export default function AllTimeRecordsClient({ types, records }: AllTimeRecordsClientProps) {
    const [activeTab, setActiveTab] = useState<string>(types[0]?.id.toString() || "1");

    // Helper function to validate if a record has valid time
    const isValidRecord = (record: any) => {
        return record && record.totalTime && record.totalTime > 0;
    };

    return (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-200 mb-4">
                {types.map(type => (
                    <TabsTrigger
                        key={type.id}
                        value={type.id.toString()}
                        className="data-[state=active]:bg-gray-50"
                    >
                        {type.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {types.map(type => {
                // Filter out any entries with DNF (null or zero time)
                const validRecords = records[type.id]?.filter(isValidRecord) || [];

                return (
                    <TabsContent key={type.id} value={type.id.toString()}>
                        <div className="rounded-md border">
                            <h2 className="text-xl font-semibold p-4 bg-gray-100 border-b">
                                {type.name} Records
                            </h2>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-300">
                                        <TableHead className="w-12 text-center">#</TableHead>
                                        <TableHead>Athlete</TableHead>
                                        <TableHead className="text-center">Total Time</TableHead>
                                        <TableHead className="text-center">Wt. Adjusted</TableHead>
                                        <TableHead className="text-center">Date</TableHead>
                                        <TableHead className="text-center">SPM</TableHead>
                                        <TableHead className="text-center">Watts</TableHead>
                                        <TableHead className="text-center">Weight</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {validRecords.length > 0 ? (
                                        validRecords.map((record, index) => (
                                            <TableRow
                                                key={record.id}
                                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}
                                            >
                                                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                                <TableCell>
                                                    {record.athlete.firstName} {record.athlete.lastName}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatTime(record.totalTime)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatTime(record.weightAdjusted)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatDate(record.date)}
                                                </TableCell>
                                                <TableCell className="text-center">{record.spm}</TableCell>
                                                <TableCell className="text-center">{record.averageWatts}</TableCell>
                                                <TableCell className="text-center">{record.weight} lbs</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                No records found for this workout type.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                );
            })}
        </Tabs>
    );
}
