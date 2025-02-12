let currentRouteLayer = null; 

function generateRouteKML(path, coordenadas) {
    const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>Ruta más corta</name>
        <Style id="routeStyle">
            <LineStyle>
                <color>ff0000ff</color>
                <width>4</width>
            </LineStyle>
            <IconStyle>
                <color>ff0000ff</color>
                <scale>1.0</scale>
            </IconStyle>
        </Style>`;

    const kmlFooter = `
    </Document>
</kml>`;

    // Crear los placemarks para cada nodo en la ruta
    let nodePlacemarks = path.map(node => `
        <Placemark>
            <name>${node}</name>
            <styleUrl>#routeStyle</styleUrl>
            <Point>
                <coordinates>${coordenadas[node][0]},${coordenadas[node][1]}</coordinates>
            </Point>
        </Placemark>`
    ).join('');

    // Crear la línea que conecta todos los puntos
    let routeCoordinates = path.map(node => 
        `${coordenadas[node][0]},${coordenadas[node][1]}`
    ).join('\n                ');

    let routeLine = `
        <Placemark>
            <name>Ruta más corta</name>
            <styleUrl>#routeStyle</styleUrl>
            <LineString>
                <coordinates>
                    ${routeCoordinates}
                </coordinates>
            </LineString>
        </Placemark>`;

    return kmlHeader + nodePlacemarks + routeLine + kmlFooter;
}

// Función para crear y mostrar la ruta en el mapa
function showRouteOnMap(startNode, endNode, algoritmo) {
    
    const { path, distance, executionTime } = peruGraph.shortestPath(startNode, endNode, algoritmo);
    
    if (path.length === 0) {
        console.log("No se encontró una ruta válida");
        return null;
    }

    const kmlContent = generateRouteKML(path, coordenadas);
    
    // Crear un Blob con el contenido KML
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);

    // Cargar el KML en el mapa
    fetch(url)
        .then(res => res.text())
        .then(kmltext => {
            const parser = new DOMParser();
            const kml = parser.parseFromString(kmltext, 'text/xml');
            const newRouteLayer = new L.KML(kml);
            

            // Eliminar la ruta anterior si existe
            if (currentRouteLayer) {
                map.removeLayer(currentRouteLayer);
            }

            // Agregar la nueva capa al mapa
            map.addLayer(newRouteLayer);
            map.fitBounds(newRouteLayer.getBounds());
            
            newRouteLayer.getLayers().forEach(layer => {
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
            // Guardar la nueva capa como la actual
            currentRouteLayer = newRouteLayer;
        });


    return { kmlContent, distance, executionTime};
}