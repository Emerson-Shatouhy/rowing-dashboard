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
import { MachineType, Type } from '@/lib/types/scores';
import { formatTime, formatDate } from '@/utils/time/time';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MachineIndicator } from "@/components/indicator/indicator";
import { formatName } from '@/utils/athlete/athlete';

interface AllTimeRecordsClientProps {
    types: Type[];
    records: Record<number, {
        id: number;
        athlete: { firstName: string; lastName: string };
        totalTime: number;
        weightAdjusted: number;
        date: string;
        spm: number;
        averageWatts: number;
        weight: number;
        machineType: MachineType;
    }[]>;
}

export default function AllTimeRecordsClient({ types, records }: AllTimeRecordsClientProps) {
    const [activeTab, setActiveTab] = useState<string>(types[0]?.id.toString() || "1");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    // Helper function to validate if a record has valid time
    const isValidRecord = (record: { totalTime: number | null }) => {
        return record && record.totalTime && record.totalTime > 0;
    };

    const handlePageChange = (newPage: number, totalPages: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Reset to page 1 when switching tabs
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setCurrentPage(1);
    };

    return (
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
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

                // Calculate pagination
                const totalPages = Math.ceil(validRecords.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginatedRecords = validRecords.slice(startIndex, startIndex + itemsPerPage);

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
                                        <TableHead className="text-center">Machine</TableHead>
                                        <TableHead className="text-center">Total Time</TableHead>
                                        <TableHead className="text-center">Wt. Adjusted</TableHead>
                                        <TableHead className="text-center">Date</TableHead>
                                        <TableHead className="text-center">SPM</TableHead>
                                        <TableHead className="text-center">Watts</TableHead>
                                        <TableHead className="text-center">Weight</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRecords.length > 0 ? (
                                        paginatedRecords.map((record, index) => (
                                            <TableRow
                                                key={record.id}
                                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}
                                            >
                                                <TableCell className="font-medium text-center">{startIndex + index + 1}</TableCell>
                                                <TableCell>
                                                    {formatName(
                                                        record.athlete.firstName,
                                                        record.athlete.lastName)
                                                    }
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <MachineIndicator machine={record.machineType} />
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
                                            <TableCell colSpan={9} className="h-24 text-center">
                                                No records found for this workout type.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {validRecords.length > 0 && (
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-t">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                                        <span className="font-medium">
                                            {Math.min(startIndex + itemsPerPage, validRecords.length)}
                                        </span>{" "}
                                        of <span className="font-medium">{validRecords.length}</span> records
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-700">
                                                Items per page:
                                            </span>
                                            <Select
                                                value={itemsPerPage.toString()}
                                                onValueChange={handleItemsPerPageChange}
                                            >
                                                <SelectTrigger className="w-20 h-8">
                                                    <SelectValue placeholder={itemsPerPage.toString()} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="5">5</SelectItem>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="25">25</SelectItem>
                                                    <SelectItem value="50">50</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <nav className="flex items-center space-x-1">
                                            <Button
                                                onClick={() => handlePageChange(1, totalPages)}
                                                disabled={currentPage === 1}
                                                variant="outline"
                                                size="sm"
                                                className="disabled:opacity-50"
                                            >
                                                First
                                            </Button>
                                            <Button
                                                onClick={() => handlePageChange(currentPage - 1, totalPages)}
                                                disabled={currentPage === 1}
                                                variant="outline"
                                                size="sm"
                                                className="disabled:opacity-50"
                                            >
                                                &laquo; Prev
                                            </Button>
                                            <span className="px-2 py-1 text-sm">
                                                Page {currentPage} of {totalPages || 1}
                                            </span>
                                            <Button
                                                onClick={() => handlePageChange(currentPage + 1, totalPages)}
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                variant="outline"
                                                size="sm"
                                                className="disabled:opacity-50"
                                            >
                                                Next &raquo;
                                            </Button>
                                            <Button
                                                onClick={() => handlePageChange(totalPages, totalPages)}
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                variant="outline"
                                                size="sm"
                                                className="disabled:opacity-50"
                                            >
                                                Last
                                            </Button>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                );
            })}
        </Tabs>
    );
}
