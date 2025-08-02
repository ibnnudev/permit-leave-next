import z from "zod";

export const leaveTypeFormSchema = z.object({
  name: z.string().min(1, "Nama jenis cuti harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  max_days: z.number().int().min(1, "Jumlah maksimal hari harus lebih dari 0"),
  require_document: z.boolean({
    error: "Harus dipilih apakah butuh dokumen atau tidak",
  }),
  hierarchical: z.boolean().optional(), // karena punya default value
});
