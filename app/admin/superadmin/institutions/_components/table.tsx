"use client";

import { DataTable } from "@/components/ui/data-table";
import { Employee, Institution } from "@prisma/client";
import { toast } from "sonner";
import { columns } from "../columns";
import { CreateForm } from "./create-form";
import { useQuery } from "@/hook/useQuery";

interface InstitutionWithEmployees extends Institution {
  employees: Employee[];
}

export function InstitutionTableClient({
  data,
}: {
  data: InstitutionWithEmployees[];
}) {
  const { mutation: createInstitution } = useQuery(
    "institutions",
    "institutions"
  );
  const handleSubmit = async (values: {
    name: string;
    address: string;
    phone: string;
  }) => {
    try {
      await createInstitution(values);
      toast.success("Data lembaga berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan lembaga");
      console.error("Error adding institution:", err);
    }
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      addButtonText="Tambah Institusi"
      formContent={<CreateForm onSubmit={handleSubmit} />}
    />
  );
}
