"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Scores } from "@/lib/types/scores"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    formatTime,
    formatSplits,
    countSplits,
    calculateAverageSplit
} from "@/utils/time/time"
import { MachineIndicator } from "../indicator/indicator"
import { formatName } from "@/utils/athlete/athlete"

export const columns: ColumnDef<Scores>[] = [
    {
        id: "select",
        size: 40,
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="border-gray-400"

            />
        ),
        cell: ({ row }) => (
            <div className="text-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="border-gray-400"
                />
            </div>

        ),
    },
    {
        id: "name",
        header: "Name",
        size: 120,
        cell: ({ row }) => (
            <div className="w-full text-center flex items-center justify-center truncate px-1">
                <span className="truncate text-sm">
                    {formatName(
                        row.original.athlete.firstName,
                        row.original.athlete.lastName)
                    }
                </span>
            </div>
        ),
    },
    {
        id: "type",
        header: "Machine",
        size: 70,
        cell: ({ row }) => (
            <div className="text-center">
                <MachineIndicator machine={row.original.machineType} />

            </div>
        ),
        sortingFn: (rowA, rowB) => {
            const a = rowA.original.machineType;
            const b = rowB.original.machineType;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a.localeCompare(b);
        }
    },
    {
        id: "totalTime",
        accessorKey: "totalTime",
        size: 90,
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Time
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="text-center text-xs">{formatTime(row.original.totalTime)}</div>,
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
        size: 60,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Wt
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-center text-xs">{row.original.weight}</div>,
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
        size: 85,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Wt Adj
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-center text-xs">{formatTime(row.original.weightAdjusted)}</div>,
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
        size: 70,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Watts
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-center text-xs">{row.original.averageWatts}</div>,
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
        id: "averageSplit",
        accessorKey: "averageSplit",
        size: 80,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Split
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const averageSplit = calculateAverageSplit(row.original.splits);
            return <div className="text-center text-xs">{formatTime(averageSplit)}</div>;
        },
        sortingFn: (rowA, rowB) => {
            const totalTimeA = rowA.original.totalTime;
            const totalTimeB = rowB.original.totalTime;
            const splitCountA = countSplits(rowA.original.splits);
            const splitCountB = countSplits(rowB.original.splits);
            const dividerA = splitCountA > 0 ? splitCountA : 4;
            const dividerB = splitCountB > 0 ? splitCountB : 4;
            const a = totalTimeA ? totalTimeA / dividerA : null;
            const b = totalTimeB ? totalTimeB / dividerB : null;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
        },
    },
    {
        id: "splits",
        accessorKey: "splits",
        size: 150,
        header: "Splits",
        cell: ({ row }) => (
            <div className="text-center text-xs max-w-32 truncate" title={formatSplits(row.original.splits)}>
                {formatSplits(row.original.splits)}
            </div>
        ),
    },
    {
        id: "spm",
        accessorKey: "spm",
        size: 50,
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        SPM
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="text-center text-xs">{row.original.spm}</div>,
    },
    {
        id: "expand",
        size: 60,
        header: "",
        cell: ({ row }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-1"
                    onClick={() => row.toggleExpanded()}
                >
                    {row.getIsExpanded() ? "−" : "+"}
                </Button>
            </div>
        ),
    },
]