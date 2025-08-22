"use client"
import React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { SplitGraph } from "./SplitGraph"
import { AthleteHistory } from "./AthleteHistory"
import { Scores } from "@/lib/types/scores"

interface ExpandedRowProps {
    rowData: Scores
    athleteName: string
    columnsLength: number
}

export function ExpandedRow({ rowData, athleteName, columnsLength }: ExpandedRowProps) {
    return (
        <TableRow>
            <TableCell colSpan={columnsLength} className="bg-gray-50 p-0">
                <div className="w-full p-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Split Graph Section */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Current Test Splits
                                </h3>
                                <SplitGraph
                                    splits={rowData?.splits || []}
                                    athleteName={athleteName}
                                    totalTime={rowData?.totalTime}
                                />
                            </div>
                            
                            {/* Previous Times Section - Side by side */}
                            <div className="w-full lg:w-80 lg:min-w-80">
                                <h3 className="text-sm font-medium mb-3 text-gray-700">
                                    Previous {rowData.type.name} Times
                                </h3>
                                <AthleteHistory 
                                    athleteId={rowData.athlete.id}
                                    typeId={rowData.type.id}
                                    currentScoreId={rowData.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    )
}
