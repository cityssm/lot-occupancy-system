import type { config as MSSQLConfig } from 'mssql';
export interface Config {
    application: ConfigApplication;
    session: ConfigSession;
    reverseProxy: {
        disableCompression?: boolean;
        disableEtag?: boolean;
        urlPrefix?: string;
    };
    activeDirectory?: ConfigActiveDirectory;
    users: {
        testing?: string[];
        canLogin?: string[];
        canUpdate?: string[];
        isAdmin?: string[];
    };
    aliases: {
        lot?: string;
        lots?: string;
        map?: string;
        maps?: string;
        occupancy?: string;
        occupancies?: string;
        occupancyStartDate?: string;
        occupant?: string;
        occupants?: string;
        externalReceiptNumber?: string;
        workOrderOpenDate?: string;
        workOrderCloseDate?: string;
    };
    settings: {
        fees: {
            taxPercentageDefault?: number;
        };
        map: {
            mapCityDefault?: string;
            mapProvinceDefault?: string;
        };
        lot: {
            lotNamePattern?: RegExp;
            lotNameHelpText?: string;
            lotNameSortNameFunction?: (lotName: string) => string;
        };
        lotOccupancy: {
            lotIdIsRequired?: boolean;
            occupancyEndDateIsRequired?: boolean;
            occupantCityDefault?: string;
            occupantProvinceDefault?: string;
            prints?: string[];
        };
        workOrders: {
            workOrderNumberLength?: number;
            workOrderMilestoneDateRecentBeforeDays?: number;
            workOrderMilestoneDateRecentAfterDays?: number;
            calendarEmailAddress?: string;
            prints?: string[];
        };
        adminCleanup: {
            recordDeleteAgeDays?: number;
        };
        printPdf: {
            contentDisposition?: 'attachment' | 'inline';
        };
        dynamicsGP?: {
            integrationIsEnabled: boolean;
            mssqlConfig?: MSSQLConfig;
            lookupOrder?: DynamicsGPLookup[];
            accountCodes?: string[];
            itemNumbers?: string[];
            trialBalanceCodes?: string[];
        };
    };
}
export type DynamicsGPLookup = 'diamond/cashReceipt' | 'diamond/extendedInvoice' | 'invoice';
interface ConfigApplication {
    applicationName?: string;
    backgroundURL?: string;
    logoURL?: string;
    httpPort?: number;
    userDomain?: string;
    useTestDatabases?: boolean;
    ntfyStartup?: ConfigNtfyStartup;
    maximumProcesses?: number;
}
export interface ConfigNtfyStartup {
    topic: string;
    server?: string;
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
export {};
