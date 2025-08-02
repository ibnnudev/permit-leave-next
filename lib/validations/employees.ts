import { z } from "zod"
import { Role } from "@prisma/client"

export const employeeFormSchema = z.object({
    institution_id: z.number(),
    name: z.string(),
    gender: z.string(),
    position: z.string(),
    whatsapp_number: z.string(),
    address: z.string(),
    birth_place: z.string(),
    birth_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid birth_date",
    }),
    marital_status: z.string(),
    employment_status: z.string(),
    personal_email: z.string().email(),
    institution_email: z.string().email(),
    religion: z.string(),
    last_education: z.string(),
    role: z.nativeEnum(Role).optional(),
});
