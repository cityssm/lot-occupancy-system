import { config as cemeteryConfig } from "./config.cemetery.ontario.js";

export const config =  Object.assign({}, cemeteryConfig);

config.settings.lotOccupancy.occupantCityDefault = "Sault Ste. Marie";

export default config;