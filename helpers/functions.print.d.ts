interface PrintConfig {
    title: string;
    params: string[];
}
export declare function getScreenPrintConfig(printName: string): PrintConfig;
export declare function getPdfPrintConfig(printName: string): PrintConfig;
export declare function getPrintConfig(screenOrPdfPrintName: string): PrintConfig | undefined;
export declare function getReportData(printConfig: PrintConfig, requestQuery: Record<string, unknown>): Promise<Record<string, unknown>>;
export {};
