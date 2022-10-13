export const filterOccupantsByLotOccupantType = (lotOccupancy, lotOccupantType) => {
    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();
    const occupants = lotOccupancy.lotOccupancyOccupants.filter((possibleOccupant) => {
        return possibleOccupant.lotOccupantType.toLowerCase() === lotOccupantTypeLowerCase;
    });
    return occupants;
};
export const getFieldValueByOccupancyTypeField = (lotOccupancy, occupancyTypeField) => {
    const occupancyTypeFieldLowerCase = occupancyTypeField.toLowerCase();
    const field = lotOccupancy.lotOccupancyFields.find((possibleField) => {
        return possibleField.occupancyTypeField.toLowerCase() === occupancyTypeFieldLowerCase;
    });
    if (field) {
        return field.lotOccupancyFieldValue;
    }
    return undefined;
};
