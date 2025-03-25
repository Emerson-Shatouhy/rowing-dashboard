"use client"
import React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { SplitGraph } from "./SplitGraph"

interface ExpandedRowProps {
    rowData: { splits: Array<number>; totalTime: number }
    athleteName: string
    columnsLength: number
}

export function ExpandedRow({ rowData, athleteName, columnsLength }: ExpandedRowProps) {
    return (
        <TableRow>

            <TableCell colSpan={columnsLength} className="bg-gray-100">
                <div className="p-4">
                    <SplitGraph
                        splits={rowData?.splits || []}
                        athleteName={athleteName}
                        totalTime={rowData?.totalTime}
                    />
                </div>
            </TableCell>
        </TableRow>
    )
}
