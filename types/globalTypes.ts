export interface LOS {
    highlightMap: (
        mapContainerElement: HTMLElement,
        mapKey: string,
        contextualClass: "success" | "danger"
    ) => void;

    initializeDatePickers: (containerElement: HTMLElement) => void;
    initializeTimePickers: (containerElement: HTMLElement) => void;

    initializeUnlockFieldButtons: (containerElement: HTMLElement) => void;

    populateAliases: (containerElement: HTMLElement) => void;
    getRandomColor: (seedString: string) => string;
}
