import {
    Router
} from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_fees from "../handlers/admin-get/fees.js";
import handler_doAddFeeCategory from "../handlers/admin-post/doAddFeeCategory.js";
import handler_doUpdateFeeCategory from "../handlers/admin-post/doUpdateFeeCategory.js";


export const router = Router();


// Fees

router.get("/fees",
    permissionHandlers.adminGetHandler,
    handler_fees);

router.post("/doAddFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doAddFeeCategory);

router.post("/doUpdateFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doUpdateFeeCategory);


export default router;