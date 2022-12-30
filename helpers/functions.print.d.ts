interface PrintConfig {
    title: string;
    params: string[];
}
export declare function getScreenPrintConfig(printName: string): PrintConfig;
export declare function getPdfPrintConfig(printName: string): PrintConfig;
export declare function getPrintConfig(screenOrPdf_printName: string): PrintConfig | undefined;
export declare function getReportData(printConfig: PrintConfig, requestQuery: {
    [paramName: string]: unknown;
}): {
    [dataName: string]: unknown;
};
export {};
