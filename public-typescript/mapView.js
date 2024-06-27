"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b;
    const mapContainerElement = document.querySelector('#map--leaflet');
    if (mapContainerElement !== null) {
        const mapLatitude = Number.parseFloat((_a = mapContainerElement.dataset.mapLatitude) !== null && _a !== void 0 ? _a : '');
        const mapLongitude = Number.parseFloat((_b = mapContainerElement.dataset.mapLongitude) !== null && _b !== void 0 ? _b : '');
        const mapCoordinates = [mapLatitude, mapLongitude];
        // eslint-disable-next-line unicorn/no-array-callback-reference
        const map = L.map(mapContainerElement);
        map.setView(mapCoordinates, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
        L.marker(mapCoordinates).addTo(map);
    }
})();
