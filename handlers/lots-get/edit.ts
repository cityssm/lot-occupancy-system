import type { RequestHandler } from "express";


export const handler: RequestHandler = (_request, response) => {

  return response.render("lot-edit", {
    headTitle: "Licence Update",
    isCreate: false
  });
};


export default handler;
