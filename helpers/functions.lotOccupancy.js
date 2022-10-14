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
export const getFeesByFeeCategory = (lotOccupancy, feeCategory, feeCategoryContains = false) => {
    const feeCategoryLowerCase = feeCategory.toLowerCase();
    const fees = lotOccupancy.lotOccupancyFees.filter((possibleFee) => {
        return feeCategoryContains
            ? possibleFee.feeCategory.toLowerCase().includes(feeCategoryLowerCase)
            : possibleFee.feeCategory.toLowerCase() === feeCategoryLowerCase;
    });
    return fees;
};
export const getTransactionTotal = (lotOccupancy) => {
    let transactionTotal = 0;
    for (const transaction of lotOccupancy.lotOccupancyTransactions) {
        transactionTotal += transaction.transactionAmount;
    }
    return transactionTotal;
};
