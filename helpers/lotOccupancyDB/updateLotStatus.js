import { clearLotStatusesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";
export function updateLotStatus(lotStatusForm, requestSession) {
    const success = updateRecord("LotStatuses", lotStatusForm.lotStatusId, lotStatusForm.lotStatus, requestSession);
    clearLotStatusesCache();
    return success;
}
export default updateLotStatus;
