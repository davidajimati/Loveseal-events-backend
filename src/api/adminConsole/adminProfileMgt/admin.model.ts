import {z} from "zod";

const adminRoles =  [
    "ADMIN", "SPECTATOR", "EVENT_MANAGER", "FINANCE_ADMIN", "ACCOMMODATION_ADMIN"
] as const ;

const CreateAdminUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(adminRoles),
    userName: z.string().min(3).optional(),
}).strict();

const ForbiddenFields = z.object({
    email: z.never({message: "Email cannot be updated"})
});

const UpdateAdminUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.enum(adminRoles).optional(),
    userName: z.string().min(3).optional(),
}).merge(ForbiddenFields)
    .strict();

type createAdminType = z.infer<typeof CreateAdminUserSchema>
type updateAdminType = z.infer<typeof UpdateAdminUserSchema>

export {
    CreateAdminUserSchema,
    UpdateAdminUserSchema
}

export type {
    createAdminType,
    updateAdminType
}