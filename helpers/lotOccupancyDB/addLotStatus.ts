import { clearLotStatusesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddLotStatusForm {
    lotStatus: string;
    orderNumber?: number;
}

export function addLotStatus(
    lotStatusForm: AddLotStatusForm,
    requestSession: recordTypes.PartialSession
): number {
    const lotStatusId = addRecord(
        "LotStatuses",
        lotStatusForm.lotStatus,
        lotStatusForm.orderNumber || -1,
        requestSession
    );

    clearLotStatusesCache();

    return lotStatusId;
}

export default addLotStatus;
