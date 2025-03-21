"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Scores } from "@/lib/types/scores"
import { ArrowUpDown } from "lucide-react"
import { Button } from "./ui/button"

const formatTime = (ms: number | null) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

const formatSplits = (splits: [number]) => {
    if (!splits || !splits.length || !splits[0]) return '';
    return splits.map(split => formatTime(split)).join(' / ');
};

export const columns: ColumnDef<Scores>[] = [
    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },

        cell: ({ row }) => {
            return `${row.original.athlete.firstName} ${row.original.athlete.lastName}`
        }
    },
    {
        id: "lastName",
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
]