import type * as recordTypes from "../types/recordTypes";

export const filterOccupantsByLotOccupantType = (
    lotOccupancy: recordTypes.LotOccupancy,
    lotOccupantType: string
): recordTypes.LotOccupancyOccupant[] => {
    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();

    const occupants = (lotOccupancy.lotOccupancyOccupants || []).filter((possibleOccupant) => {
        return (
            (possibleOccupant.lotOccupantType as string).toLowerCase() === lotOccupantTypeLowerCase
        );
    });

    return occupants;
};

export const getFieldValueByOccupancyTypeField = (
    lotOccupancy: recordTypes.LotOccupancy,
    occupancyTypeField: string
): string | undefined => {
    const occupancyTypeFieldLowerCase = occupancyTypeField.toLowerCase();

    const field = (lotOccupancy.lotOccupancyFields || []).find((possibleField) => {
        return (possibleField.occupancyTypeField as string).toLowerCase() === occupancyTypeFieldLowerCase;
    });

    if (field) {
        return field.lotOccupancyFieldValue;
    }

    return undefined;
};

export const getFeesByFeeCategory = (
    lotOccupancy: recordTypes.LotOccupancy,
    feeCategory: string,
    feeCategoryContains = false
) => {
    const feeCategoryLowerCase = feeCategory.toLowerCase();

    const fees = (lotOccupancy.lotOccupancyFees || []).filter((possibleFee) => {
        return feeCategoryContains
            ? (possibleFee.feeCategory as string).toLowerCase().includes(feeCategoryLowerCase)
            : (possibleFee.feeCategory as string).toLowerCase() === feeCategoryLowerCase;
    });

    return fees;
};

export const getTransactionTotal = (lotOccupancy: recordTypes.LotOccupancy) => {
    let transactionTotal = 0;

    for (const transaction of lotOccupancy.lotOccupancyTransactions) {
        transactionTotal += transaction.transactionAmount;
    }

    return transactionTotal;
};
