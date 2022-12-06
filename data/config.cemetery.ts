import { config as baseConfig } from "./config.base.js";

export const config = Object.assign({}, baseConfig);

config.application = {
    applicationName: "Cemetery Management System",
    backgroundURL: "/images/cemetery-background.jpg",
    logoURL: "/images/cemetery-logo.svg"
};

config.aliases.lot = "Burial Site";
config.aliases.lots = "Burial Sites";
config.aliases.map = "Cemetery";
config.aliases.maps = "Cemeteries";
config.aliases.occupancy = "Contract";
config.aliases.occupancies = "Contracts";
config.aliases.occupant = "Related Party";
config.aliases.occupants = "Related Parties";

config.settings.lotOccupancy.occupancyEndDateIsRequired = false;

export default config;
