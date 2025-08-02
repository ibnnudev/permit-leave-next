import z from "zod";

export const leaveformSchema = z.object({
  employee_id: z.number().int().min(1, "Employee ID harus diisi"),
  leave_type_id: z.number().int().min(1, "Leave type harus diisi"),
  start_date: z.coerce.date({
    error: "Tanggal mulai tidak valid",
  }),
  end_date: z.coerce.date({ error: "Tanggal akhir tidak valid" }),
  reason: z.string().min(1, "Alasan cuti harus diisi"),
  last_processed_level: z
    .number()
    .int()
    .min(0, "Level terakhir proses harus diisi"),

  // Optional fields
  admin_notes: z.string().optional(),
  recorded_by: z.string().optional(),
  approved_by_id: z.number().int().optional(),
  document: z.string().optional(),

  // Optional input (bisa diisi atau pakai default)
  status: z.enum(["IN_PROCESS", "APPROVED", "REJECTED"]).optional(),
});
