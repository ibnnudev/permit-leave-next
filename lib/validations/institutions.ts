import z from "zod";

export const institutionformSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(8),
});
