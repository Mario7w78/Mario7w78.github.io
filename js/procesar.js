

document.getElementById('bttnProcces').addEventListener('click', ()=>{
    const nodoInicial = document.getElementById('nodo-1').value;
    const nodoFinal = document.getElementById('nodo-2').value;

    if (!nodoInicial || !nodoFinal) {
        alert('Por favor selecciona ambos nodos');
        return;
    }



    const obj = showRouteOnMap(nodoInicial, nodoFinal, 'dijkstra');
    obj.kmlContent;
    let dist = obj.distance.toFixed(2);
    let tiempo = obj.executionTime.toFixed(3);
    document.querySelector('.distancia-dijkstra').innerHTML = 'Distancia: '+dist+' Km';
    document.querySelector('.tiempo-dijkstra').innerHTML = 'Tiempo de ejecución: '+tiempo+' ms';
})

document.getElementById('bttnProcces2').addEventListener('click', ()=>{
    event.stopPropagation();
    const nodoInicial = document.getElementById('nodo-1').value;
    const nodoFinal = document.getElementById('nodo-2').value;

    if (!nodoInicial || !nodoFinal) {
        alert('Por favor selecciona ambos nodos');
        return;
    }

    const obj = showRouteOnMap(nodoInicial, nodoFinal, 'bellmanford');

    obj.kmlContent;
    let dist = obj.distance.toFixed(2);
    let tiempo = obj.executionTime.toFixed(3);
    document.querySelector('.distancia-bellman').innerHTML = 'Distancia: '+dist+' Km';
    document.querySelector('.tiempo-bellman').innerHTML = 'Tiempo de ejecución: '+tiempo+' ms';
 
})
