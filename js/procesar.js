

document.getElementById('bttnProcces').addEventListener('click', ()=>{
    const nodoInicial = document.getElementById('nodo-1').value;
    const nodoFinal = document.getElementById('nodo-2').value;

    if (!nodoInicial || !nodoFinal) {
        alert('Por favor selecciona ambos nodos');
        return;
    }

    showRouteOnMap(nodoInicial, nodoFinal, 'dijkstra');


    let obj = peruGraph.shortestPath(nodoInicial, nodoFinal, 'dijkstra');

    let dist = obj.distance.toFixed(2);
    document.querySelector('.distancia-dijkstra').innerHTML = 'Distancia: '+dist+' Km';
  
})

document.getElementById('bttnProcces2').addEventListener('click', ()=>{
    const nodoInicial = document.getElementById('nodo-1').value;
    const nodoFinal = document.getElementById('nodo-2').value;

    if (!nodoInicial || !nodoFinal) {
        alert('Por favor selecciona ambos nodos');
        return;
    }

    showRouteOnMap(nodoInicial, nodoFinal, 'bellmanford');


    let obj = peruGraph.shortestPath(nodoInicial, nodoFinal, 'bellmanford');

    let dist = obj.distance.toFixed(2);
    document.querySelector('.distancia-bellman').innerHTML = 'Distancia: '+dist+' Km';
 
})
