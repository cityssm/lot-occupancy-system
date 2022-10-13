import type * as recordTypes from "../types/recordTypes";

export const filterOccupantsByLotOccupantType = (
    lotOccupancy: recordTypes.LotOccupancy,
    lotOccupantType: string
): recordTypes.LotOccupancyOccupant[] => {
    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();

    const occupants = lotOccupancy.lotOccupancyOccupants.filter((possibleOccupant) => {
        return possibleOccupant.lotOccupantType.toLowerCase() === lotOccupantTypeLowerCase;
    });

    return occupants;
};

export const getFieldValueByOccupancyTypeField = (
    lotOccupancy: recordTypes.LotOccupancy,
    occupancyTypeField: string
): string => {
    const occupancyTypeFieldLowerCase = occupancyTypeField.toLowerCase();

    const field = lotOccupancy.lotOccupancyFields.find((possibleField) => {
        return possibleField.occupancyTypeField.toLowerCase() === occupancyTypeFieldLowerCase;
    });

    if (field) {
        return field.lotOccupancyFieldValue;
    }

    return undefined;
};
