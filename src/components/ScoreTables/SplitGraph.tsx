"use client"

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, LabelList, Legend } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface SplitGraphProps {
    splits: string[] | number[];
    athleteName: string;
    totalTime?: number | null;
}

export function SplitGraph({ splits, athleteName }: SplitGraphProps) {
    if (!splits || splits.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Split Graph</CardTitle>
                    <CardDescription>
                        No split data available for {athleteName}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        No data to display
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Convert all splits to numbers
    const numericSplits = splits.map(split => Number(split));

    // Calculate global statistics
    const average = numericSplits.reduce((acc, curr) => acc + curr, 0) / numericSplits.length;

    // Calculate standard deviation
    const squaredDiffs = numericSplits.map(split => Math.pow(split - average, 2));
    const avgSquaredDiff = squaredDiffs.reduce((acc, curr) => acc + curr, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(avgSquaredDiff);

    // Find min and max splits
    const minSplit = Math.min(...numericSplits);
    const maxSplit = Math.max(...numericSplits);

    // Create chart data with raw splits, no conversions
    const chartData = numericSplits.map((split, index) => {
        // Calculate running average up to this split
        const splitValues = numericSplits.slice(0, index + 1);
        const sum = splitValues.reduce((acc, curr) => acc + curr, 0);
        const runningAverage = sum / splitValues.length;

        return {
            splitNumber: `Split ${index + 1}`,
            time: split,
            runningAverage: runningAverage,
            upperBand: average + stdDev,
            lowerBand: average - stdDev
        };
    });

    // Format milliseconds to MM:SS.SS
    const formatTime = (ms: number) => {
        const totalSeconds = ms / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{athleteName}&apos;s Split Times</CardTitle>
                <CardDescription>
                    {splits.length} splits | Avg: {formatTime(average)} |
                    StdDev: ±{formatTime(stdDev)} |
                    Range: {formatTime(maxSplit - minSplit)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">

                    <LineChart
                        width={500}
                        height={200}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="splitNumber" />
                        <YAxis
                            domain={[
                                (dataMin: number) => (Math.floor(dataMin / 1000) * 1000) - 1000,
                                (dataMax: number) => (Math.ceil(dataMax / 1000) * 1000) + 1000
                            ]}
                            tickFormatter={(value: number) => formatTime(value)}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => {
                                if (name === "upperBand") return [`+1 StdDev: ${formatTime(value)}`];
                                if (name === "lowerBand") return [`-1 StdDev: ${formatTime(value)}`];
                                return [formatTime(value)];
                            }}
                            labelFormatter={(label) => `${label}`}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{
                                paddingTop: "10px",
                                fontWeight: "500",
                                fontSize: "12px"
                            }}
                        />
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                        />
                        <Line
                            type="natural"
                            dataKey="time"
                            stroke="rgb(0, 123, 255)"
                            activeDot={{ r: 8 }}
                            name="Split Time"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="runningAverage"
                            stroke="#82ca9d"
                            strokeDasharray="5 5"
                            name="Running Average"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </div>
            </CardContent>
        </Card>
    )
}