import { clearLotTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";
export function updateLotType(lotTypeForm, requestSession) {
    const success = updateRecord("LotTypes", lotTypeForm.lotTypeId, lotTypeForm.lotType, requestSession);
    clearLotTypesCache();
    return success;
}
export default updateLotType;
