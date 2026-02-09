export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  SEPARATED = "SEPARATED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export enum EmploymentStatus {
  UNEMPLOYED = "UNEMPLOYED",
  EMPLOYED = "EMPLOYED",
  SELF_EMPLOYED = "SELF_EMPLOYED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum EventStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}

export enum ParticipationMode {
  CAMPER = "CAMPER",
  ATTENDEE = "ATTENDEE",
  ONLINE = "ONLINE",
}

export enum AccommodationType {
  HOSTEL = "HOSTEL",
  HOTEL = "HOTEL",
  NONE = "NONE",
}

export enum RegistrationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

export enum AdminUserRoles {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  SPECTATOR = "SPECTATOR",
  EVENT_MANAGER = "EVENT_MANAGER",
  FINANCE_ADMIN = "FINANCE_ADMIN",
  ACCOMMODATION_ADMIN = "ACCOMMODATION_ADMIN",
}

export enum RegistrationInitiator {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum RoomAllocator {
  ADMIN = "ADMIN",
  ALGORITHM = "ALGORITHM",
}

export enum RoomAllocationStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  REVOKED = "REVOKED",
}

export const dependantPrice = 7000;
