// Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en kilómetros
}

class Graph {
    constructor() {
        this.nodes = new Set();
        this.edges = new Map();
    }

    addNode(node) {
        this.nodes.add(node);
        this.edges.set(node, []);
    }

    addEdge(start, end, weight) {
        this.edges.get(start).push({ node: end, weight });
        this.edges.get(end).push({ node: start, weight }); // Conexión bidireccional
    }

    dijkstra(startNode) {
        let distances = new Map();
        let previousNodes = new Map();
        let priorityQueue = new Set();

        this.nodes.forEach(node => {
            distances.set(node, Infinity);
            previousNodes.set(node, null);
            priorityQueue.add(node);
        });
        distances.set(startNode, 0);

        while (priorityQueue.size > 0) {
            let currentNode = [...priorityQueue].reduce((minNode, node) => 
                distances.get(node) < distances.get(minNode) ? node : minNode
            );

            priorityQueue.delete(currentNode);

            this.edges.get(currentNode).forEach(({ node, weight }) => {
                if (priorityQueue.has(node)) {
                    let newDistance = distances.get(currentNode) + weight;
                    if (newDistance < distances.get(node)) {
                        distances.set(node, newDistance);
                        previousNodes.set(node, currentNode);
                    }
                }
            });
        }

        return { distances, previousNodes };
    }

    shortestPath(start, end) {
        let { distances, previousNodes } = this.dijkstra(start);
        let path = [];
        let currentNode = end;

        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = previousNodes.get(currentNode);
        }

        return path.length > 1 ? { path, distance: distances.get(end) } : { path: [], distance: Infinity };
    }
}

// Crear y configurar el grafo
let peruGraph = new Graph();

// Definir todos los nodos
const nodos = [
    "Nodo Lima 1", "Nodo Lima 2", "Nodo Lima 3", "Nodo Lima 4", "Nodo Lima 5",
    "Nodo Lima 6", "Nodo Lima 7", "Nodo Lima 8", "Nodo Lima 9", "Nodo Lima 10",
    "Nodo Lima 11", "Nodo Lima 12", "Nodo Lima 13", "Nodo Lima 14",
    "Nodo Ica 1", "Nodo Ica 2", "Nodo Ica 3", "Nodo Ica 4", "Nodo Ica 5", "Nodo Ica 6",
    "Nodo Arequipa 1", "Nodo Arequipa 2", "Nodo Arequipa 3", "Nodo Arequipa 4"
];

// Definir las coordenadas de cada nodo
const coordenadas = {
    "Nodo Lima 1": [-76.92003, -12.01971],
    "Nodo Lima 2": [-77.06516, -12.08145],
    "Nodo Lima 3": [-77.11564, -12.00736],
    "Nodo Lima 4": [-77.19136, -11.5129],
    "Nodo Lima 5": [-76.61715, -11.49434],
    "Nodo Lima 6": [-76.40892, -11.88383],
    "Nodo Lima 7": [-75.93283, -12.48074],
    "Nodo Lima 8": [-76.37242, -13.13394],
    "Nodo Lima 9": [-77.58226, -11.13596],
    "Nodo Lima 10": [-76.99884, -10.48741],
    "Nodo Lima 11": [-76.77408, -10.68494],
    "Nodo Lima 12": [-76.9845, -10.50152],
    "Nodo Lima 13": [-77.75441, -10.78366],
    "Nodo Lima 14": [-77.76397, -10.69905],
    "Nodo Ica 1": [-76.12895, -13.43898],
    "Nodo Ica 2": [-75.96664, -13.72509],
    "Nodo Ica 3": [-76.21349, -13.72509],
    "Nodo Ica 4": [-75.73671, -13.9813],
    "Nodo Ica 5": [-75.72656, -14.06992],
    "Nodo Ica 6": [-75.18891, -14.54854],
    "Nodo Arequipa 1": [-73.36691, -15.7984],
    "Nodo Arequipa 2": [-72.65159, -15.84868],
    "Nodo Arequipa 3": [-72.48674, -16.09502],
    "Nodo Arequipa 4": [-72.70458, -16.63171]
};

// Agregar todos los nodos al grafo
nodos.forEach(nodo => peruGraph.addNode(nodo));

// Definir las conexiones
const conexiones = [
    ["Nodo Lima 1", "Nodo Lima 2"],
    ["Nodo Lima 1", "Nodo Lima 3"],
    ["Nodo Lima 2", "Nodo Lima 3"],
    ["Nodo Lima 3", "Nodo Lima 4"],
    ["Nodo Lima 3", "Nodo Lima 5"],
    ["Nodo Lima 4", "Nodo Lima 5"],
    ["Nodo Lima 5", "Nodo Lima 6"],
    ["Nodo Lima 1", "Nodo Lima 6"],
    ["Nodo Lima 6", "Nodo Lima 7"],
    ["Nodo Lima 1", "Nodo Lima 7"],
    ["Nodo Lima 7", "Nodo Lima 8"],
    ["Nodo Lima 2", "Nodo Lima 8"],
    ["Nodo Lima 7", "Nodo Ica 1"],
    ["Nodo Lima 8", "Nodo Ica 1"],
    ["Nodo Lima 4", "Nodo Lima 9"],
    ["Nodo Lima 4", "Nodo Lima 11"],
    ["Nodo Lima 5", "Nodo Lima 11"],
    ["Nodo Lima 9", "Nodo Lima 10"],
    ["Nodo Lima 9", "Nodo Lima 13"],
    ["Nodo Lima 10", "Nodo Lima 11"],
    ["Nodo Lima 14", "Nodo Lima 10"],
    ["Nodo Lima 11", "Nodo Lima 12"],
    ["Nodo Lima 12", "Nodo Lima 13"],
    ["Nodo Lima 13", "Nodo Lima 14"],
    ["Nodo Ica 1", "Nodo Ica 2"],
    ["Nodo Ica 1", "Nodo Ica 3"],
    ["Nodo Ica 2", "Nodo Ica 3"],
    ["Nodo Ica 2", "Nodo Ica 4"],
    ["Nodo Lima 7", "Nodo Ica 4"],
    ["Nodo Ica 3", "Nodo Ica 4"],
    ["Nodo Ica 4", "Nodo Ica 5"],
    ["Nodo Ica 4", "Nodo Ica 6"],
    ["Nodo Ica 5", "Nodo Ica 6"],
    ["Nodo Ica 6", "Nodo Arequipa 1"],
    ["Nodo Arequipa 1", "Nodo Arequipa 2"],
    ["Nodo Arequipa 1", "Nodo Arequipa 3"],
    ["Nodo Arequipa 1", "Nodo Arequipa 4"],
    ["Nodo Arequipa 2", "Nodo Arequipa 3"],
    ["Nodo Lima 7", "Nodo Arequipa 2"],
    ["Nodo Arequipa 2", "Nodo Arequipa 4"],
    ["Nodo Arequipa 3", "Nodo Arequipa 4"]
];

// Agregar las conexiones al grafo con sus distancias
conexiones.forEach(([inicio, fin]) => {
    const [lon1, lat1] = coordenadas[inicio];
    const [lon2, lat2] = coordenadas[fin];
    const distancia = calculateDistance(lat1, lon1, lat2, lon2);
    peruGraph.addEdge(inicio, fin, distancia);
});

