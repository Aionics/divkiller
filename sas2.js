function Vec(x, y){  //class vector
    this.x = x;
    this.y = y;
    var self = this;
    this.addition= function (vec){
        vec2 = new Vec(self.x + vec.x, self.y + vec.y)    
        return vec2;
    };
    this.subtract = function (vec){
        vec2 = new Vec(self.x - vec.x, self.y - vec.y)
        return vec2;
    };
    this.multiply = function(number){
        self.x *= number;
        self.y *= number;
        return self;
    };
}

function entity(size, spawnPos, color){ // entity cretae constructor
    this.pos = spawnPos;
    this.size = size;
    this.color = color;
    this.draw = function() {

        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true);
        context.fill();
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.size*0.8, 0, Math.PI * 2, true);
        context.fill();
    };
}
function background(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width; 
    this.height = height; 
    this.draw = function(color, globalAlpha) 
    {
        context.globalAlpha = globalAlpha;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.globalAlpha = 1
    };
}
function rope(){
    this.vecStart = new Vec(0, 0);
    this.vecEnd = new Vec(0, 0);
    var self = this;
    this.draw = function(vecS, vecE){
        self.vecStart = vecS;
        self.vecEnd = vecE;
        context.beginPath();
        context.moveTo(self.vecStart.x, self.vecStart.y);
        context.lineTo(self.vecEnd.x, self.vecEnd.y);
        context.stroke();
    }
}

function handleMouseMove(event) {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
}

function update() {
    // pointer.pos = pointer.pos.addition( cursor.subtract(pointer.pos).multiply(0.1)); // pointer moving
    // HOWITLOOKS: pointer.pos = pointer.pos + ( cursor.pos - pointer.pos ) * 0.3
    pointer.pos = cursor; // pointer moving


    follower.oldPos = follower.pos; //follower moving
    follower.pos = follower.pos.addition( cursor.subtract(follower.pos).multiply(0.03).addition( follower.direction.multiply(1.94) ).multiply(0.5) )
    // HOWITLOOKS: follower.pos = follower.pos + ( (cursor.pos - follower.pos) * 0.03 + follower.velocity ) / 2  ; mass = 1.90
    follower.direction = follower.pos.subtract(follower.oldPos);
}
function draw() {    
    gameFiled.draw('grey', 1);
    rope.draw(pointer.pos, follower.pos);
    follower.draw();
    pointer.draw();
}
function main()
{   
    // it++
    // if(it%100 == 1){
    //     console.log(pointer);
    //  }
    draw();
    update();
}

var it = 0;

var gameFiled = new background(0, 0, window.innerWidth - 10, window.innerHeight - 10);
var cursor = new Vec(1, 1);


var pointer = new entity(15, new Vec(50, 50), 'blue'); //mainEntity
document.body.style.cursor = 'none';
var rope = new rope();

var follower = new entity(20, new Vec(50, 50), 'red'); //followerEntity
follower.direction = new Vec(0, 0);

enemies = {
    'default': [],
}

document.onmousemove = handleMouseMove;

var canvas = document.getElementById("myCanvas");
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.width = gameFiled.width;
canvas.height = gameFiled.height;
context = canvas.getContext("2d");
setInterval(main, 1000/ 60);
