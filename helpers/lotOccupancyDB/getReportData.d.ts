export interface ReportParameters {
    [parameterName: string]: string | number;
}
export declare function getReportData(reportName: string, reportParameters?: ReportParameters): unknown[] | undefined;
export default getReportData;
