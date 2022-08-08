import type { Config } from "../types/configTypes";

export const config: Config = {
    application: {
        applicationName: "Cemetery Management System",
        backgroundURL: "/images/cemetery-background.jpg",
        logoURL: "/images/cemetery-logo.svg"
    },
    aliases: {
        lot: "Burial Site",
        lots: "Burial Sites",
        map: "Cemetery",
        maps: "Cemeteries"
    },
    settings: {
        lotOccupancy: {
            occupancyEndDateIsRequired: false
        }
    }
};

export default config;