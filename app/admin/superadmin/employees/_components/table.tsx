import { DataTable } from "@/components/ui/data-table";
import { Employee } from "@prisma/client";
import { columns } from "../columns";
import { CreateForm } from "./create-form";

interface TableClientProps<TData extends Employee> {
    data: TData[];
    pagination?: Pagination;
    onPageChange?: (page: number) => void;
}

export function TableClient<TData extends Employee>({
    data,
    pagination,
    onPageChange,
}: TableClientProps<TData>) {
    return (
        <DataTable
            columns={columns}
            data={data}
            pagination={pagination}
            onPageChange={onPageChange}
            filterColumn="name"
            addButtonText="Tambah Karyawan"
            formContent={<CreateForm />}
        />
    );
}
