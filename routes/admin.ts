import {
    Router
} from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_fees from "../handlers/admin-get/fees.js";
import handler_doAddFeeCategory from "../handlers/admin-post/doAddFeeCategory.js";
import handler_doUpdateFeeCategory from "../handlers/admin-post/doUpdateFeeCategory.js";
import handler_doDeleteFeeCategory from "../handlers/admin-post/doDeleteFeeCategory.js";

import handler_doAddFee from "../handlers/admin-post/doAddFee.js";
import handler_doUpdateFee from "../handlers/admin-post/doUpdateFee.js";
import handler_doDeleteFee from "../handlers/admin-post/doDeleteFee.js";


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

router.post("/doDeleteFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doDeleteFeeCategory);

router.post("/doAddFee",
    permissionHandlers.adminPostHandler,
    handler_doAddFee);

router.post("/doUpdateFee",
    permissionHandlers.adminPostHandler,
    handler_doUpdateFee);

router.post("/doDeleteFee",
    permissionHandlers.adminPostHandler,
    handler_doDeleteFee);


export default router;