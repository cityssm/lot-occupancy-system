import path from 'node:path';
const _dirname = '.';
export const serviceConfig = {
    name: 'Lot Occupancy Manager',
    description: 'A system for managing the occupancy of lots. (i.e. Cemetery management)',
    script: path.join(_dirname, 'bin', 'www.js')
};
