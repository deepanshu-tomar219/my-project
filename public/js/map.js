const mapDiv = document.querySelector("#map");

if (mapDiv) {

    const coordinates = JSON.parse(mapDiv.dataset.coordinates);

    const map = L.map('map').setView(
        [coordinates[1], coordinates[0]],
        10
    );

    // 🗺️ Add tile layer (THIS IS REQUIRED)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 📍 Add marker (optional but usually needed)
    L.marker([coordinates[1], coordinates[0]])
        .addTo(map)
        .bindPopup("Location")
        .openPopup();
}