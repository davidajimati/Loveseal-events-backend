import { z } from "zod";

const createAccommodationFacilitySchema = z.object({
  eventId: z.string().trim(),
  facilityName: z.string().trim(),
  available: z.boolean(),
  employedUserPrice: z.number().min(0),
  selfEmployedUserPrice: z.number().min(0),
  unemployedUserPrice: z.number().min(0),
  totalCapacity: z.number().min(0),
});

type CreateAccommodationFacilityType = z.infer<
  typeof createAccommodationFacilitySchema
>;

export type { CreateAccommodationFacilityType };

export { createAccommodationFacilitySchema };
