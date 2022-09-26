interface PrintConfig {
    title: string;
    params: string[];
}
export declare const getScreenPrintConfig: (printName: string) => PrintConfig;
export declare const getPrintConfig: (screenOrPdf_printName: string) => PrintConfig;
export {};
