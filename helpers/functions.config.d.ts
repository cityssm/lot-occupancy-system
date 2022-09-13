import type * as configTypes from "../types/configTypes";
export declare function getProperty(propertyName: "application.applicationName"): string;
export declare function getProperty(propertyName: "application.logoURL"): string;
export declare function getProperty(propertyName: "application.httpPort"): number;
export declare function getProperty(propertyName: "application.userDomain"): string;
export declare function getProperty(propertyName: "application.useTestDatabases"): boolean;
export declare function getProperty(propertyName: "activeDirectory"): configTypes.ConfigActiveDirectory;
export declare function getProperty(propertyName: "users.canLogin"): string[];
export declare function getProperty(propertyName: "users.canUpdate"): string[];
export declare function getProperty(propertyName: "users.isAdmin"): string[];
export declare function getProperty(propertyName: "reverseProxy.disableCompression"): boolean;
export declare function getProperty(propertyName: "reverseProxy.disableEtag"): boolean;
export declare function getProperty(propertyName: "reverseProxy.urlPrefix"): string;
export declare function getProperty(propertyName: "session.cookieName"): string;
export declare function getProperty(propertyName: "session.doKeepAlive"): boolean;
export declare function getProperty(propertyName: "session.maxAgeMillis"): number;
export declare function getProperty(propertyName: "session.secret"): string;
export declare function getProperty(propertyName: "aliases.lot"): string;
export declare function getProperty(propertyName: "aliases.lots"): string;
export declare function getProperty(propertyName: "aliases.map"): string;
export declare function getProperty(propertyName: "aliases.maps"): string;
export declare function getProperty(propertyName: "aliases.occupancy"): string;
export declare function getProperty(propertyName: "aliases.occupancies"): string;
export declare function getProperty(propertyName: "aliases.occupant"): string;
export declare function getProperty(propertyName: "aliases.occupants"): string;
export declare function getProperty(propertyName: "aliases.externalReceiptNumber"): string;
export declare function getProperty(propertyName: "settings.map.mapCityDefault"): string;
export declare function getProperty(propertyName: "settings.map.mapProvinceDefault"): string;
export declare function getProperty(propertyName: "settings.lot.lotNamePattern"): RegExp;
export declare function getProperty(propertyName: "settings.lot.lotNameSortNameFunction"): (lotName: string) => string;
export declare function getProperty(propertyName: "settings.lotOccupancy.occupancyEndDateIsRequired"): boolean;
export declare function getProperty(propertyName: "settings.lotOccupancy.occupantCityDefault"): string;
export declare function getProperty(propertyName: "settings.lotOccupancy.occupantProvinceDefault"): string;
export declare function getProperty(propertyName: "settings.fees.taxPercentageDefault"): number;
export declare function getProperty(propertyName: "settings.workOrders.workOrderNumberLength"): number;
export declare const keepAliveMillis: number;
