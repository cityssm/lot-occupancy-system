import { clearLotOccupantTypesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveLotOccupantTypeDown(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordDown("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}

export function moveLotOccupantTypeDownToBottom(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}

export default moveLotOccupantTypeDown;
