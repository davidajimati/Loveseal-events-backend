import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Loveseal Events API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: "/" }],
    tags: [
      {
        name: "Health",
        description: "Health check endpoint",
      },
      {
        name: "UserAuth",
        description: "User authentication (OTP + token verification)",
      },
      {
        name: "User Profile Management",
        description: "User profile management operations",
      },
      {
        name: "User Dashboard",
        description:
          "User dashboard operations including dependants and accommodation booking",
      },
      {
        name: "AdminAuth",
        description: "Admin authentication (OTP + token verification)",
      },
      {
        name: "Admin Profile Management",
        description: "Admin user profile management operations",
      },
      {
        name: "Events",
        description: "Event management operations",
      },
      {
        name: "Event Registrations",
        description: "Event registration management operations",
      },
      {
        name: "Accommodation",
        description:
          "Accommodation, facilities, hotels, and hostels management",
      },
      {
        name: "Accommodation Allocation",
        description: "Accommodation allocation and booking operations",
      },
      {
        name: "Billing",
        description: "Payment processing and verification operations",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          required: ["code", "message", "data"],
          properties: {
            code: { type: "string", example: "00" },
            message: { type: "string", example: "Success" },
            data: {},
          },
        },

        // Auth (User/Admin)
        GenerateOtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
        },
        ValidateOtpRequest: {
          type: "object",
          required: ["email", "otp", "otpReference"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            otp: { type: "string", example: "123456" },
            otpReference: { type: "string", example: "ref_abc123" },
          },
        },
        RegistrantOtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "registrant@example.com",
            },
          },
        },

        // User profile
        CreateUserProfileRequest: {
          type: "object",
          required: ["email", "firstName", "lastName", "phoneNumber", "gender"],
          properties: {
            email: { type: "string", format: "email" },
            firstName: { type: "string", minLength: 3 },
            lastName: { type: "string", minLength: 3 },
            phoneNumber: { type: "string" },
            gender: { type: "string", enum: ["MALE", "FEMALE"] },
            ageRange: { type: "string", nullable: true },
            localAssembly: { type: "string", nullable: true },
            maritalStatus: {
              type: "string",
              enum: ["SINGLE", "MARRIED", "SEPARATED", "DIVORCED", "WIDOWED"],
              nullable: true,
            },
            employmentStatus: {
              type: "string",
              enum: ["EMPLOYED", "UNEMPLOYED", "SELF_EMPLOYED"],
              nullable: true,
            },
            stateOfResidence: { type: "string", nullable: true },
          },
        },
        UpdateUserProfileRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            emailVerified: { type: "boolean" },
            phoneNumber: { type: "string" },
            gender: { type: "string", enum: ["MALE", "FEMALE"] },
            country: { type: "string" },
            ageRange: { type: "string" },
            minister: { type: "boolean" },
            localAssembly: { type: "string" },
            maritalStatus: {
              type: "string",
              enum: ["SINGLE", "MARRIED", "SEPARATED", "DIVORCED", "WIDOWED"],
            },
            employmentStatus: {
              type: "string",
              enum: ["EMPLOYED", "UNEMPLOYED", "SELF_EMPLOYED"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            stateOfResidence: { type: "string" },
            residentialAddress: { type: "string" },
          },
        },

        // Admin profile
        CreateAdminUserRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "role"],
          properties: {
            firstName: { type: "string", minLength: 1 },
            lastName: { type: "string", minLength: 1 },
            email: { type: "string", format: "email" },
            role: {
              type: "string",
              enum: [
                "ADMIN",
                "SPECTATOR",
                "EVENT_MANAGER",
                "FINANCE_ADMIN",
                "ACCOMMODATION_ADMIN",
              ],
            },
            userName: { type: "string", minLength: 3 },
          },
        },
        UpdateAdminUserRequest: {
          type: "object",
          properties: {
            firstName: { type: "string", minLength: 1 },
            lastName: { type: "string", minLength: 1 },
            role: {
              type: "string",
              enum: [
                "ADMIN",
                "SPECTATOR",
                "EVENT_MANAGER",
                "FINANCE_ADMIN",
                "ACCOMMODATION_ADMIN",
              ],
            },
            userName: { type: "string", minLength: 3 },
          },
        },

        // Events
        CreateEventRequest: {
          type: "object",
          required: [
            "tenantId",
            "eventOwnerId",
            "eventYear",
            "eventName",
            "startDate",
            "endDate",
            "eventStatus",
            "registrationOpenAt",
            "registrationCloseAt",
          ],
          properties: {
            tenantId: { type: "string", minLength: 1 },
            eventOwnerId: { type: "string", minLength: 1 },
            eventYear: { type: "string", minLength: 4, example: "2026" },
            eventName: { type: "string", minLength: 3 },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            eventStatus: {
              type: "string",
              enum: ["DRAFT", "ACTIVE", "CLOSED"],
            },
            accommodationNeeded: { type: "boolean", default: false },
            registrationOpenAt: { type: "string", format: "date-time" },
            registrationCloseAt: { type: "string", format: "date-time" },
          },
        },
        UpdateEventRequest: {
          type: "object",
          properties: {
            eventName: { type: "string", minLength: 3 },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            eventStatus: {
              type: "string",
              enum: ["DRAFT", "ACTIVE", "CLOSED"],
            },
            accommodationNeeded: { type: "boolean" },
            registrationOpenAt: { type: "string", format: "date-time" },
            registrationCloseAt: { type: "string", format: "date-time" },
          },
        },

        // Event registrations
        CreateEventRegistrationRequestUser: {
          type: "object",
          required: ["eventId", "participationMode", "accommodationType"],
          properties: {
            eventId: { type: "string", format: "uuid" },
            participationMode: {
              type: "string",
              enum: ["CAMPER", "ATTENDEE", "ONLINE"],
            },
            accommodationType: {
              type: "string",
              enum: ["HOSTEL", "HOTEL", "NONE"],
            },
          },
        },
        CreateEventRegistrationRequestAdmin: {
          type: "object",
          required: [
            "userId",
            "eventId",
            "participationMode",
            "accommodationType",
          ],
          properties: {
            userId: { type: "string", format: "uuid" },
            eventId: { type: "string", format: "uuid" },
            participationMode: {
              type: "string",
              enum: ["CAMPER", "ATTENDEE", "ONLINE"],
            },
            accommodationType: {
              type: "string",
              enum: ["HOSTEL", "HOTEL", "NONE"],
            },
          },
        },
        UpdateEventRegistrationRequest: {
          type: "object",
          properties: {
            userId: { type: "string", format: "uuid" },
            eventId: { type: "string", format: "uuid" },
            participationMode: {
              type: "string",
              enum: ["CAMPER", "ATTENDEE", "ONLINE"],
            },
            initiator: { type: "string", enum: ["USER", "ADMIN"] },
            accommodationType: {
              type: "string",
              enum: ["HOSTEL", "HOTEL", "NONE"],
            },
          },
        },

        // Accommodation
        CreateAccommodationFacilityRequest: {
          type: "object",
          required: [
            "eventId",
            "facilityName",
            "accommodationCategoryId",
            "available",
            "employedUserPrice",
            "selfEmployedUserPrice",
            "unemployedUserPrice",
            "totalCapacity",
          ],
          properties: {
            eventId: { type: "string" },
            facilityName: { type: "string" },
            accommodationCategoryId: { type: "string" },
            available: { type: "boolean" },
            employedUserPrice: { type: "number", minimum: 0 },
            selfEmployedUserPrice: { type: "number", minimum: 0 },
            unemployedUserPrice: { type: "number", minimum: 0 },
            totalCapacity: { type: "number", minimum: 0 },
          },
        },
        CreateAccommodationCategoryRequest: {
          type: "array",
          items: {
            type: "object",
            required: ["name"],
            properties: { name: { type: "string" } },
          },
        },
        CreateHostelAccommodationRequest: {
          type: "object",
          required: [
            "facilityId",
            "roomCode",
            "roomIdentifier",
            "capacity",
            "genderRestriction",
            "adminReserved",
          ],
          properties: {
            facilityId: { type: "string" },
            roomCode: { type: "string" },
            roomIdentifier: { type: "string" },
            capacity: { type: "number", minimum: 0 },
            genderRestriction: { type: "string", enum: ["MALE", "FEMALE"] },
            adminReserved: { type: "boolean" },
          },
        },
        CreateHotelAccommodationRequest: {
          type: "object",
          required: [
            "facilityId",
            "hotelCode",
            "hotelIdentifier",
            "address",
            "description",
            "available",
            "genderRestriction",
            "adminReserved",
            "price",
            "noOfRoomsAvailable",
          ],
          properties: {
            facilityId: { type: "string" },
            hotelCode: { type: "string" },
            hotelIdentifier: { type: "string" },
            address: { type: "string" },
            description: { type: "string" },
            available: { type: "boolean" },
            genderRestriction: { type: "string", enum: ["MALE", "FEMALE"] },
            adminReserved: { type: "boolean" },
            price: { type: "number", minimum: 0 },
            noOfRoomsAvailable: { type: "number", minimum: 0 },
          },
        },

        // Dashboard
        AddDependantRequest: {
          type: "object",
          required: ["eventId", "name", "age", "gender"],
          properties: {
            eventId: { type: "string", format: "uuid" },
            name: { type: "string", minLength: 3 },
            age: { type: "string" },
            gender: { type: "string", enum: ["MALE", "FEMALE"] },
          },
        },
        PayForDependantRequest: {
          type: "object",
          required: ["dependantId", "parentRegId"],
          properties: {
            dependantId: { type: "string", format: "uuid" },
            parentRegId: { type: "string", format: "uuid" },
          },
        },
        BookAccommodationRequest: {
          type: "object",
          additionalProperties: false,
        },

        // Billing
        PaymentStatusWebhook: {
          type: "object",
          required: ["event", "data"],
          properties: {
            event: { type: "string", example: "charge.success" },
            data: {
              type: "object",
              required: [
                "reference",
                "currency",
                "amount",
                "fee",
                "status",
                "payment_method",
              ],
              properties: {
                reference: { type: "string", example: "ref_abc123" },
                currency: { type: "string", example: "NGN" },
                amount: { type: "number", example: 5000 },
                fee: { type: "number", example: 100 },
                status: {
                  type: "string",
                  enum: ["success", "failed"],
                  example: "success",
                },
                payment_method: { type: "string", example: "card" },
                payment_reference: { type: "string" },
              },
            },
          },
        },
        InitiatePaymentRequest: {
          type: "object",
          required: ["amount", "userId", "eventId", "reference"],
          properties: {
            amount: { type: "number", minimum: 0 },
            userId: { type: "string", format: "uuid" },
            eventId: { type: "string", format: "uuid" },
            reference: { type: "string" },
            reason: { type: "string" },
            narration: { type: "string" },
          },
        },
        InitiatePaymentResponse: {
          type: "object",
          required: ["reference", "checkoutUrl"],
          properties: {
            reference: { type: "string" },
            checkoutUrl: { type: "string", format: "uri" },
          },
        },

        // Allocation
        InitiateAccommodationAllocationRequest: {
          type: "object",
          required: ["eventId", "userId", "facilityid"],
          properties: {
            eventId: { type: "string" },
            userId: { type: "string" },
            facilityid: { type: "string" },
          },
        },

        InitiateHotelAllocationRequest: {
          type: "object",
          required: ["roomTypeId", "eventId", "userId", "facilityId"],
          properties: {
            roomTypeId: { type: "string" },
            eventId: { type: "string" },
            userId: { type: "string" },
            facilityid: { type: "string" },
          },
        },
      },
    },
  },
  apis: [
    "./src/index.ts",
    "./src/api/accommodation/route/accommodation.routes.ts",
    "./src/api/accommodation/route/allocation.routes.ts",
    "./src/api/adminConsole/adminProfileMgt/admin.route.ts",
    "./src/api/authAdmin/adminAuth.route.ts",
    "./src/api/authUser/userAuth.route.ts",
    "./src/api/billing/route/billing.routes.ts",
    "./src/api/emailing/comms.routes.ts",
    "./src/api/events/route/event-registration.routes.ts",
    "./src/api/events/route/events.routes.ts",
    "./src/api/userDashboard/user.dashboard.route.ts",
    "./src/api/userProfileMgt/user.route.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiOptions = {
  swaggerOptions: {
    operationsSorter: (a: any, b: any) => {
      const order = ["get", "post", "put", "patch", "delete"];
      return (
        order.indexOf(a.get("method").toLowerCase()) -
        order.indexOf(b.get("method").toLowerCase())
      );
    },
  },
};
