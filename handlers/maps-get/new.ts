import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = (_request, response) => {

  const map: recordTypes.Map = {};

  response.render("map-edit", {
    headTitle: configFunctions.getProperty("aliases.map") + " Create",
    isCreate: true,
    map
  });
};


export default handler;