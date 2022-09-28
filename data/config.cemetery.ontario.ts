import { config as cemeteryConfig } from "./config.cemetery.js";

export const config =  Object.assign({}, cemeteryConfig);

config.settings.lotOccupancy.occupantProvinceDefault = "ON";

config.settings.map.mapProvinceDefault = "ON";

config.settings.fees.taxPercentageDefault = 13;

export default config;