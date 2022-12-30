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

    getMoveUpDownButtonFieldHTML: (upButtonClassNames: string, downButtonClassNames: string, isSmall?: boolean) => string;
}
