[Home](https://cityssm.github.io/lot-occupancy-system/)
•
[Help](https://cityssm.github.io/lot-occupancy-system/docs/)

# Terminology

_Note that is is possible to substitute the default terminology using the application's config file._

| Term      | Description                                    | Cemetery System Alias Example |
| --------- | ---------------------------------------------- | ----------------------------- |
| Map       | The highest level object, a group of lots.     | Cemetery                      |
| Lot       | The smallest occupiable piece of land.         | Burial Site                   |
| Occupancy | A reservation on a lot for a specific purpose. | Occupancy                     |
| Occupant  | A person associated with a lot occupancy.      | Occupant                      |

For example in the context of a cemetery system, John Doe has passed away and has been interred.

-   John Doe would be considered an **occupant**.
-   An **occupancy** record would be created with **no end date** and associated with his **burial site (lot)** of choice.
-   The **burial site (lot)** is associated with the **cemetery (map)** where John is buried.

For example in the context of a marina, Jane Smith and her boat are renting a slip for a week.

-   Jane Smith, and possibly the others on her boat, would be considered **renters (occupants)**.
-   A **reservation (occupancy)** record would be created for the duration of her stay, and associated with the **slip (lot)** of choice.
-   The **slip (lot)** is associated with the **marina (map)** where the slip is located.
