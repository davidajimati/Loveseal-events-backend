import { z } from "zod";

const initiateAccommodationAllocationSchema = z.object({
  eventId: z.string().trim(),
  userId: z.string().trim(),
  facilityid: z.string().trim(),
});

const initiateHotelAllocationSchema = z.object({
  roomTypeId: z.string().trim(),
  eventId: z.string().trim(),
  userId: z.string().trim(),
  facilityId: z.string().trim(),
});

type InitiateAccommodationAllocationType = z.infer<
  typeof initiateAccommodationAllocationSchema
>;

type InitiateHotelAllocationType = z.infer<
  typeof initiateHotelAllocationSchema
>;

export { initiateAccommodationAllocationSchema, initiateHotelAllocationSchema };
export type {
  InitiateAccommodationAllocationType,
  InitiateHotelAllocationType,
};
