import { z } from "zod";

const categoryEnum = z.enum(["HOSTEL", "HOTEL", "NONE", "SHARED_APARTMENT"]);

const createAccommodationFacilitySchema = z.object({
  eventId: z.string().trim(),
  facilityName: z.string().trim(),
  accommodationCategoryId: z.string().trim(),
  available: z.boolean(),
  employedUserPrice: z.number().min(0),
  selfEmployedUserPrice: z.number().min(0),
  unemployedUserPrice: z.number().min(0),
  totalCapacity: z.number().min(0),
});

const createAccommodationCategorySchema = z.object({
  eventId: z.string().trim(),
  categories: z.array(
    z.object({
      name: categoryEnum,
    }),
  ),
});

const createHostelAccommodationSchema = z.object({
  facilityId: z.string().trim(),
  roomCode: z.string().trim(),
  roomIdentifier: z.string().trim(),
  capacity: z.number().min(0),
  genderRestriction: z.enum(["MALE", "FEMALE"]),
  adminReserved: z.boolean(),
});

const createHotelAccommodationSchema = z.object({
  facilityId: z.string().trim(),
  roomType: z.string().trim(),
  address: z.string(),
  description: z.string().trim(),
  available: z.boolean(),
  genderRestriction: z.enum(["MALE", "FEMALE"]),
  adminReserved: z.boolean(),
  price: z.number().min(0),
  noOfRoomsAvailable: z.number().min(0),
});

const getFacilityObject =  z.object({
  categoryId: z.uuid("invalid categoryId").trim(),
  gender: z.enum(["MALE", "FEMALE"]),
  ageRange: z.enum(["0-12", "13-19", "20-22", "23-29", "30-39", "40+"]),
})

type CreateAccommodationFacilityType = z.infer<
  typeof createAccommodationFacilitySchema
>;
type CreateAccommodationCategoryType = z.infer<
  typeof createAccommodationCategorySchema
>;
type CreateHostelAccommodationType = z.infer<
  typeof createHostelAccommodationSchema
>;

type CreateHotelAccommodationType = z.infer<
  typeof createHotelAccommodationSchema
>;

type getFacilityType =  z.infer<typeof getFacilityObject>;

export type {
  CreateAccommodationFacilityType,
  CreateAccommodationCategoryType,
  CreateHostelAccommodationType,
  CreateHotelAccommodationType,
  getFacilityType
};

export {
  createAccommodationFacilitySchema,
  createAccommodationCategorySchema,
  createHostelAccommodationSchema,
  createHotelAccommodationSchema,
  getFacilityObject
};
