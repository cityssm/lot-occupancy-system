import { clearLotTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddLotTypeForm {
    lotType: string;
    orderNumber?: number;
}

export function addLotType(lotTypeForm: AddLotTypeForm, requestSession: recordTypes.PartialSession): number {
    const lotTypeId = addRecord(
        "LotTypes",
        lotTypeForm.lotType,
        lotTypeForm.orderNumber || -1,
        requestSession
    );

    clearLotTypesCache();

    return lotTypeId;
}

export default addLotType;
