/**
 * Calcula la distancia entre dos puntos usando la formula del haversine
 * Lat X: latitud
 * Lon X: Longitud
 * reconstructPath: forma el camino de nodos
 */
class Tools {

    static calculateDistance(lat1, lon1, lat2, lon2) {
      // Formula de harvesine
      const R = 6371; // Radio de la Tierra en kilómetros
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
  
    // Reconstruye el camino desde el nodo final hasta el inicial usando predecesores
    static reconstructPath(predecessors, end) {
      const path = [];
      let currentNode = end;
  
      while (currentNode !== null) {
        //agrega un nodo al array path
        path.unshift(currentNode);
        //obtiene el nodo anterior del nodo actual
        currentNode = predecessors.get(currentNode);
      }
  
      return path;
    }
  }