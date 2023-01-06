import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveLotTypeDown(lotTypeId: number | string): boolean {
    const success = moveRecordDown("LotTypes", lotTypeId);
    return success;
}

export function moveLotTypeDownToBottom(lotTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("LotTypes", lotTypeId);
    return success;
}

export default moveLotTypeDown;
