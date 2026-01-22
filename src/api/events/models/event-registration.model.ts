import { z } from "zod";

const ParticipationModeEnum = z.enum([
    "CAMPER",
    "ATTENDEE",
    "ONLINE"
]);

const AccommodationTypeEnum = z.enum([
    "HOSTEL",
    "HOTEL",
    "NONE"
]);

const RegistrationStatusEnum = z.enum([
    "PENDING",
    "CONFIRMED",
    "CANCELLED"
]);

const RegistrationInitiatorEnum = z.enum([
    "USER",
    "ADMIN"
]);

const createEventRegistrationSchema = z.object({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
    participationMode: ParticipationModeEnum,
    initiator: RegistrationInitiatorEnum,
    accommodationType: AccommodationTypeEnum,
});

const updateEventRegistrationSchema = z.object({
    userId: z.string().uuid().optional(),
    eventId: z.string().uuid().optional(),
    participationMode: ParticipationModeEnum.optional(),
    initiator: RegistrationInitiatorEnum.optional(),
    accommodationType: AccommodationTypeEnum.optional(),
});

type CreateEventRegistrationType = z.infer<typeof createEventRegistrationSchema>;
type UpdateEventRegistrationType = z.infer<typeof updateEventRegistrationSchema>;

export {
    ParticipationModeEnum,
    AccommodationTypeEnum,
    RegistrationStatusEnum,
    RegistrationInitiatorEnum,
    createEventRegistrationSchema,
    updateEventRegistrationSchema,
};

export type {
    CreateEventRegistrationType,
    UpdateEventRegistrationType,
};
