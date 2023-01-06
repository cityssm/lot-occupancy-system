import { clearLotTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateLotTypeForm {
    lotTypeId: number | string;
    lotType: string;
}

export function updateLotType(
    lotTypeForm: UpdateLotTypeForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const success = updateRecord("LotTypes", lotTypeForm.lotTypeId, lotTypeForm.lotType, requestSession);

    clearLotTypesCache();

    return success;
}

export default updateLotType;
