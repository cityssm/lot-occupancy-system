import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveLotOccupantTypeDown(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordDown("LotOccupantTypes", lotOccupantTypeId);
    return success;
}

export function moveLotOccupantTypeDownToBottom(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("LotOccupantTypes", lotOccupantTypeId);
    return success;
}

export default moveLotOccupantTypeDown;
