import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
interface AddLotOccupancyOccupantForm {
    lotOccupancyId: string | number;
    lotOccupantTypeId: string | number;
    occupantName: string;
    occupantFamilyName: string;
    occupantAddress1: string;
    occupantAddress2: string;
    occupantCity: string;
    occupantProvince: string;
    occupantPostalCode: string;
    occupantPhoneNumber: string;
    occupantEmailAddress: string;
    occupantComment?: string;
}
export declare function addLotOccupancyOccupant(lotOccupancyOccupantForm: AddLotOccupancyOccupantForm, requestSession: recordTypes.PartialSession, connectedDatabase?: PoolConnection): Promise<number>;
export default addLotOccupancyOccupant;
