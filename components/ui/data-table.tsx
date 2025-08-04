"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    onPageChange?: (page: number) => void;
    filterColumn?: string;
    addButtonText?: string;
    formContent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    onPageChange,
    filterColumn,
    addButtonText = "Tambah",
    formContent,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                {filterColumn && (
                    <Input
                        placeholder={`Filter ${filterColumn}s...`}
                        value={
                            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn(filterColumn)
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
                {formContent && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="ml-auto" variant="default">
                                {addButtonText}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{addButtonText}</DialogTitle>
                            </DialogHeader>
                            {formContent ? formContent : <div>Form belum ditentukan</div>}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada hasil.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2 flex items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(pagination!.current_page - 1)}
                        disabled={pagination?.current_page === 1}
                    >
                        Sebelumnya
                    </Button>
                    {pagination && (
                        <>
                            {pagination.last_page > 1 && (() => {
                                const pages = [];
                                const { current_page, last_page } = pagination;
                                const maxPagesToShow = 5;
                                let start = Math.max(1, current_page - 2);
                                let end = Math.min(last_page, current_page + 2);

                                if (current_page <= 3) {
                                    end = Math.min(last_page, maxPagesToShow);
                                } else if (current_page >= last_page - 2) {
                                    start = Math.max(1, last_page - maxPagesToShow + 1);
                                }

                                if (start > 1) {
                                    pages.push(
                                        <Button
                                            key={1}
                                            variant={current_page === 1 ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => onPageChange?.(1)}
                                        >
                                            1
                                        </Button>
                                    );
                                    if (start > 2) {
                                        pages.push(<span key="start-ellipsis">...</span>);
                                    }
                                }

                                for (let i = start; i <= end; i++) {
                                    pages.push(
                                        <Button
                                            key={i}
                                            variant={current_page === i ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => onPageChange?.(i)}
                                        >
                                            {i}
                                        </Button>
                                    );
                                }

                                if (end < last_page) {
                                    if (end < last_page - 1) {
                                        pages.push(<span key="end-ellipsis">...</span>);
                                    }
                                    pages.push(
                                        <Button
                                            key={last_page}
                                            variant={current_page === last_page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => onPageChange?.(last_page)}
                                        >
                                            {last_page}
                                        </Button>
                                    );
                                }

                                return pages;
                            })()}
                        </>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(pagination!.current_page + 1)}
                        disabled={pagination?.current_page === pagination?.last_page}
                    >
                        Berikutnya
                    </Button>
                </div>
            </div>
        </div>
    );
}