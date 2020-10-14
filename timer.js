
function Timer(){
    this.time = 0;
    this.minutesLabel = document.getElementById("minutes");
    this.secondsLabel = document.getElementById("seconds");
    this.milisecondsLabel = document.getElementById("miliseconds");
    this.counting = false; // timer initially isnt counting;
    this.interval = setInterval(()=>{this.setTime()}, 10);
}

Timer.prototype.start = function() {
    this.counting = true;
    this.reset();
}

Timer.prototype.pause = function(){
    this.counting = false;
}

Timer.prototype.stop = function() {
    this.counting = false;
    this.time = 0;
    this.reset();
}

Timer.prototype.restart = function() {
    this.counting = true;
    this.time = 0;
    this.reset();
}

Timer.prototype.reset = function(){
    clearInterval(this.interval);
    this.interval = setInterval(()=>{this.setTime()}, 10);
    this.setTime();
}


Timer.prototype.setTime = function() {
    if (this.counting) ++this.time;
    this.milisecondsLabel.innerHTML = this.pad(this.time % 100);
    this.secondsLabel.innerHTML = this.pad(Math.floor(this.time/100) % 60);
    this.minutesLabel.innerHTML = this.pad(parseInt(Math.floor(this.time/100) / 60));
}

Timer.prototype.pad = function(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

Timer.prototype.getTime = function(){
    return this.pad(parseInt(this.time / 60))+":"+this.pad(this.time % 60);
}