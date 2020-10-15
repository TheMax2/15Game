/**
 * Class to represent a centisecond timer. (accurate to 1 hundrenth of a second).
 */
function Timer(){
    // time in centi seconds (although refered to as miliseconds)
    this.time = 0;
    // html labels
    this.minutesLabel = document.getElementById("minutes");
    this.secondsLabel = document.getElementById("seconds");
    this.milisecondsLabel = document.getElementById("miliseconds");
    // boolean to determin if the timer is counting or stopped
    this.counting = false; // timer initially isnt counting;
    // the timer
    this.interval = setInterval(()=>{this.setTime()}, 10);
}

/** Starts the timer. */
Timer.prototype.start = function() {
    this.counting = true;
    this.reset();
}
/** Pauses the timer. */
Timer.prototype.pause = function(){
    this.counting = false;
}
/** Stops and resets the timer. */
Timer.prototype.stop = function() {
    this.counting = false;
    this.time = 0;
    this.reset();
}
/** Restarts the timer. */
Timer.prototype.restart = function() {
    this.counting = true;
    this.time = 0;
    this.reset();
}
/** Resets the timer (Helper method). */
Timer.prototype.reset = function(){
    clearInterval(this.interval);
    this.interval = setInterval(()=>{this.setTime()}, 10);
    this.setTime();
}

/** Sets the time on the html element */
Timer.prototype.setTime = function() {
    if (this.counting) ++this.time;
    this.milisecondsLabel.innerHTML = this.pad(this.time % 100);
    this.secondsLabel.innerHTML = this.pad(Math.floor(this.time/100) % 60);
    this.minutesLabel.innerHTML = this.pad(parseInt(Math.floor(this.time/100) / 60));
}

/** Formats the minutes, seconds, miliseconds */
Timer.prototype.pad = function(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

/** Returns the time in centi seconds since start */
Timer.prototype.getTime = function(){
    return this.time;
}

/** Returns the time as a string */
Timer.prototype.getTimeString = function(){
    return this.pad(parseInt(Math.floor(this.time/100) / 60))+":"+this.pad(Math.floor(this.time/100) % 60)+":"+this.pad(this.time % 100);
}