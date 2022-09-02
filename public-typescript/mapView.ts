// import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
// import type { BulmaJS } from "@cityssm/bulma-js/types";
import type * as Leaflet from "leaflet";

// declare const cityssm: cityssmGlobal;
// declare const bulmaJS: BulmaJS;
declare const L;

(() => {
    const mapContainerElement = document.querySelector(
        "#map--leaflet"
    ) as HTMLElement;

    if (mapContainerElement) {
        const mapLatitude = Number.parseFloat(
            mapContainerElement.dataset.mapLatitude
        );
        const mapLongitude = Number.parseFloat(
            mapContainerElement.dataset.mapLongitude
        );

        const mapCoordinates: Leaflet.LatLngTuple = [mapLatitude, mapLongitude];

        const map: Leaflet.Map = L.map(mapContainerElement);
        map.setView(mapCoordinates, 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(map);

        L.marker(mapCoordinates).addTo(map);
    }
})();
