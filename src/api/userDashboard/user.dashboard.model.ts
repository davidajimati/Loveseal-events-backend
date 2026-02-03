import {number, string, z} from 'zod';

interface dependantData {
    dependantId: string;
    dependantName: string;
    dependantAge: number;
}

interface dashboardInterface {
    userId: string;
    regId: string;
    firstName: string;
    attendanceType: string;
    mealTicket: boolean;
    eventData: {
        eventId: string;
        eventTitle: string;
        date: Date;
        venue: string;
    };
    accommodation: {
        requiresAccommodation: boolean;
        paidForAccommodation: boolean;
        amountPaidForAccommodation?: number;
        accommodationType?: string;
        room: string;
        accommodationImageUrl: string
    };
    dependants: {
        dependantCount: number;
        dependantsData: [dependantData];
    }
}

const dependantSchema = z.object({
    eventId: z.uuid("eventId must be provided"),
    name: z.string().min(3, "name too short"),
    age: z.int("age is required"),
    gender: z.enum(["MALE", "FEMALE"], "gender can either be 'FEMALE' or 'MALE'"),
})

type dependantType = z.infer<typeof dependantSchema>;


const bookAccommodationSchema = z.object({})
type bookAccommodationType = z.infer<typeof bookAccommodationSchema>;


const payForDependantSchema = z.object({
    dependantId: z.uuid("dependantId cannot be null"),
    parentRegId: z.uuid("parentRegId cannot be null"),
})
type payForDependantType = z.infer<typeof payForDependantSchema>;

export {
    dependantSchema,
    bookAccommodationSchema,
    payForDependantSchema,
    type dependantType,
    type bookAccommodationType,
    type payForDependantType,
    type dashboardInterface
}