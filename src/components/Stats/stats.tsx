'use client'
import { Scores } from '@/lib/types/scores';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, Timer, Weight } from 'lucide-react';


interface StatsProps {
    scores: Scores[];
}

export default function Stats({ scores }: StatsProps) {
    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(1);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    const calculateAverageSplit = (splits: string[] | string) => {
        // Check if splits exist and have valid format
        if (!splits || !splits.length) return null;

        // Handle different possible formats of splits
        let validSplits = [];

        // If splits is an array of numbers or strings that can be converted to numbers
        if (Array.isArray(splits)) {
            validSplits = splits
                .map(split => {
                    // Convert string to number if needed
                    const numericSplit = typeof split === 'string' ? parseInt(split, 10) : split;
                    return isNaN(numericSplit) ? null : numericSplit;
                })
                .filter(split => split != null);
        }
        // If splits is a string (possibly concatenated values)
        else if (typeof splits === 'string' && splits.length > 0) {
            // Try to split the string into numeric values
            // This is a fallback and would need to be adjusted based on actual data format
            try {
                // Assuming a fixed length format (e.g., 6 digits per split)
                const splitLength = 6;
                for (let i = 0; i < splits.length; i += splitLength) {
                    if (i + splitLength <= splits.length) {
                        const splitValue = parseInt(splits.substring(i, i + splitLength), 10);
                        if (!isNaN(splitValue)) {
                            validSplits.push(splitValue);
                        }
                    }
                }
            } catch (e) {
                console.error('Error parsing splits string:', e);
            }
        }

        if (validSplits.length === 0) return null;

        // Sum all the splits and divide by count
        const sum = validSplits.reduce((total, split) => total + split, 0);
        return sum / validSplits.length;
    };

    const calculateAverages = () => {
        if (scores.length === 0) return { avgTime: "0:00.0", avgWAdj: "0:00.0", avgSplit: "0:00.0", avgWeight: 0, avgWatts: 0 };

        const validScores = scores.filter(score => score.totalTime !== null);
        const validWAdjScores = scores.filter(score => score.weightAdjusted !== null);
        const validWattsScores = scores.filter(score => score.averageWatts !== null && score.averageWatts !== undefined);

        if (validScores.length === 0) return { avgTime: "0:00.0", avgWAdj: "0:00.0", avgSplit: "0:00.0", avgWeight: 0, avgWatts: 0 };

        const avgTime = Math.round(validScores.reduce((acc, score) => acc + (score.totalTime || 0), 0) / validScores.length);
        const avgWAdj = Math.round(validWAdjScores.reduce((acc, score) => acc + (score.weightAdjusted || 0), 0) / validWAdjScores.length);
        const avgWatts = validWattsScores.length > 0
            ? Math.round(validWattsScores.reduce((acc, score) => {
                // Convert string watts to number
                const watts = typeof score.averageWatts === 'string'
                    ? parseFloat(score.averageWatts)
                    : (score.averageWatts || 0);
                return acc + watts;
            }, 0) / validWattsScores.length)
            : 0;

        // Get all splits from valid scores
        let allSplits: number[] = [];
        validScores.forEach(score => {
            if (score.splits && Array.isArray(score.splits)) {
                allSplits = [...allSplits, ...score.splits];
            } else if (score.splits && typeof score.splits === 'string') {
                allSplits.push(score.splits);
            }
        });

        // Calculate average split using the dedicated function
        // @ts-expect-error cause i said so
        const avgSplitMs = calculateAverageSplit(allSplits);
        const avgSplit = avgSplitMs ? formatTime(avgSplitMs) : "0:00.0";

        return {
            avgWeight: Math.round(validScores.reduce((acc, score) => acc + (score.weight || 0), 0) / validScores.length),
            avgTime: formatTime(avgTime),
            avgWAdj: formatTime(avgWAdj),
            avgSplit: avgSplit,
            avgWatts: avgWatts
        };
    };

    const stats = calculateAverages();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" >
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Average Split</CardTitle>
                    <Activity className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgSplit}</div>
                    <div className="text-sm text-muted-foreground">per 500m</div>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Average Weight Adjusted</CardTitle>
                    <Weight className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgWAdj}</div>
                    <div className="text-sm text-muted-foreground">{stats.avgWeight} lbs</div>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Average Total Time</CardTitle>
                    <Timer className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgTime}</div>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Average Watts</CardTitle>
                    <Activity className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgWatts}</div>
                    <div className="text-sm text-muted-foreground">per stroke</div>
                </CardContent>
            </Card>
        </div>
    );
}
