import faIcons from "font-awesome-v5-icons";

let solidIcons: string[] = [];

export const getSolidIconClasses = async () => {
    if (solidIcons.length === 0) {
        const allIcons = await faIcons.getList();

        const list: string[] = [];

        for (const icon of allIcons) {
            if ((icon.styles as string[]).includes("solid")) {
                list.push(icon.name);
            }
        }

        solidIcons = list;
    }

    return solidIcons;
};