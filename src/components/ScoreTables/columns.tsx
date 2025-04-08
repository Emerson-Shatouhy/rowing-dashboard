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
        cell: ({ row }) => (
            <div className="min-w-24 text-center flex items-center max-w-32 truncate">
                <span className="truncate">
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
        header: "Machine Type",
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
        id: "averageSplit",
        accessorKey: "averageSplit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-center"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Average Split
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const averageSplit = calculateAverageSplit(row.original.splits);
            return <div className="text-center">{formatTime(averageSplit)}</div>;
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
    {
        id: "expand",
        header: "",
        cell: ({ row }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => row.toggleExpanded()}
                >
                    {row.getIsExpanded() ? "Hide" : "Show"}
                </Button>
            </div>
        ),
    },
]