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
config.aliases.occupant = "Customer";
config.aliases.occupants = "Customers";
config.aliases.workOrderOpenDate = "Order Date";
config.aliases.workOrderCloseDate = "Completion Date";

config.settings.lotOccupancy.occupancyEndDateIsRequired = false;

export default config;
