import path from "path";
import type { ServiceConfig } from "node-windows";

const __dirname = ".";

export const serviceConfig: ServiceConfig = {
    name: "Lot Occupancy Manager",
    description:
        "A system for managing the occupancy of lots. (i.e. Cemetery management)",
    script: path.join(__dirname, "bin", "www.js")
};
