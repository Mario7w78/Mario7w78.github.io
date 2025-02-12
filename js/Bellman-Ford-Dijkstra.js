// Clase base para el grafo
class Graph {
  constructor() {
    this.nodes = new Set(); // Conjunto de nodos (colección de valores únicos)
    this.edges = new Map(); // Mapa de aristas (nodo -> [{ node, weight }])
  }

  // Agrega un nodo al grafo
  addNode(node) {
    this.nodes.add(node);
    this.edges.set(node, []);
  }

  // Agrega una arista bidireccional con un peso
  addEdge(start, end, weight) {
    this.edges.get(start).push({ node: end, weight });
    this.edges.get(end).push({ node: start, weight });
  }

  // Inicializa las estructuras de datos para los algoritmos
  initializeAlgorithm(startNode) {
    const distances = new Map();
    const predecessors = new Map();

    //Inicializar cada nodo del grafo para luego actualizar su valor
    this.nodes.forEach((node) => {
      distances.set(node, Infinity); // Distancia infinita por defecto
      predecessors.set(node, null); // Sin predecesor
    });

    // Poner distancia del nodo Origen 0 ya que es el inicial
    distances.set(startNode, 0);

    //devuelve la distancias entre nodos y sus predecesores
    return { distances, predecessors };
  }

  // Método para obtener el camino más corto entre dos nodos
  shortestPath(start, end, algorithm = "dijkstra") {
    //Algoritmo por defecto es dijkstra
    //si no es dijkstra se usa bellman-ford
    try {
      // Se guarda en un objeto las distancias y predecesores calculadas
      const { distances, predecessors, executionTime } =
        algorithm === "dijkstra" ? this.dijkstra(start, end) : this.bellmanFord(start, end);

      // Path es el camino mas corto procesado por uno de los dos algoritmos
      const path = Tools.reconstructPath(predecessors, end);
      
      // si path no esta vacio retornara, el camino mas corto y la distancia total
      // si path solo tiene al origen osea vacio devolvera un camino vacio y distancia infinita

      return path.length > 1 ? { path, distance: distances.get(end), executionTime} : { path: [], distance: Infinity };
    } catch (error) {

      console.error(`Error en ${algorithm}:`, error.message);
      return { path: [], distance: Infinity };

    }
  }

  // Algoritmo dijkstra

  // En la primera iteracion solo distancias el nodo origen tiene distancia 0 y los demas infinito
  //  por lo tanto ese es el menor primero

  dijkstra(startNode, endNode) {
    //Inicializa los nodos
    /**
     * priorityQueue contiene todos los nodos del grafo para seleccionar
     * el nodo con la distancia más corta en cada iteración.
     */
    const startTime = performance.now();

    const { distances, predecessors } = this.initializeAlgorithm(startNode);
    const priorityQueue = new Set(this.nodes);

    while (priorityQueue.size > 0) {
      // [...priorityQueue] convierte el set en un array
      /**
       * Reduce es una funcion que itera el array
       * tiene (acumulador, valor)
       * el acumulador es el primer elemento del array inicialmente
       * y el valor es el segundo elemento inicialmente
       * luego de realizar la operacion de la funcion por cada iteracion
       * el resultado se guarda en el acumulador y sigue con la iteracion
       * en este caso se compara las distancias de los nodos y se guarda el menor
       */

      const currentNode = [...priorityQueue].reduce((minNode, node) => {
        return distances.get(node) < distances.get(minNode) ? node : minNode;
      });

      // Si llegamos al nodo destino, terminamos
      if (currentNode === endNode) break;

      //Se elimina el nodo para continuar con los demas
      priorityQueue.delete(currentNode);

      /**
       * Edges tiene cada nodo con todos sus nodos vecinos
       * en este caso se va a recorrer el array de vecinos
       * si el nodo no esta en la cola de prioridad entonces no es necesario realizar esta operacion
       * si está, entonces se crea una variable newdistance
       * newdistance es la distancia del nodo actual + distancia hacia nodo vecino
       * si newdistance es menor que la distancia entre el nodo actual y el vecino ese es el menor camino
       * Esto se hace por cada vecino
       * Luego acutaliza la distancias y predecesores
       */
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

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(executionTime);
    return { distances, predecessors, executionTime };
  }

  bellmanFord(startNode, endNode) {
    const startTime = performance.now();
    const { distances, predecessors } = this.initializeAlgorithm(startNode);
    const edgeList = this.getEdgeList();

    let changed;

    for (let i = 0; i < this.nodes.size - 1; i++) {
      changed = false;

      for (const { source, destination, weight } of edgeList) {
        if (distances.get(source) + weight < distances.get(destination)) {
          distances.set(destination, distances.get(source) + weight);
          predecessors.set(destination, source);
          changed = true;
        }
      }

      // Si no hubo cambios en esta iteración, terminamos
      if (!changed) break;
    }

    // Verificar ciclos negativos
    for (const { source, destination, weight } of edgeList) {
      if (distances.get(source) + weight < distances.get(destination)) {
        throw new Error("El grafo contiene un ciclo negativo");
      }
    }

    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(executionTime);
    return { distances, predecessors, executionTime };
  }

  // Obtiene una lista de todas las aristas en el grafo
  //getedgelist
  /**
   * Recorre el mapa de edges (conexiones)
   * Extrae (Conexiones o vecinos, nodo clave)
   * Se recorre neighbors (es un array) con todos los vecinos del nodo
   * luego guarda en un objeto, el nodo
   */
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

  // Inicializa el grafo con nodos y conexiones
  initializeGraph(nodos, conexiones) {
    nodos.forEach((nodo) => this.addNode(nodo));

    conexiones.forEach(([inicio, fin]) => {
      const [lon1, lat1] = this.coordenadas[inicio];
      const [lon2, lat2] = this.coordenadas[fin];
      const distancia = Tools.calculateDistance(lat1, lon1, lat2, lon2);
      this.addEdge(inicio, fin, distancia);
    });
  }
}

// Ejemplo de uso
const nodos = [
  "Nodo Lima 1",
  "Nodo Lima 2",
  "Nodo Lima 3",
  "Nodo Lima 4",
  "Nodo Lima 5",
  "Nodo Lima 6",
  "Nodo Lima 7",
  "Nodo Lima 8",
  "Nodo Lima 9",
  "Nodo Lima 10",
  "Nodo Lima 11",
  "Nodo Lima 12",
  "Nodo Lima 13",
  "Nodo Lima 14",
  "Nodo Ica 1",
  "Nodo Ica 2",
  "Nodo Ica 3",
  "Nodo Ica 4",
  "Nodo Ica 5",
  "Nodo Ica 6",
  "Nodo Arequipa 1",
  "Nodo Arequipa 2",
  "Nodo Arequipa 3",
  "Nodo Arequipa 4",
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
  "Nodo Arequipa 4": [-72.70458, -16.63171],
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
  ["Nodo Arequipa 3", "Nodo Arequipa 4"],
];

// Crear instancia del grafo de Perú
const peruGraph = new PeruGraph(nodos, coordenadas, conexiones);
