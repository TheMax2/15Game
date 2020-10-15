
/**
 * Class to represent a single square for the 15 game.
 * @param {the number of the square} number 
 * @param {refrence to the grid} grid 
 */
function Square(number, grid){
    // number of the square
    this.number = number;
    // position in grid. Format {x,y}.
    this.position = {x:(number-1)%grid.size, y:Math.floor((number-1)/grid.size)};
    // Reference to the grid. Not another grid!
    this.grid = grid;
    // size of the physical square in pixels
    this.size = 92;
    // time it takes to move from 1 square to another in miliseconds
    this.moveSpeed = 80;
    // the squares animation
    this.animation = new Animation();
    // the physical html square
    this.div = document.createElement("div");
    this.div.classList.add('noselect');

    // Sets the last square to be blank.
    // Adds a keyboard listener to the blank square 
    // and a mouse listener to the other squares.
    if (number >= grid.size*grid.size) {
        this.isBlank = true;
        window.addEventListener("keydown", (event) => {
            // deactivates controls if the grid is solved
            if (!this.grid.shuffled) return;

            if (event.code=="ArrowUp"||event.code=="ArrowDown"||
                    event.code=="ArrowLeft"||event.code=="ArrowRight"){
                // timer starts when the first key is pressed
                if (this.grid.moves === 0) this.grid.timer.start();
                event.preventDefault();
            }
            // Keys are inverted because it is more intuative this way
            if (event.code=="ArrowUp") this.tryDown();
            if (event.code=="ArrowDown") this.tryUp();
            if (event.code=="ArrowLeft") this.tryRight();
            if (event.code=="ArrowRight") this.tryLeft();
            if (event.code=="Enter") this.grid.shuffle();
            // put functions to test here
            if (event.code=="KeyT") {
                console.log("testing");
            }
            // displays moves
            document.getElementById("moves").innerHTML = this.grid.moves;
            
        }, true);
    } else {
        // creates genaric square
        this.div.classList.add("square");
        this.div.innerHTML = number;
        this.div.addEventListener("click", () => {
            // same as keyboard but with mouse
            if (!this.grid.shuffled) return;
            if (this.grid.moves === 0) this.grid.timer.start();
            this.tryToMove();
            document.getElementById("moves").innerHTML = this.grid.moves;
        })
    }
}

// Animation Methods. each method animates the square moving in 1 of the 4 directions.
// Note: does not actually move the squares in the grid. just gives the illusion.
/** Animate square moving Up */
Square.prototype.animateUp = function() {
    this.animation = this.div.animate([
        { transform: 'translateY(-'+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}
/** Animate square moving Down */
Square.prototype.animateDown = function() {
    this.animation = this.div.animate([
        { transform: 'translateY('+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}
/** Animate square moving Right */
Square.prototype.animateRight = function() {
    this.animation = this.div.animate([
        { transform: 'translateX('+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}
/** Animate square moving Left */
Square.prototype.animateLeft = function() {
    this.animation = this.div.animate([
        { transform: 'translateX(-'+this.size+'px)' },
    ], this.moveSpeed);
    this.controlAnimation();
}
/** helper method for animation methods */
Square.prototype.controlAnimation = function(){
    var that = this;
    this.animation.onfinish = function() {
        that.grid.draw();
        if(that.grid.hasWon()) that.grid.win();
    }
}

// Attempts to move the square in one of the 4 adjacent directions
// Will fail if there it is trying to move into a wall
// Will succeed if the square is in the same row/collumn as the empty square
/** Attempts to move square Up */
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
/** Attempts to move square Down */
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
/** Attempts to move square Left */
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
/** Attempts to move square Right */
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

/**
 * Attempts to move the square in any direction possible.
 * Used for when the player clicks on the square.
 */
Square.prototype.tryToMove = function() {
    if (this.tryUp()) return;
    if (this.tryDown()) return;
    if (this.tryLeft()) return;
    if (this.tryRight()) return;
    return;
}

// Actually moves the square in the grid to one of the for adjacent directions
/** Moves the square Up */
Square.prototype.moveUp = function() {
    if (this.grid.animation) this.animateUp();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y-1][p.x]);
    this.grid.moves++;
}
/** Moves the square Down */
Square.prototype.moveDown = function() {
    if (this.grid.animation) this.animateDown();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y+1][p.x]);
    this.grid.moves++;
}
/** Moves the square Left */
Square.prototype.moveLeft = function() {
    if (this.grid.animation) this.animateLeft();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y][p.x-1]);
    this.grid.moves++;
}
/** Moves the square Right */
Square.prototype.moveRight = function() {
    if (this.grid.animation) this.animateRight();
    var p = this.position;
    this.swap(this.grid.gridGrid[p.y][p.x+1]);
    this.grid.moves++;
}

/**
 * Swaps this square with the other square in the grid
 * @param {The other square to swap with} otherSquare 
 */
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

/** 
 * Uses the last (empty square) to shuffle the entire board
 * by randomly swapping it with adjacent squares.
 * You cant just put random numbers on the squares because certain
 * grid permutations are unsolvable. Although this is not the best
 * algorithm it still runs in linear time
*/
Square.prototype.shuffle = function(){
    // Only the last square should be shuffleing.
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
