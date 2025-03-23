'use client'
import { Scores } from "@/lib/types/scores"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDate, formatTime } from "@/utils/time/time"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"

interface ScoreTableProps {
    scores: Scores[]
}

export function MyScoreList({ scores }: ScoreTableProps) {
    const uniqueWorkoutTypes = Array.from(new Set(scores.map(score => score.type.name)));
    const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>('');

    useEffect(() => {
        if (uniqueWorkoutTypes.length > 0 && selectedWorkoutType === '') {
            setSelectedWorkoutType(uniqueWorkoutTypes[0]);
        }
    }, [uniqueWorkoutTypes, selectedWorkoutType]);

    const filteredScores = scores
        .filter(score =>
            selectedWorkoutType === '' || score.type.name === selectedWorkoutType
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const fastestTime = Math.min(...filteredScores.map(score => score.totalTime));

    return (
        <div className="w-full">
            <div className="mb-4">
                <Select onValueChange={setSelectedWorkoutType} value={selectedWorkoutType}>
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Total Time</TableHead>
                            <TableHead>Split</TableHead>
                            <TableHead>SPM</TableHead>
                            <TableHead>Watts</TableHead>
                            <TableHead>Weight(lbs)</TableHead>
                            <TableHead>Weight Adjusted</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredScores.map((score) => (
                            <TableRow
                                key={score.id}
                                className={score.totalTime === fastestTime ? "bg-green-100" : ""}
                            >
                                {/* @ts-expect-error cause i said so */}
                                <TableCell>{formatDate(score.date)}</TableCell>
                                <TableCell>{score.type.name}</TableCell>
                                <TableCell>{formatTime(score.totalTime)}</TableCell>
                                <TableCell>{formatTime(score.splits[0])}</TableCell>
                                <TableCell>{score.spm}</TableCell>
                                <TableCell>{score.averageWatts}</TableCell>
                                <TableCell>{score.weight}</TableCell>
                                <TableCell>{formatTime(score.weightAdjusted)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
