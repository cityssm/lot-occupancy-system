import { clearLotStatusesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateLotStatusForm {
    lotStatusId: number | string;
    lotStatus: string;
}

export function updateLotStatus(
    lotStatusForm: UpdateLotStatusForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const success = updateRecord(
        "LotStatuses",
        lotStatusForm.lotStatusId,
        lotStatusForm.lotStatus,
        requestSession
    );

    clearLotStatusesCache();

    return success;
}

export default updateLotStatus;
