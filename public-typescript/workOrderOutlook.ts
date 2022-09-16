(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const apiKey = document.querySelector("main").dataset.apiKey;

    const workOrderTypeIdsElement = document.querySelector(
        "#icsFilters--workOrderTypeIds"
    ) as HTMLSelectElement;

    const workOrderMilestoneTypeIdsElement = document.querySelector(
        "#icsFilters--workOrderMilestoneTypeIds"
    ) as HTMLSelectElement;

    const calendarLinkElement = document.querySelector(
        "#icsFilters--calendarURL"
    ) as HTMLTextAreaElement;

    const updateCalendarURL = () => {
        let url =
            window.location.href.slice(
                0,
                Math.max(
                    0,
                    window.location.href.indexOf(window.location.pathname) + 1
                )
            ) +
            urlPrefix +
            "api/" +
            apiKey +
            "/" +
            "milestoneICS/" +
            "?";

        if (
            !workOrderTypeIdsElement.disabled &&
            workOrderTypeIdsElement.selectedOptions.length > 0
        ) {
            url += "workOrderTypeIds=";

            for (const optionElement of workOrderTypeIdsElement.selectedOptions) {
                url += optionElement.value + ",";
            }

            url = url.slice(0, -1) + "&";
        }

        if (
            !workOrderMilestoneTypeIdsElement.disabled &&
            workOrderMilestoneTypeIdsElement.selectedOptions.length > 0
        ) {
            url += "workOrderMilestoneTypeIds=";

            for (const optionElement of workOrderMilestoneTypeIdsElement.selectedOptions) {
                url += optionElement.value + ",";
            }

            url = url.slice(0, -1) + "&";
        }

        calendarLinkElement.value = url.slice(0, -1);
    };

    document
        .querySelector("#icsFilters--workOrderTypeIds-all")
        .addEventListener("change", (changeEvent) => {
            workOrderTypeIdsElement.disabled = (
                changeEvent.currentTarget as HTMLInputElement
            ).checked;
        });

    document
        .querySelector("#icsFilters--workOrderMilestoneTypeIds-all")
        .addEventListener("change", (changeEvent) => {
            workOrderMilestoneTypeIdsElement.disabled = (
                changeEvent.currentTarget as HTMLInputElement
            ).checked;
        });

    const inputSelectElements = document
        .querySelector("#panel--icsFilters")
        .querySelectorAll("input, select") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
    >;

    for (const element of inputSelectElements) {
        element.addEventListener("change", updateCalendarURL);
    }

    updateCalendarURL();

    calendarLinkElement.addEventListener("click", () => {
        calendarLinkElement.focus();
        calendarLinkElement.select();
    })
})();
