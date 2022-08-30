import { config as cemeteryConfig } from "./config.cemetery.ontario.js";

export const config =  Object.assign({}, cemeteryConfig);

config.settings.lotOccupancy.occupantCityDefault = "Sault Ste. Marie";
config.settings.map.mapCityDefault = "Sault Ste. Marie";

config.aliases.externalReceiptNumber = "GP Receipt Number";

export default config;