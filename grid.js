
/**
 * Class to act as a grid of a 15 square game.
 * To win, put all the shuffled squares in a 4 by 4
 * grid in order. Stores all square objects in a 2d array.
 * @param {the number of squares in each row} size 
 */
function Grid(size){
    // size of grid (length of one side)
    this.size = size;
    // the entire grid represented as a 1d array
    // used for checking if player has won
    this.arrGrid = new Array(size*size);
    // physical grid html element
    this.docGrid = document.getElementById("grid");
    // boolean for if animations are playing
    this.animation = true;
    // number of moves player has made
    this.moves = 0;
    // Custom Timer object
    this.timer = new Timer();
    // boolean for if the board is shuffled or solved
    this.shuffled = false;

    // initializes docGrid
    var docGridString = "";
    for (var i=0; i<size; i++){
        docGridString += " 120px";
    }
    this.docGrid.style.gridTemplateColumns = docGridString;
    this.docGrid.style.gridTemplateRows = docGridString;

    // initializes grid
    for (var i = 1; i <= size*size; i++){
        var square = new Square(i, this);
        this.arrGrid[i-1] = square;
    }
    this.gridGrid = this.getGrid();
    this.draw();
}

/**
 * Creates the 2d array based off of the 1d array. Mainly only
 * used as a helper method for the constructor.
 * Algorith uses 2 nested for loops to fill rows with squares and 
 * fill the grid with rows. Grid follows format [y][x]
 */
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

/**
 * Refreshes arrGrid. Used mainly for checking if game has been won.
 */
Grid.prototype.refreshArr = function(){
    var i = 0;
    this.gridGrid.forEach(row => {
        row.forEach(square => {
            this.arrGrid[i] = square;
            i++;
        })
    })
}

/**
 * Refreshes screen. Redraws virtual grid onto physical grid.
 */
Grid.prototype.draw = function(){
    this.docGrid.innerHtml = "";
    this.refreshArr();
    this.arrGrid.forEach(square => {
        this.docGrid.appendChild(square.div);
    });
    // everytime the screen is redrawn, all animations must be killed.
    this.arrGrid.forEach(square => {
        if (square.animation) square.animation.cancel();
    })
}

/**
 * Shuffles the board and starts or restarts the game
 */
Grid.prototype.start = function(){
    // resets moves to 0
    this.moves = 0;
    document.getElementById("moves").innerHTML = 0;
    // hides win panel
    document.getElementById("winPanel").style.visibility = "hidden";
    // shuffles board. animation should be turned off.
    this.shuffled = true;
    var temp = this.animation;
    this.animation = false;
    this.arrGrid.forEach(square => {square.shuffle()});
    this.animation = temp;
    // resets timer
    this.timer.stop();
    
}

/**
 * Checks if the board is in a winning state. Returns a boolean: true if has won.
 */
Grid.prototype.hasWon = function(){
    // this might be confusing: if the grid is already solved the player can not win again.
    if (!this.shuffled) return false;
    var res = true;
    this.refreshArr(); //should already be refreshed but just in case.
    // checks if each square is in the right order
    var i = 1;
    this.arrGrid.forEach(square => {
        if (square.number != i) res = false;
        i++;
    });
    return res;
}

/**
 * Wins the game.
 */
Grid.prototype.win = function(){
    // displays the win panel
    document.getElementById("winPanel").style.visibility = "visible";
    document.getElementById("finalTime").innerHTML = "Time: " + this.timer.getTimeString();
    document.getElementById("finalMoves").innerHTML = "Moves: " + this.moves;
    console.log("Player has won!");
    // stops timer
    this.timer.pause();
    // makes it impossible to win again until board is reshuffled
    this.shuffled = false;
}

