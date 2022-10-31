export interface ReportParameters {
    [parameterName: string]: string | number;
}
export declare const getReportData: (reportName: string, reportParameters?: ReportParameters) => unknown[] | undefined;
export default getReportData;
