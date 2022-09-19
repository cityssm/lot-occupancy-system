import type { RequestHandler } from "express";

export const handler: RequestHandler = (_request, response) => {

    response.render("admin-cleanup", {
        headTitle: "Database Cleanup"
    });
};

export default handler;
