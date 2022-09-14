/* eslint-disable node/no-unpublished-import */

import { config } from "../data/config.js";

import type * as configTypes from "../types/configTypes";

/*
 * SET UP FALLBACK VALUES
 */

const configFallbackValues = new Map<string, unknown>();

configFallbackValues.set("application.applicationName", "Lot Occupancy System");
configFallbackValues.set(
    "application.backgroundURL",
    "/images/cemetery-background.jpg"
);
configFallbackValues.set("application.logoURL", "/images/cemetery-logo.png");
configFallbackValues.set("application.httpPort", 7000);
configFallbackValues.set("application.useTestDatabases", false);

configFallbackValues.set("reverseProxy.disableCompression", false);
configFallbackValues.set("reverseProxy.disableEtag", false);
configFallbackValues.set("reverseProxy.urlPrefix", "");

configFallbackValues.set("session.cookieName", "lot-occupancy-system-user-sid");
configFallbackValues.set("session.secret", "cityssm/lot-occupancy-system");
configFallbackValues.set("session.maxAgeMillis", 60 * 60 * 1000);
configFallbackValues.set("session.doKeepAlive", false);

configFallbackValues.set("users.canLogin", ["administrator"]);
configFallbackValues.set("users.canUpdate", []);
configFallbackValues.set("users.isAdmin", ["administrator"]);

configFallbackValues.set("aliases.lot", "Lot");
configFallbackValues.set("aliases.lots", "Lots");
configFallbackValues.set("aliases.map", "Map");
configFallbackValues.set("aliases.maps", "Maps");
configFallbackValues.set("aliases.occupancy", "Occupancy");
configFallbackValues.set("aliases.occupancies", "Occupancies");
configFallbackValues.set("aliases.occupant", "Occupant");
configFallbackValues.set("aliases.occupants", "Occupants");
configFallbackValues.set(
    "aliases.externalReceiptNumber",
    "External Receipt Number"
);

configFallbackValues.set("settings.map.mapCityDefault", "");
configFallbackValues.set("settings.map.mapProvinceDefault", "");

configFallbackValues.set(
    "settings.lot.lotNameSortNameFunction",
    (lotName: string) => lotName
);

configFallbackValues.set(
    "settings.lotOccupancy.occupancyEndDateIsRequired",
    true
);
configFallbackValues.set("settings.lotOccupancy.occupantCityDefault", "");
configFallbackValues.set("settings.lotOccupancy.occupantProvinceDefault", "");

configFallbackValues.set("settings.fees.taxPercentageDefault", 0);

configFallbackValues.set("settings.workOrders.workOrderNumberLength", 6);
configFallbackValues.set(
    "settings.workOrders.workOrderMilestoneDateRecentBeforeDays",
    5
);
configFallbackValues.set(
    "settings.workOrders.workOrderMilestoneDateRecentAfterDays",
    60
);

/*
 * Set up function overloads
 */

export function getProperty(
    propertyName: "application.applicationName"
): string;

export function getProperty(propertyName: "application.logoURL"): string;
export function getProperty(propertyName: "application.httpPort"): number;
export function getProperty(propertyName: "application.userDomain"): string;
export function getProperty(
    propertyName: "application.useTestDatabases"
): boolean;

export function getProperty(
    propertyName: "activeDirectory"
): configTypes.ConfigActiveDirectory;

export function getProperty(propertyName: "users.canLogin"): string[];
export function getProperty(propertyName: "users.canUpdate"): string[];
export function getProperty(propertyName: "users.isAdmin"): string[];

export function getProperty(
    propertyName: "reverseProxy.disableCompression"
): boolean;

export function getProperty(propertyName: "reverseProxy.disableEtag"): boolean;
export function getProperty(propertyName: "reverseProxy.urlPrefix"): string;

export function getProperty(propertyName: "session.cookieName"): string;
export function getProperty(propertyName: "session.doKeepAlive"): boolean;
export function getProperty(propertyName: "session.maxAgeMillis"): number;
export function getProperty(propertyName: "session.secret"): string;

export function getProperty(propertyName: "aliases.lot"): string;
export function getProperty(propertyName: "aliases.lots"): string;
export function getProperty(propertyName: "aliases.map"): string;
export function getProperty(propertyName: "aliases.maps"): string;
export function getProperty(propertyName: "aliases.occupancy"): string;
export function getProperty(propertyName: "aliases.occupancies"): string;
export function getProperty(propertyName: "aliases.occupant"): string;
export function getProperty(propertyName: "aliases.occupants"): string;

export function getProperty(
    propertyName: "aliases.externalReceiptNumber"
): string;

export function getProperty(
    propertyName: "settings.map.mapCityDefault"
): string;

export function getProperty(
    propertyName: "settings.map.mapProvinceDefault"
): string;

export function getProperty(
    propertyName: "settings.lot.lotNamePattern"
): RegExp;

export function getProperty(
    propertyName: "settings.lot.lotNameSortNameFunction"
): (lotName: string) => string;

export function getProperty(
    propertyName: "settings.lotOccupancy.occupancyEndDateIsRequired"
): boolean;

export function getProperty(
    propertyName: "settings.lotOccupancy.occupantCityDefault"
): string;

export function getProperty(
    propertyName: "settings.lotOccupancy.occupantProvinceDefault"
): string;

export function getProperty(
    propertyName: "settings.fees.taxPercentageDefault"
): number;

export function getProperty(
    propertyName: "settings.workOrders.workOrderNumberLength"
): number;

export function getProperty(
    propertyName: "settings.workOrders.workOrderMilestoneDateRecentBeforeDays"
): number;

export function getProperty(
    propertyName: "settings.workOrders.workOrderMilestoneDateRecentAfterDays"
): number;

export function getProperty(propertyName: string): unknown {
    const propertyNameSplit = propertyName.split(".");

    let currentObject = config;

    for (const propertyNamePiece of propertyNameSplit) {
        if (
            Object.prototype.hasOwnProperty.call(
                currentObject,
                propertyNamePiece
            )
        ) {
            currentObject = currentObject[propertyNamePiece];
            continue;
        }

        return configFallbackValues.get(propertyName);
    }

    return currentObject;
}

export const keepAliveMillis = getProperty("session.doKeepAlive")
    ? Math.max(
          getProperty("session.maxAgeMillis") / 2,
          getProperty("session.maxAgeMillis") - 10 * 60 * 1000
      )
    : 0;
