export interface LOS {
    highlightMap: (mapContainerElement: HTMLElement, mapKey: string, contextualClass: "success" | "danger") => void;
    initializeUnlockFieldButtons: (containerElement: HTMLElement) => void;
}