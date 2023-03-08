import { getDynamicsGPDocument } from '../../helpers/functions.dynamicsGP.js';
export async function handler(request, response) {
    const externalReceiptNumber = request.body.externalReceiptNumber;
    const dynamicsGPDocument = await getDynamicsGPDocument(externalReceiptNumber);
    if (dynamicsGPDocument === undefined) {
        response.json({
            success: false
        });
    }
    else {
        response.json({
            success: true,
            dynamicsGPDocument
        });
    }
}
export default handler;
