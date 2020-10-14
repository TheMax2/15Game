console.log("connected to main");

var gridSize = 4; // default grid size;
var grid;

function main(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('size')){
        gridSize = parseInt(urlParams.get('size'));
    }
    if (gridSize == null || gridSize == undefined || gridSize == "" || gridSize < 3 || gridSize > 10) gridSize = 4;
    grid = new Grid(gridSize);
    document.getElementById('size').value = gridSize;
    document.getElementById('shuffle').addEventListener("click", shuffle);
    document.getElementById('size-btn').addEventListener("click", recreateGrid);
}
main();

function shuffle(){
    grid.shuffle();
}

function recreateGrid(){
    
    var n = document.getElementById("size").value;
    if (n == null || n == undefined || n == "" || n < 3 || n > 10) return;
    
    gridSize = n;
    var url = window.location.href;
    var u = url.split('?'); 
    url = u[0];
    url += '?size='+gridSize;
    window.location.href = url;
}
