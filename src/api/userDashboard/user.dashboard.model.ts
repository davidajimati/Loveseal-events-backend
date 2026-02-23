import {number, string, z} from 'zod';

interface dependantData {
    dependantId: string;
    dependantName: string;
    dependantAge: number;
    dependantGender: string;
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
        venue?: string;
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
        dependantsData: dependantData[];
    }
}

const dependantSchema = z.object({
    eventId: z.string("eventId must be provided"),
    regId: z.string("regId must be provided"),
    name: z.string().min(3, "name too short"),
    age: z.number().int("age must be an integer"),
    gender: z.enum(["MALE", "FEMALE"])
});

const dependantsSchema = z.array(dependantSchema);

type dependantType = z.infer<typeof dependantSchema>;
type dependantsType = z.infer<typeof dependantsSchema>;


const bookAccommodationSchema = z.object({})
type bookAccommodationType = z.infer<typeof bookAccommodationSchema>;


const payForDependantSchema = z.object({
    dependantId: z.string("dependantId cannot be null"),
    parentRegId: z.string("parentRegId cannot be null"),
})

const payForAllDependantSchema = z.object({
  parentRegId: z.string("parentRegId cannot be null"),
});
type payForDependantType = z.infer<typeof payForDependantSchema>;
type payForAllDependantType = z.infer<typeof payForAllDependantSchema>;

export {
    dependantSchema,
    bookAccommodationSchema,
    payForAllDependantSchema,
    payForDependantSchema,
    dependantsSchema,
    type dependantType,
    type payForAllDependantType,
    type dependantsType,
    type bookAccommodationType,
    type payForDependantType,
    type dashboardInterface
}