import { clearLotStatusesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";
export function addLotStatus(lotStatusForm, requestSession) {
    const lotStatusId = addRecord("LotStatuses", lotStatusForm.lotStatus, lotStatusForm.orderNumber || -1, requestSession);
    clearLotStatusesCache();
    return lotStatusId;
}
export default addLotStatus;
