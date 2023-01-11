import faIcons from 'font-awesome-v5-icons';
let solidIcons = [];
export async function getSolidIconClasses() {
    if (solidIcons.length === 0) {
        const allIcons = await faIcons.getListByKeys(['name', 'styles']);
        const list = [];
        for (const icon of allIcons) {
            if ((icon.styles ?? []).includes('solid')) {
                list.push(icon.name);
            }
        }
        solidIcons = list;
    }
    return solidIcons;
}
