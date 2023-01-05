export interface LOS {
    urlPrefix: string;
    apiKey: string;

    highlightMap: (
        mapContainerElement: HTMLElement,
        mapKey: string,
        contextualClass: "success" | "danger"
    ) => void;

    initializeDatePickers: (containerElement: HTMLElement) => void;
    // initializeTimePickers: (containerElement: HTMLElement) => void;

    initializeUnlockFieldButtons: (containerElement: HTMLElement) => void;

    populateAliases: (containerElement: HTMLElement) => void;

    escapedAliases: {
        Map: string;
        map: string;
        Maps: string;
        maps: string;
        Lot: string;
        lot: string;
        Lots: string;
        lots: string;
        Occupancy: string;
        occupancy: string;
        Occupancies: string;
        occupancies: string;
        Occupant: string;
        occupant: string;
        Occupants: string;
        occupants: string;
        ExternalReceiptNumber: string;
        externalReceiptNumber: string;
        OccupancyStartDate: string;
        occupancyStartDate: string;
        WorkOrderOpenDate: string;
        workOrderOpenDate: string;
        WorkOrderCloseDate: string;
        workOrderCloseDate: string;
    };

    getRandomColor: (seedString: string) => string;

    setUnsavedChanges: () => void;
    clearUnsavedChanges: () => void;
    hasUnsavedChanges: () => boolean;

    getMoveUpDownButtonFieldHTML: (
        upButtonClassNames: string,
        downButtonClassNames: string,
        isSmall?: boolean
    ) => string;
    getLoadingParagraphHTML: (captionText?: string) => string;
    getSearchResultsPagerHTML: (limit: number, offset: number, count: number) => string;

    getMapURL: (mapId?: number | string, edit?: boolean, time?: boolean) => string;
    getLotURL: (lotId?: number | string, edit?: boolean, time?: boolean) => string;
    getLotOccupancyURL: (lotOccupancyId?: number | string, edit?: boolean, time?: boolean) => string;
    getWorkOrderURL: (workOrderId?: number | string, edit?: boolean, time?: boolean) => string;
}
