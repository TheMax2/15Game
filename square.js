function Square(number, grid){
    this.number = number;
    this.position = {x:(number-1)%grid.size, y:Math.floor((number-1)/grid.size)};
    this.grid = grid;
    this.size = 92;
    this.moveSpeed = 40;
    this.div = document.createElement("div");
    
    if (number >= grid.size*grid.size) {
        this.isBlank = true;
    } else {
        this.div.classList.add("square");
        this.div.innerHTML = number;
        this.div.addEventListener("click", () => {
            this.tryToMove();
        })
    }
}

Square.prototype.animateUp = function() {
    var that = this;
    this.div.animate([
        { transform: 'translateY(-'+this.size+'px)' },
    ], this.moveSpeed)
    .onfinish = function() {
        that.grid.draw();
    };
}
Square.prototype.animateDown = function() {
    var that = this;
    this.div.animate([
        { transform: 'translateY('+this.size+'px)' },
    ], this.moveSpeed)
    .onfinish = function() {
        that.grid.draw();
    };
}
Square.prototype.animateRight = function() {
    var that = this;
    this.div.animate([
        { transform: 'translateX('+this.size+'px)' },
    ], this.moveSpeed)
    .onfinish = function() {
        that.grid.draw();
    };
}
Square.prototype.animateLeft = function() {
    var that = this;
    this.div.animate([
        { transform: 'translateX(-'+this.size+'px)' },
    ], this.moveSpeed)
    .onfinish = function() {
        that.grid.draw();
    };
}

Square.prototype.moveUp = function() {
    this.animateUp();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y-1][p.x]);
}
Square.prototype.moveDown = function() {
    this.animateDown();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y+1][p.x]);
}
Square.prototype.moveLeft = function() {
    this.animateLeft();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y][p.x-1]);
}
Square.prototype.moveRight = function() {
    this.animateRight();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y][p.x+1]);
}

Square.prototype.tryUp = function() {
    if (this.position.y <= 0) return false;
    var p = this.position;
    var otherSquare = this.grid.gridGrid[p.y-1][p.x];
    if (otherSquare.isBlank){
        this.moveUp(); 
        return true;
    } 
    return false;
}
Square.prototype.tryDown = function() {
    if (this.position.y >= this.grid.size-1) return false;
    var p = this.position;
    var otherSquare = this.grid.gridGrid[p.y+1][p.x];
    if (otherSquare.isBlank){
        this.moveDown();
        return true;
    } 
    return false;
}
Square.prototype.tryLeft = function() {
    if (this.position.x <= 0) return false;
    var p = this.position;
    var otherSquare = this.grid.gridGrid[p.y][p.x-1];
    if (otherSquare.isBlank){
        this.moveLeft();
        return true;
    } 
    return false;
}
Square.prototype.tryRight = function() {
    if (this.position.x >= this.grid.size-1) return false;
    var p = this.position;
    var otherSquare = this.grid.gridGrid[p.y][p.x+1];
    if (otherSquare.isBlank){
        this.moveRight();
        return true;
    } 
    return false;
}

Square.prototype.tryToMove = function() {
    if (this.tryUp()) return;
    if (this.tryDown()) return;
    if (this.tryLeft()) return;
    if (this.tryRight()) return;
    return;
}

Square.prototype.swap = function(otherSquare){
    if (otherSquare === undefined || otherSquare == null) return;
    var temp = otherSquare.position;
    otherSquare.position = this.position;
    this.position = temp;
    var tp = this.position;
    var op = otherSquare.position;
    this.grid.gridGrid[op.y][op.x] = otherSquare;
    this.grid.gridGrid[tp.y][tp.x] = this;
}