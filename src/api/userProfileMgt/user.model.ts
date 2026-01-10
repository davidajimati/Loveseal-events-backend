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
    email: z.string().email(),
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
    email: z.string().email().optional(),
    firstName: z.string().min(3).optional(),
    lastName: z.string().min(3).optional(),
    phoneNumber: z.string().optional(),
    gender: GenderEnum.optional(),
    ageRange: z.string().nullable().optional(),
    localAssembly: z.string().nullable().optional(),
    maritalStatus: MaritalStatusEnum.nullable().optional(),
    employmentStatus: EmploymentStatusEnum.nullable().optional(),
    stateOfResidence: z.string().nullable().optional(),
    emailVerified: z.boolean().optional(),
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
