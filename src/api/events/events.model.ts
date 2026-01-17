import { z } from "zod";

const EventStatusEnum = z.enum([
    "DRAFT",
    "ACTIVE",
    "CLOSED"
]);

const createEventSchema = z.object({
    tenantId: z.string().min(1),
    eventOwnerId: z.string().min(1),
    eventYear: z.string().min(4),
    eventName: z.string().min(3),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    eventStatus: EventStatusEnum,
    accommodationNeeded: z.boolean(),
    registrationOpenAt: z.coerce.date(),
    registrationCloseAt: z.coerce.date(),
});

const updateEventSchema = z.object({
    eventName: z.string().min(3).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    eventStatus: EventStatusEnum.optional(),
    accommodationNeeded: z.boolean().optional(),
    registrationOpenAt: z.coerce.date().optional(),
    registrationCloseAt: z.coerce.date().optional(),
});

type CreateEventType = z.infer<typeof createEventSchema>;
type UpdateEventType = z.infer<typeof updateEventSchema>;

export {
    createEventSchema,
    updateEventSchema
};
export type {
    CreateEventType,
    UpdateEventType
};
