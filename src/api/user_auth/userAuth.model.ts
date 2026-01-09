import {z} from "zod";

const generateOtpSchema = z.object({
    email: z.email("invalid email").trim().lowercase()
})

const validateOtpSchema = z.object({
    email: z.email("A valid email must be provided").trim().lowercase(),
    otp: z.string().trim(),
    otpReference: z.string().trim(),
})

type otpValidationType = z.infer<typeof validateOtpSchema>

interface userInformationInterface {
    userId: string
    email: string
    firstName: string
    lastName: string
    emailVerified: Boolean
    phoneNumber: string
    gender: string
    ageRange: string
    localAssembly: string
    maritalStatus: string
    createdAt: string
    updatedAt: string
    employmentStatus: string
    stateOfResidence: string
    eventRegistrations: []
    paymentRecords: []
}

export {
    generateOtpSchema,
    validateOtpSchema
};
export type {
    otpValidationType,
    userInformationInterface,
};
