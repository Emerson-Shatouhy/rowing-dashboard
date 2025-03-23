"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Scores } from "@/lib/types/scores"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"


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

const countSplits = (splits: [number]) => {
    if (!splits || !splits.length) return 0;
    return splits.length;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateAverageSplit = (splits: any) => {
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
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
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
]