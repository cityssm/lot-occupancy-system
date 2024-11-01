export function filterOccupantsByLotOccupantType(lotOccupancy, lotOccupantType) {
    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();
    return (lotOccupancy.lotOccupancyOccupants ?? []).filter((possibleOccupant) => possibleOccupant.lotOccupantType.toLowerCase() ===
        lotOccupantTypeLowerCase);
}
export function getFieldValueByOccupancyTypeField(lotOccupancy, occupancyTypeField) {
    const occupancyTypeFieldLowerCase = occupancyTypeField.toLowerCase();
    const field = (lotOccupancy.lotOccupancyFields ?? []).find((possibleField) => possibleField.occupancyTypeField.toLowerCase() ===
        occupancyTypeFieldLowerCase);
    if (field === undefined) {
        return undefined;
    }
    return field.lotOccupancyFieldValue;
}
export function getFeesByFeeCategory(lotOccupancy, feeCategory, feeCategoryContains = false) {
    const feeCategoryLowerCase = feeCategory.toLowerCase();
    return (lotOccupancy.lotOccupancyFees ?? []).filter((possibleFee) => feeCategoryContains
        ? possibleFee.feeCategory
            .toLowerCase()
            .includes(feeCategoryLowerCase)
        : possibleFee.feeCategory.toLowerCase() ===
            feeCategoryLowerCase);
}
export function getTransactionTotal(lotOccupancy) {
    let transactionTotal = 0;
    for (const transaction of lotOccupancy.lotOccupancyTransactions ?? []) {
        transactionTotal += transaction.transactionAmount;
    }
    return transactionTotal;
}
