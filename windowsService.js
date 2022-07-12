import path from "path";
const __dirname = ".";
export const serviceConfig = {
    name: "Lot Occupancy Manager",
    description: "A system for managing the occupancy of lots. (i.e. Cemetery management)",
    script: path.join(__dirname, "bin", "www.js")
};
