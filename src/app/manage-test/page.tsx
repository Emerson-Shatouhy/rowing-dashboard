'use client';

import FileUpload from '@/components/FileUpload';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageTestPage() {
    const [testDates, setTestDates] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTestDates() {
            const supabase = createClient();
            try {
                // Get all scores first
                const { data, error } = await supabase
                    .from('scores')
                    .select('date, id');

                if (error) {
                    console.error('Error fetching test dates:', error);
                } else {
                    // Process the data to get unique dates with counts
                    const dateMap: Record<string, { date: string; count: number }> = {};
                    data?.forEach(score => {
                        // Extract just the date part (without time) for grouping
                        const dateStr = new Date(score.date).toISOString().split('T')[0];

                        if (!dateMap[dateStr]) {
                            dateMap[dateStr] = {
                                date: dateStr,
                                count: 1
                            };
                        } else {
                            dateMap[dateStr].count += 1;
                        }
                    });

                    // Convert the map to array and sort by date (newest first)
                    const uniqueDates = Object.values(dateMap).sort((a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    setTestDates(uniqueDates);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchTestDates();
    }, []);

    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Tests</h1>
                <p className="text-muted-foreground mt-2">
                    Upload new test data and view existing test dates.
                </p>
            </div>

            <div>
                <FileUpload />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Test Dates</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Number of Athletes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testDates.length > 0 ? (
                                    testDates.map((test, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{formatDate(test.date)}</TableCell>
                                            <TableCell>{test.count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-4">
                                            No test dates found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
