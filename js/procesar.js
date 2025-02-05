

document.getElementById('bttnProcces').addEventListener('click', ()=>{
    const nodoInicial = document.getElementById('nodo-1').value;
    const nodoFinal = document.getElementById('nodo-2').value;

    if (!nodoInicial || !nodoFinal) {
        alert('Por favor selecciona ambos nodos');
        return;
    }

    showRouteOnMap(nodoInicial, nodoFinal);

    /*
    let obj = peruGraph.shortestPath(origen, destino);

    

    let ruta = obj.path;
    let dist = obj.distance;
    console.log(ruta);

    let divpath = document.getElementById('path');
    let pa = '';
    ruta.forEach((re)=>{
        pa += `<div class= "paths">${re}</div>`;
    });
    divpath.innerHTML = pa;

    document.querySelector('.distancia').innerHTML = 'Distancia: '+dist+' Km';
    */
})


