"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Scores } from "@/lib/types/scores"
import { ArrowUpDown } from "lucide-react"
import { Button } from "./ui/button"

const formatTime = (ms: number | null) => {
    if (!ms) return 'DNF';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

const formatSplits = (splits: [number]) => {
    if (!splits || !splits.length || !splits[0]) return '';
    return splits.map(split => formatTime(split)).join(' / ');
};

const calcAverageSplit = (splits: [number]) => {
    if (!splits || !splits.length || !splits[0]) return null;
    const total = splits.reduce((acc, split) => acc + split, 0);
    console.log('total', total);
    const average = total / splits.length;
    console.log('average', average);
    return formatTime(average);
}


export const columns: ColumnDef<Scores>[] = [
    {
        id: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="text-center">
                {`${row.original.athlete.firstName} ${row.original.athlete.lastName}`}
            </div>
        ),
    },
    {
        id: "totalTime",
        accessorKey: "totalTime",
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total Time
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="text-center">{formatTime(row.original.totalTime)}</div>,
        sortingFn: (rowA, rowB) => {
            const a = rowA.original.totalTime;
            const b = rowB.original.totalTime;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
        }
    },
    {
        id: "weight",
        accessorKey: "weight",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Weight
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-center">{row.original.weight}</div>,
        sortingFn: (rowA, rowB) => {
            const a = rowA.original.weight;
            const b = rowB.original.weight;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
        }
    },
    {
        id: "weightAdjusted",
        accessorKey: "weightAdjusted",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Weight Adjusted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-center">{formatTime(row.original.weightAdjusted)}</div>,
        sortingFn: (rowA, rowB) => {
            const a = rowA.original.weightAdjusted;
            const b = rowB.original.weightAdjusted;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
        },
    },
    {
        id: "averageWatts",
        accessorKey: "average",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-center"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Average Watts
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-center">{row.original.averageWatts}</div>,
        sortingFn: (rowA, rowB) => {
            const a = rowA.original.averageWatts;
            const b = rowB.original.averageWatts;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
        },
    },
    {
        id: "splits",
        accessorKey: "splits",
        header: "Splits",
        cell: ({ row }) => <div className="text-center">{formatSplits(row.original.splits)}</div>,
    },
    {
        id: "spm",
        accessorKey: "spm",
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        SPM
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="text-center">{row.original.spm}</div>,
    },
]