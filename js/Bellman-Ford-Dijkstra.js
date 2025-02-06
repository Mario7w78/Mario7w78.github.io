// Utilidades compartidas
class GraphUtils {
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    static reconstructPath(predecessors, end) {
        const path = [];
        let currentNode = end;
        
        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = predecessors.get(currentNode);
        }
        
        return path;
    }
}

// Clase base para el grafo
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

    // Método para inicializar las estructuras de datos comunes
    initializeAlgorithm(startNode) {
        const distances = new Map();
        const predecessors = new Map();
        
        this.nodes.forEach(node => {
            distances.set(node, Infinity);
            predecessors.set(node, null);
        });
        distances.set(startNode, 0);
        
        return { distances, predecessors };
    }

    // Método para obtener el camino más corto
    shortestPath(start, end, algorithm ) {
        try {
            const { distances, predecessors } = algorithm === 'dijkstra' ? 
                this.dijkstra(start) : 
                this.bellmanFord(start);

            const path = GraphUtils.reconstructPath(predecessors, end);
            
            return path.length > 1 ? 
                { path, distance: distances.get(end) } : 
                { path: [], distance: Infinity };
        } catch (error) {
            console.error(`Error en ${algorithm}:`, error.message);
            return { path: [], distance: Infinity };
        }
    }

    // Implementación de Dijkstra
    dijkstra(startNode) {
        const { distances, predecessors } = this.initializeAlgorithm(startNode);
        const priorityQueue = new Set(this.nodes);

        while (priorityQueue.size > 0) {
            const currentNode = [...priorityQueue].reduce((minNode, node) => 
                distances.get(node) < distances.get(minNode) ? node : minNode
            );

            priorityQueue.delete(currentNode);

            this.edges.get(currentNode).forEach(({ node, weight }) => {
                if (priorityQueue.has(node)) {
                    const newDistance = distances.get(currentNode) + weight;
                    if (newDistance < distances.get(node)) {
                        distances.set(node, newDistance);
                        predecessors.set(node, currentNode);
                    }
                }
            });
        }

        return { distances, predecessors };
    }

    // Implementación de Bellman-Ford
    bellmanFord(startNode) {
        const { distances, predecessors } = this.initializeAlgorithm(startNode);
        const edgeList = this.getEdgeList();

        // Relajación de aristas
        for (let i = 0; i < this.nodes.size - 1; i++) {
            for (const { source, destination, weight } of edgeList) {
                if (distances.get(source) + weight < distances.get(destination)) {
                    distances.set(destination, distances.get(source) + weight);
                    predecessors.set(destination, source);
                }
            }
        }

        // Verificar ciclos negativos
        for (const { source, destination, weight } of edgeList) {
            if (distances.get(source) + weight < distances.get(destination)) {
                throw new Error("El grafo contiene un ciclo negativo");
            }
        }

        return { distances, predecessors };
    }

    // Método auxiliar para obtener lista de aristas
    getEdgeList() {
        const edgeList = [];
        this.edges.forEach((neighbors, source) => {
            neighbors.forEach(({ node: destination, weight }) => {
                edgeList.push({ source, destination, weight });
            });
        });
        return edgeList;
    }
}

// Clase para manejar el grafo específico de Perú
class PeruGraph extends Graph {
    constructor(nodos, coordenadas, conexiones) {
        super();
        this.coordenadas = coordenadas;
        this.initializeGraph(nodos, conexiones);
    }

    initializeGraph(nodos, conexiones) {
        // Agregar nodos
        nodos.forEach(nodo => this.addNode(nodo));

        // Agregar conexiones con distancias calculadas
        conexiones.forEach(([inicio, fin]) => {
            const [lon1, lat1] = this.coordenadas[inicio];
            const [lon2, lat2] = this.coordenadas[fin];
            const distancia = GraphUtils.calculateDistance(lat1, lon1, lat2, lon2);
            this.addEdge(inicio, fin, distancia);
        });
    }
}

// Ejemplo de uso
const nodos = [
    "Nodo Lima 1", "Nodo Lima 2", "Nodo Lima 3", "Nodo Lima 4", "Nodo Lima 5",
    "Nodo Lima 6", "Nodo Lima 7", "Nodo Lima 8", "Nodo Lima 9", "Nodo Lima 10",
    "Nodo Lima 11", "Nodo Lima 12", "Nodo Lima 13", "Nodo Lima 14",
    "Nodo Ica 1", "Nodo Ica 2", "Nodo Ica 3", "Nodo Ica 4", "Nodo Ica 5", "Nodo Ica 6",
    "Nodo Arequipa 1", "Nodo Arequipa 2", "Nodo Arequipa 3", "Nodo Arequipa 4"
];

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

// Crear instancia del grafo de Perú
const peruGraph = new PeruGraph(nodos, coordenadas, conexiones);

