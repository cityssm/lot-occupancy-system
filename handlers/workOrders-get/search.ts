import type {
    RequestHandler
} from "express";


export const handler: RequestHandler = (request, response) => {

    response.render("workOrder-search", {
        headTitle: "Work Order Search"
    });
};


export default handler;