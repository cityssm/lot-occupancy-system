"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const mapContainerElement = document.querySelector("#map--leaflet");
    if (mapContainerElement) {
        const mapLatitude = Number.parseFloat(mapContainerElement.dataset.mapLatitude);
        const mapLongitude = Number.parseFloat(mapContainerElement.dataset.mapLongitude);
        const mapCoordinates = [mapLatitude, mapLongitude];
        const map = L.map(mapContainerElement);
        map.setView(mapCoordinates, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
        L.marker(mapCoordinates).addTo(map);
    }
})();
