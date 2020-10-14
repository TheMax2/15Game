console.log("connected to main");

var gridSize = 3;
var grid;

function main(){
    grid = new Grid(gridSize);
    document.getElementById('shuffle').addEventListener("click", shuffle);
}
main();

function shuffle(){
    grid.shuffle();
}
