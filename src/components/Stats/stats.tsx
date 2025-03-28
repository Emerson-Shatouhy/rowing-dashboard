'use client'
import { Scores } from '@/lib/types/scores';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, Timer, Weight } from 'lucide-react';
import { formatTime, calculateAverageSplit } from '@/utils/time/time';

interface StatsProps {
    scores: Scores[];
}

export default function Stats({ scores }: StatsProps) {
    const calculateAverages = () => {
        if (scores.length === 0) return { avgTime: "0:00.0", avgWAdj: "0:00.0", avgSplit: "0:00.0", avgWeight: 0, avgWatts: 0 };

        const validScores = scores.filter(score => score.totalTime && score.totalTime > 0);
        const validWAdjScores = scores.filter(score => score.weightAdjusted && score.weightAdjusted > 0);
        const validWattsScores = scores.filter(score => score.averageWatts && score.averageWatts > 0);

        if (validScores.length === 0) return { avgTime: "0:00.0", avgWAdj: "0:00.0", avgSplit: "0:00.0", avgWeight: 0, avgWatts: 0 };

        const avgTime = Math.round(validScores.reduce((acc, score) => acc + (score.totalTime || 0), 0) / validScores.length);
        const avgWAdj = Math.round(validWAdjScores.reduce((acc, score) => acc + (score.weightAdjusted || 0), 0) / validWAdjScores.length);
        const avgWatts = validWattsScores.length > 0
            ? Math.round(validWattsScores.reduce((acc, score) => {
                const watts = typeof score.averageWatts === 'string'
                    ? parseFloat(score.averageWatts)
                    : (score.averageWatts || 0);
                return acc + watts;
            }, 0) / validWattsScores.length)
            : 0;

        let allSplits: number[] = [];
        validScores.forEach(score => {
            if (score.splits && Array.isArray(score.splits)) {
                allSplits = [...allSplits, ...score.splits.filter(split => split > 0)];
            } else if (score.splits && typeof score.splits === 'string' && parseFloat(score.splits) > 0) {
                allSplits.push(parseFloat(score.splits));
            }
        });

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
