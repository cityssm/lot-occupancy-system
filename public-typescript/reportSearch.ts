(() => {
    const menuTabElements = document.querySelectorAll(".menu a") as NodeListOf<HTMLAnchorElement>;
    const tabContainerElements = document.querySelectorAll(
        ".tabs-container > div"
    ) as NodeListOf<HTMLElement>;

    const selectTab = (clickEvent: Event) => {
        clickEvent.preventDefault();

        // Remove .is-active from all tabs

        for (const menuTabElement of menuTabElements) {
            menuTabElement.classList.remove("is-active");
        }

        // Set .is-active on clicked tab

        const selectedTabElement = clickEvent.currentTarget as HTMLAnchorElement;
        selectedTabElement.classList.add("is-active");

        // Hide all but selected tab

        const selectedTabContainerId = selectedTabElement.href.slice(
            Math.max(0, selectedTabElement.href.indexOf("#") + 1)
        );

        for (const tabContainerElement of tabContainerElements) {
            if (tabContainerElement.id === selectedTabContainerId) {
                tabContainerElement.classList.remove("is-hidden");
            } else {
                tabContainerElement.classList.add("is-hidden");
            }
        }
    };

    for (const menuTabElement of menuTabElements) {
        menuTabElement.addEventListener("click", selectTab);
    }
})();