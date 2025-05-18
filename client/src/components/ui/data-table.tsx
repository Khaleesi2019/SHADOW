import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T | ((row: T) => React.ReactNode);
    className?: string;
    cell?: (row: T) => React.ReactNode;
  }[];
  onRowClick?: (row: T) => void;
  className?: string;
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  className,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className={cn("bg-dark-800 border border-gray-800 rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-dark-900">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={cn("text-sm text-gray-300 font-medium", column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <TableRow
                  key={i}
                  className={cn(
                    "hover:bg-dark-900/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, j) => (
                    <TableCell
                      key={j}
                      className={cn("py-3", column.className)}
                    >
                      {column.cell
                        ? column.cell(row)
                        : typeof column.accessorKey === "function"
                        ? column.accessorKey(row)
                        : String(row[column.accessorKey] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.pageCount > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0}
            className="bg-dark-900 border-gray-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-400">
            Page {pagination.pageIndex + 1} of {pagination.pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex + 1 === pagination.pageCount}
            className="bg-dark-900 border-gray-700"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
