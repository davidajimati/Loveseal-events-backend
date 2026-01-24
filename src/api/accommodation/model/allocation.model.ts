import { z } from "zod";

const initiateAccommodationAllocationSchema = z.object({
  eventId: z.string().trim(),
  userId: z.string().trim(),
  facilityid: z.string().trim(),
});


type InitiateAccommodationAllocationType = z.infer<typeof initiateAccommodationAllocationSchema>;


export {
   initiateAccommodationAllocationSchema
};
export type {
  InitiateAccommodationAllocationType
};
