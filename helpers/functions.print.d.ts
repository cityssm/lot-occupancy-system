interface PrintConfig {
    title: string;
    params: string[];
}
export declare const getScreenPrintConfig: (printName: string) => PrintConfig;
export declare const getPdfPrintConfig: (printName: string) => PrintConfig;
export declare const getPrintConfig: (screenOrPdf_printName: string) => PrintConfig;
export declare const getReportData: (printConfig: PrintConfig, requestQuery: {
    [paramName: string]: unknown;
}) => {
    [dataName: string]: unknown;
};
export {};
