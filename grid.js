function Grid(size){
    this.size = size;
    this.arrGrid = new Array(size*size);
    this.docGrid = document.getElementById("grid");
    for (var i = 1; i <= 16; i++){
        var square = new Square(i, this);
        this.arrGrid[i-1] = square;
    }
    console.log(this.arrGrid);
    this.gridGrid = this.getGrid();
    this.draw();
}

Grid.prototype.getGrid = function(){
    var res = new Array(this.size);
    for (var i=0; i<this.size; i++){
        var row = new Array();
        for (var j=i*this.size; j<i*this.size+this.size; j++){
            row.push(this.arrGrid[j]);
        } 
        res[i] = row;
    }
    return res;
}

Grid.prototype.refreshArr = function(){
    var i = 0;
    this.gridGrid.forEach(row => {
        row.forEach(square => {
            this.arrGrid[i] = square;
            i++;
        })
    })
}

Grid.prototype.draw = function(){
    this.docGrid.innerHtml = "";
    this.refreshArr();
    this.arrGrid.forEach(square => {
        this.docGrid.appendChild(square.div);
    });
    console.log(this.gridGrid);
}

