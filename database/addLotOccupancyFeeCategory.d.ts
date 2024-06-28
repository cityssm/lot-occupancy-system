export interface AddLotOccupancyFeeCategoryForm {
    lotOccupancyId: number | string;
    feeCategoryId: number | string;
}
export default function addLotOccupancyFeeCategory(lotOccupancyFeeCategoryForm: AddLotOccupancyFeeCategoryForm, user: User): Promise<number>;
