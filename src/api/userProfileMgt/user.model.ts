import {z} from "zod";

const GenderEnum = z.enum([
    "MALE",
    "FEMALE"
]);

const MaritalStatusEnum = z.enum([
    "SINGLE",
    "MARRIED",
    "SEPARATED",
    "DIVORCED",
    "WIDOWED",
]);

const EmploymentStatusEnum = z.enum([
    "EMPLOYED",
    "UNEMPLOYED",
    "SELF_EMPLOYED",
]);

const createUserSchema = z.object({
    email: z.email().toLowerCase(),
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    phoneNumber: z.string(),
    gender: GenderEnum,
    ageRange: z.string().nullable().optional(),
    localAssembly: z.string().nullable().optional(),
    maritalStatus: MaritalStatusEnum.nullable().optional(),
    employmentStatus: EmploymentStatusEnum.nullable().optional(),
    stateOfResidence: z.string().nullable().optional(),
});

const updateUserSchema = z.object({
    email: z.email().toLowerCase(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    emailVerified: z.boolean().optional(),
    phoneNumber: z.string().optional(),
    gender: GenderEnum.optional(),
    country: z.string().optional(),
    ageRange: z.string().optional(),
    minister: z.boolean().optional().default(false),
    localAssembly: z.string().optional(),
    maritalStatus: MaritalStatusEnum.optional(),
    employmentStatus: EmploymentStatusEnum.optional().default("EMPLOYED"),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    stateOfResidence: z.string().optional(),
    residentialAddress: z.string().optional()
});

type createUserType = z.infer<typeof createUserSchema>;
type updateUserType = z.infer<typeof updateUserSchema>;

export {
    createUserSchema,
    updateUserSchema
}
export type {
    createUserType,
    updateUserType
}
