import faIcons from 'font-awesome-v5-icons'

let solidIcons: string[] = []

export async function getSolidIconClasses(): Promise<string[]> {
  if (solidIcons.length === 0) {
    const allIcons = await faIcons.getListByKeys(['name', 'styles'])

    const list: string[] = []

    for (const icon of allIcons) {
      if ((icon.styles ?? []).includes('solid')) {
        list.push(icon.name!)
      }
    }

    solidIcons = list
  }

  return solidIcons
}
