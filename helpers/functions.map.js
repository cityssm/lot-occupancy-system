import fs from 'node:fs/promises';
let mapSVGs;
export async function getMapSVGs() {
    if (!mapSVGs) {
        const files = await fs.readdir('./public/images/maps/');
        const SVGs = [];
        for (const file of files) {
            if (file.toLowerCase().endsWith('.svg')) {
                SVGs.push(file);
            }
        }
        mapSVGs = SVGs;
    }
    return mapSVGs;
}
