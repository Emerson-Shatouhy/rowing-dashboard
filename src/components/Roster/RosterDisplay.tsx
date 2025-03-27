'use client'

import { useState, useEffect } from 'react';
import { Athlete, Side } from '@/lib/types/athlete';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";

interface RosterDisplayProps {
    athletes: Athlete[];
}

export default function RosterDisplay({ athletes }: RosterDisplayProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);
    const [processedAthletes, setProcessedAthletes] = useState<Athlete[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [savingAthleteId, setSavingAthleteId] = useState<string | null>(null);

    // Process athletes to assign seasons based on test results
    useEffect(() => {
        async function processAthletesWithSeasons() {
            setLoading(true);
            const supabase = createClient();
            const processed = [...athletes];

            // Process athletes that don't have seasons assigned
            for (let i = 0; i < processed.length; i++) {
                const athlete = processed[i];
                if (athlete.seasons && athlete.seasons.length > 0) {
                    continue;
                }

                // Ensure seasons is always an array
                if (!athlete.seasons) {
                    athlete.seasons = [];
                }

                // Fetch test results for the athlete
                const { data: scoreData, error } = await supabase
                    .from('scores')
                    .select('date')
                    .eq('athlete', athlete.id);

                if (error) {
                    console.error('Error fetching scores:', error);
                    continue;
                }

                // Extract years from test dates
                if (scoreData && scoreData.length > 0) {
                    const seasons = new Set<string>(athlete.seasons);

                    scoreData.forEach(score => {
                        if (score.date) {
                            // Extract year from test date
                            const year = new Date(score.date).getFullYear().toString();
                            seasons.add(year);
                        }
                    });

                    // Only update athlete if we found new seasons
                    if (seasons.size > athlete.seasons.length) {
                        const seasonsArray = Array.from(seasons);

                        // Update the athlete's seasons in the database
                        const { error: updateError } = await supabase
                            .from('athletes')
                            .update({ seasons: seasonsArray })
                            .eq('id', athlete.id);

                        if (updateError) {
                            console.error('Error updating athlete seasons:', updateError);
                        } else {
                            // Update the processed array with new seasons
                            processed[i] = {
                                ...athlete,
                                seasons: seasonsArray
                            };
                        }
                    }
                }
            }

            setProcessedAthletes(processed);
            setLoading(false);
        }

        processAthletesWithSeasons();
    }, [athletes]);

    // Extract all unique seasons/years from processed athletes
    const allSeasons = processedAthletes.flatMap(athlete => athlete.seasons || []);
    const uniqueSeasons = Array.from(new Set(allSeasons)).sort().reverse();

    // Set default year on initial render
    useEffect(() => {
        if (uniqueSeasons.length > 0 && selectedYear === '') {
            setSelectedYear(uniqueSeasons[0]);
        }
    }, [uniqueSeasons, selectedYear]);

    // Filter athletes based on selected year
    useEffect(() => {
        if (selectedYear) {
            const filtered = processedAthletes.filter(athlete =>
                athlete.seasons && athlete.seasons.includes(selectedYear)
            );
            setFilteredAthletes(filtered);
        } else {
            setFilteredAthletes(processedAthletes);
        }
    }, [selectedYear, processedAthletes]);

    // Handle year selection change
    const handleYearChange = (value: string) => {
        setSelectedYear(value);
    };

    // Save the side preference when changed
    const handleSideSave = async (athlete: Athlete, newSide: Side) => {
        // Don't save if the side hasn't changed
        if (newSide === athlete.side) {
            return;
        }

        setSavingAthleteId(athlete.id as string);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from('athletes')
                .update({ side: newSide })
                .eq('id', athlete.id);

            if (error) {
                console.error('Error updating athlete side:', error);
                toast.error("Failed to update athlete's side preference.");
            } else {
                // Update the local state with the new side
                const updatedProcessedAthletes = processedAthletes.map(a =>
                    a.id === athlete.id ? { ...a, side: newSide } : a
                );
                setProcessedAthletes(updatedProcessedAthletes);

                // Also update filtered athletes
                const updatedFilteredAthletes = filteredAthletes.map(a =>
                    a.id === athlete.id ? { ...a, side: newSide } : a
                );
                setFilteredAthletes(updatedFilteredAthletes);

                toast.success(`Updated ${athlete.firstName}'s side preference.`, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.error('Error updating athlete side:', error);
            toast.error("An unexpected error occurred while saving.");
        } finally {
            setSavingAthleteId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col rounded-md border mb-4 gap-4 p-4 bg-gray-200">
                <div>
                    <div className="text-xl font-semibold">Roster Selection</div>
                    <div className='text-sm text-gray-700'>
                        Select season/year to view roster
                    </div>
                </div>

                <div className='flex gap-4'>
                    <Select onValueChange={handleYearChange} value={selectedYear}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Season" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueSeasons.map(year => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-gray-300">Name</TableHead>
                            <TableHead className="bg-gray-300">Side</TableHead>
                            <TableHead className="bg-gray-300">Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    Loading roster data...
                                </TableCell>
                            </TableRow>
                        ) : filteredAthletes.length > 0 ? (
                            filteredAthletes.map((athlete, i) => (
                                <TableRow key={athlete.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-200'}>
                                    <TableCell>{`${athlete.firstName} ${athlete.lastName}`}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={athlete.side || Side.BOTH}
                                            onValueChange={(value) => handleSideSave(athlete, value as Side)}
                                            disabled={savingAthleteId === athlete.id}
                                        >
                                            <SelectTrigger className="w-[120px] bg-white">
                                                <SelectValue placeholder="Select Side" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={Side.PORT}>Port</SelectItem>
                                                <SelectItem value={Side.STARBOARD}>Starboard</SelectItem>
                                                <SelectItem value={Side.BOTH}>Both</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{athlete.coxswain ? 'Coxswain' : 'Rower'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No athletes found for this season.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
