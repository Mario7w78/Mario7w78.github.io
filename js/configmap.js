var map = L.map('map').setView([-13.5319, -71.9675], 6); // Centrado en Perú

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Cargar el archivo KML
fetch('mapa.kml')
    .then(res => res.text())
    .then(kmltext => {
        var parser = new DOMParser();
        var kml = parser.parseFromString(kmltext, 'text/xml');
        var track = new L.KML(kml);
        map.addLayer(track);
        map.fitBounds(track.getBounds());

        // Reemplazar iconos en los Placemarks
        track.getLayers().forEach(layer => {
            if (layer instanceof L.Marker) {
                let customIcon = L.icon({
                    iconUrl: 'router.png', // Cambia esto a la ruta de tu icono
                    iconSize: [32, 32],   // Tamaño del icono
                    iconAnchor: [16, 32], // Punto de anclaje del icono
                    popupAnchor: [0, -32] // Ajuste para el popup
                });

                layer.setIcon(customIcon);
            }
        });
    });
