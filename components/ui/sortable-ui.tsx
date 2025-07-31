import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SortableHeader({
    column,
    label,
}: {
    column: any;
    label: string;
}) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}
