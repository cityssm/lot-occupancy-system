import { clearLotTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";
export function addLotType(lotTypeForm, requestSession) {
    const lotTypeId = addRecord("LotTypes", lotTypeForm.lotType, lotTypeForm.orderNumber || -1, requestSession);
    clearLotTypesCache();
    return lotTypeId;
}
export default addLotType;
