import {z} from 'zod';

const dependantSchema = z.object({
    name: z.string().min(3, "name too short"),
    age: z.string("age is required"),
    gender: z.enum(["MALE", "FEMALE"], "gender can either be 'FEMALE' or 'MALE'"),
})

type dependantType = z.infer<typeof dependantSchema>;


const bookAccommodationSchema = z.object({})
type bookAccommodationType = z.infer<typeof bookAccommodationSchema>;


const payForDependantSchema = z.object({
    dependantId: z.uuid("dependantId cannot be null"),
    parentRegId: z.uuid("parentRegId cannot be null"),
})

export {
    dependantSchema,
    bookAccommodationSchema,
    type dependantType,
    type bookAccommodationType
}