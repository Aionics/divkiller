/**
 * Created by Dmitry on 22.03.2016.
 */

var canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d'),

    parts = [],               // Particle count handling
    partCount = 100,
    partsFull = false,
    radius = 50,
    running = true,           // play-pause switch
    hueRange = 40,
    globalTick = 0,
    rand = function(min, max) {
        return Math.floor( (Math.random() * (max - min + 1) ) + min);
    };

fitToContainer(canvas);

// canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
// canvas.height = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function fitToContainer(canvas){
    canvas.style.width='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

var cw = canvas.width / 2;
var centerX = canvas.width / 2;
var ch = canvas.height / 2;
var centerY = canvas.height / 2;

// Controllers (event handlers) /////////////////////////////////
document.addEventListener("mousemove", changeCoords);
// canvas.onmousemove = changeCoords;
window.onresize = resizeScreen;
document.onkeydown = pausePlay;

function changeCoords(event) {
    event = event || window.event; // (*)
    // Now event is an event object in every browser.

    centerX = event.clientX;
    centerY = event.clientY;

    cw = event.clientX;
    ch = event.clientY;
}

function resizeScreen(event) {
    fitToContainer();
}

function pausePlay(event) {
    running = !running;
}
// Controllers end (event handlers) /////////////////////////////////

function restoreFlame() {
    var i = parts.length;
    parts.splice(0, i);
    partsFull = false;
}


var Part = function(){
    this.reset(); // constructor for initial params
};

// Reset class-type method for particle
Part.prototype.reset = function(){

    this.startRadius = rand(1, 35); // particle size limit
    this.radius = this.startRadius; // initial radius that will further decrease

    // initial coords of pointer
    this.spawcoordX = cw;
    this.spawcoordY = ch;

    // initializing coords of particle
    this.x = this.spawcoordX + (rand(0, 6) - 3);
    this.y = this.spawcoordY;

    // delta additions to coords
    this.vx = 0;
    this.vy = 0;

    // Color-lighting options
    this.hue = rand(globalTick - hueRange, globalTick + hueRange);  // shade
    this.saturation = rand(50, 100);
    this.lightness = rand(20, 70);

    this.startAlpha = rand(1, 10) / 100;
    this.alpha = this.startAlpha;

    this.decayRate = .1;
    this.startLife = 10;
    this.life = this.startLife;

    this.lineWidth = rand(1, 5);
};

// Update class-type method for particle
Part.prototype.update = function() {

    this.vx += (rand(0, 200) - 100) / 500; // horizontal fluctuations
    this.vy -= this.life/50;  // particle is floating up

    /// updating coords of current particle
    this.x += this.vx;
    this.y += this.vy;

    this.alpha = this.startAlpha * (this.life / this.startLife);
    this.radius = this.startRadius * (this.life / this.startLife);

    this.life -= this.decayRate;

    if(
        this.x > this.spawcoordX + this.radius ||
        this.x < -this.radius ||
        this.y > this.spawcoordY + this.radius ||
        this.y < -this.radius ||
        this.life <= this.decayRate
    ) this.reset();
};

// Render class-type method for particle
Part.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = context.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, '+this.alpha+')';
    context.lineWidth = this.lineWidth;
    context.fill();
    context.stroke();
};

var createParts = function(){
    if(!partsFull) {
        if(parts.length > partCount){
            partsFull = true;
        } else {
            parts.push(new Part());
        }
    }
};

var updateParts = function() {
    var i = parts.length;
    while(i--) {
        parts[i].update();
    }
};

// View renderer
var renderParts = function() {
    var i = parts.length;
    while(i--) {
        parts[i].render();
    }
};

var clear = function() {
    context.globalCompositeOperation = 'destination-out';
    context.fillStyle = 'hsla(0, 0%, 0%, .3)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'lighter';
};

// Draw the main player's circle
function drawMainCircle() {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#FFB224';
    context.fill();
    context.closePath();
    context.lineWidth = 5;
    context.strokeStyle = 'yellow';
    context.stroke();
}

function screenDraw() {
    if(running) {
        clear();
        // context.clearRect(0, 0, canvas.width, canvas.height);
        // drawMainCircle();
        renderParts();
        //console.log("r_ok");
    }
}
// renderer end

// Main cycle
var main = function() {
// var loop = {...

    //window.requestAnimFrame(loop, canvas);

    createParts();
    updateParts();
    screenDraw();

    globalTick++;
    if (globalTick == 350) globalTick=0;

};
setInterval(main, 1000 / 60); // 60 fps drawing

// window.requestAnimFrame = function() {
//     return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
//           window.setTimeout(a,1E3/60)
//       }
// }();
// loop();