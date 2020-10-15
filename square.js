function Square(number, grid){
    this.number = number;
    this.position = {x:(number-1)%grid.size, y:Math.floor((number-1)/grid.size)};
    this.grid = grid;
    this.size = 92;
    this.moveSpeed = 80;
    this.animation = new Animation();
    
    this.div = document.createElement("div");
    this.div.classList.add('noselect');
    if (number >= grid.size*grid.size) {
        this.isBlank = true;
    } else {
        this.div.classList.add("square");
        this.div.innerHTML = number;
        this.div.addEventListener("click", () => {
            if (!this.grid.shuffled) return;
            if (this.grid.moves === 0) this.grid.timer.start();
            this.tryToMove();
            this.grid.moveSpan.innerHTML = this.grid.moves;
            
        })
    }
    if (this.isBlank){
        var that = this;
        window.addEventListener("keydown", function(event) {
            if (!that.grid.shuffled) return;
            if (event.code=="ArrowUp"||event.code=="ArrowDown"||
                    event.code=="ArrowLeft"||event.code=="ArrowRight"){
                if (this.grid.moves === 0) this.grid.timer.start();
                event.preventDefault();
            }
            // Keys are inverted because it is more intuative this way
            if (event.code=="ArrowUp") that.tryDown();
            if (event.code=="ArrowDown") that.tryUp();
            if (event.code=="ArrowLeft") that.tryRight();
            if (event.code=="ArrowRight") that.tryLeft();
            if (event.code=="Enter") that.grid.shuffle();
            if (event.code=="KeyT") {
                console.log("testing");
                
            }
            this.grid.moveSpan.innerHTML = this.grid.moves;
            
          }, true);
    }
}

Square.prototype.animateUp = function() {
    var that = this;
    this.animation = this.div.animate([
        { transform: 'translateY(-'+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}
Square.prototype.animateDown = function() {
    var that = this;
    this.animation = this.div.animate([
        { transform: 'translateY('+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}
Square.prototype.animateRight = function() {
    var that = this;
    this.animation = this.div.animate([
        { transform: 'translateX('+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}
Square.prototype.animateLeft = function() {
    var that = this;
    this.animation = this.div.animate([
        { transform: 'translateX(-'+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}

Square.prototype.controlAnimation = function(){
    var that = this;
    this.animation.onfinish = function() {
        that.grid.draw();
        if(that.grid.hasWon()) that.grid.win();
    }
}

Square.prototype.moveUp = function() {
    if (this.grid.animation) this.animateUp();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y-1][p.x]);
    this.grid.moves++;
}
Square.prototype.moveDown = function() {
    if (this.grid.animation) this.animateDown();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y+1][p.x]);
    this.grid.moves++;
}
Square.prototype.moveLeft = function() {
    if (this.grid.animation) this.animateLeft();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y][p.x-1]);
    this.grid.moves++;
}
Square.prototype.moveRight = function() {
    if (this.grid.animation) this.animateRight();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y][p.x+1]);
    this.grid.moves++;
}

Square.prototype.tryUp = function() {
    if (this.position.y <= 0) return false;
    var p = this.position;
    if (this.isBlank){
        this.grid.gridGrid[p.y-1][p.x].moveDown();
        return true;
    } 
    for (var i=p.y-1; i>=0; i--){
        var otherSquare = this.grid.gridGrid[i][p.x];
        if (otherSquare.isBlank){
            for (var j=i+1; j<=p.y; j++){
                this.grid.gridGrid[j][p.x].moveUp();       
            }
            return true;
        } 
    }
    return false;
}
Square.prototype.tryDown = function() {
    if (this.position.y >= this.grid.size-1) return false;
    var p = this.position;
    if (this.isBlank){
        this.grid.gridGrid[p.y+1][p.x].moveUp();
        return true;
    } 
    for (var i=p.y+1; i<=this.grid.size-1; i++){
        var otherSquare = this.grid.gridGrid[i][p.x];
        if (otherSquare.isBlank){
            for (var j=i-1; j>=p.y; j--){
                this.grid.gridGrid[j][p.x].moveDown();       
            }
            return true;
        } 
    }
    return false;
}
Square.prototype.tryLeft = function() {
    if (this.position.x <= 0) return false;
    var p = this.position;
    if (this.isBlank){
        this.grid.gridGrid[p.y][p.x-1].moveRight();
        return true;
    } 
    for (var i=p.x-1; i>=0; i--){
        var otherSquare = this.grid.gridGrid[p.y][i];
        if (otherSquare.isBlank){
            for (var j=i+1; j<=p.x; j++){
                this.grid.gridGrid[p.y][j].moveLeft();       
            }
            return true;
        } 
    }
    return false;
}
Square.prototype.tryRight = function() {
    if (this.position.x >= this.grid.size-1) return false;
    var p = this.position;
    if (this.isBlank){
        this.grid.gridGrid[p.y][p.x+1].moveLeft();
        return true;
    } 
    for (var i=p.x+1; i<=this.grid.size-1; i++){
        var otherSquare = this.grid.gridGrid[p.y][i];
        if (otherSquare.isBlank){
            for (var j=i-1; j>=p.x; j--){
                this.grid.gridGrid[p.y][j].moveRight();       
            }
            return true;
        } 
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

// uses the last (empty square) to shuffle the entire board
Square.prototype.shuffle = function(){
    if (!this.isBlank) return;
    var iterations = 1000 * grid.size;
    for (var i=0; i<iterations; i++){
        var rand = Math.floor(Math.random() * 4);
        var p = this.position;
        if        (rand === 0 && !(this.position.y <= 0)){ // up
            this.grid.gridGrid[p.y-1][p.x].tryToMove();
        } else if (rand === 1 && !(this.position.y >= this.grid.size-1)){ // down
            this.grid.gridGrid[p.y+1][p.x].tryToMove();
        } else if (rand === 2 && !(this.position.x <= 0)){ // left
            this.grid.gridGrid[p.y][p.x-1].tryToMove();
        } else if (rand === 3 && !(this.position.x >= this.grid.size-1)){ // right
            this.grid.gridGrid[p.y][p.x+1].tryToMove();;
        }
    }
    
    this.grid.draw();
}
