export interface CarDetails {
    userIdentity: string,
    usagePurpose: number,
    vehicleValue: number,
    educationLevel: number,
    sonsNumber: number,
    childrenNumber: number,
    accidentsNumber: number,
    drivingLicenseRestrictions: number,
    parkingPlace: number,
    motionVector: number,
    kilometersNumber: number,
    trailerValue: string,
    vehicleModification: string,
    healthConditions: number,
    violations: number,
    ownerDriverLicenses: [
      {
        id: number,
        countryName: number,
        yearsNumber: number,
        ownerAdditionInfoId: number
      }
    ]
}
