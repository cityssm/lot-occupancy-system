import type { PoolConnection } from 'better-sqlite-pool';
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
export declare function addLotOccupancyOccupant(lotOccupancyOccupantForm: AddLotOccupancyOccupantForm, user: User, connectedDatabase?: PoolConnection): Promise<number>;
export default addLotOccupancyOccupant;
