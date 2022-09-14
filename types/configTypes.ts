export interface Config {
    application?: ConfigApplication;
    session?: ConfigSession;
    reverseProxy?: {
        disableCompression: boolean;
        disableEtag: boolean;
        urlPrefix: string;
    };
    activeDirectory?: ConfigActiveDirectory;
    users?: {
        testing?: string[];
        canLogin?: string[];
        canUpdate?: string[];
        isAdmin?: string[];
    };
    aliases?: {
        lot?: string;
        lots?: string;
        map?: string;
        maps?: string;
        occupancy?: string;
        occupancies?: string;
        occupant?: string;
        occupants?: string;
        externalReceiptNumber?: string;
    };
    settings?: {
        fees?: {
            taxPercentageDefault?: number;
        };
        map?: {
            mapCityDefault?: string;
            mapProvinceDefault?: string;
        };
        lot?: {
            lotNamePattern?: RegExp;
            lotNameSortNameFunction?: (lotName: string) => string;
        };
        lotOccupancy?: {
            lotIdIsRequired?: boolean;
            occupancyEndDateIsRequired?: boolean;
            occupantCityDefault?: string;
            occupantProvinceDefault?: string;
        };
        workOrders?: {
            workOrderNumberLength?: number;
            workOrderMilestoneDateRecentBeforeDays?: number;
            workOrderMilestoneDateRecentAfterDays?: number;
        };
    };
}

interface ConfigApplication {
    applicationName?: string;
    backgroundURL?: string;
    logoURL?: string;
    httpPort?: number;
    userDomain?: string;
    useTestDatabases?: boolean;
}

interface ConfigSession {
    cookieName?: string;
    secret?: string;
    maxAgeMillis?: number;
    doKeepAlive?: boolean;
}

export interface ConfigActiveDirectory {
    url: string;
    baseDN: string;
    username: string;
    password: string;
}
