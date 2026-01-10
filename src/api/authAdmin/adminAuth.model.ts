interface adminUserInformationInterface {
    adminUserId: string
    tenantId: string
    firstName: string
    lastName: string
    email: string
    role: string
    userName: string
    eventsOwned: []
    dateCreated: Date
    updatedAt: Date
    eventsAdminRolesTracker: []
    paymentRecords: []
}

export type {
    adminUserInformationInterface,
};
