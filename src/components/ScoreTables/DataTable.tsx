/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    Row,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ExpandedRow } from "./ExpandedRow"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onSelectionChange?: (rows: TData[]) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onSelectionChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

    // Modify the columns to add row toggling functionality
    const columnsWithExpand = React.useMemo(() => {
        return columns.map(column => {
            // Check if it's the expand column
            if (column.id === 'expand') {
                return {
                    ...column,
                    cell: ({ row }: { row: Row<TData> }) => {
                        const originalCell = column.cell as any;
                        // Call the original cell renderer with toggle functionality
                        return originalCell({
                            row: {
                                ...row,
                                toggleExpanded: () => handleRowClick(row.id)
                            }
                        });
                    }
                };
            }
            return column;
        });
    }, [columns]);

    const table = useReactTable({
        data,
        columns: columnsWithExpand,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Handle row expansion toggle
    const handleRowClick = (rowId: string) => {
        setExpandedRows((prev) => {
            const newExpandedRows = new Set(prev)
            if (newExpandedRows.has(rowId)) {
                newExpandedRows.delete(rowId)
            } else {
                newExpandedRows.add(rowId)
            }
            return newExpandedRows
        })
    }

    React.useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
        onSelectionChange?.(selectedRows)
    }, [rowSelection])

    React.useEffect(() => {
        table.getRowModel().rows.forEach((row: Row<any>) => {
            Object.defineProperty(row, 'getIsExpanded', {
                value: () => expandedRows.has(row.id),
                configurable: true
            });
        });
    }, [expandedRows, table]);

    // Auto sort by totalTime when data changes
    React.useEffect(() => {
        setSorting([{ id: 'totalTime', desc: false }]);
    }, [data]);

    React.useEffect(() => {
        setExpandedRows(new Set());
    }, [data]);

    return (
        <div className="w-full">
            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-300">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead 
                                                key={header.id} 
                                                className="text-center bg-gray-300 px-2 py-3 text-xs sm:text-sm whitespace-nowrap"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, i) => {
                                    const isExpanded = expandedRows.has(row.id)
                                    // Get athlete data from the row
                                    const rowData = row.original as any;
                                    const athleteName = rowData?.athlete ?
                                        `${rowData.athlete.firstName} ${rowData.athlete.lastName}` :
                                        "Athlete";

                                    return (
                                        <React.Fragment key={row.id}>
                                            <TableRow
                                                data-state={row.getIsSelected() && "selected"}
                                                className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell 
                                                        key={cell.id}
                                                        className="px-2 py-3 text-xs sm:text-sm"
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            {isExpanded && (
                                                <ExpandedRow
                                                    rowData={rowData}
                                                    athleteName={athleteName}
                                                    columnsLength={columns.length}
                                                />
                                            )}
                                        </React.Fragment>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
