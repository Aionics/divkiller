function Vec(x, y){  //class vector
    this.x = x;
    this.y = y;
    var self = this;
    this.addition= function (vec){    
        self.x += vec.x;
        self.y += vec.y;
        return self;
    };
    this.subtract = function (vec){
        self.x -= vec.x;
        self.y -= vec.y;
        return self;
    };
    this.multiply = function(number){
        self.x *= number;
        self.y *= number;
        return self;
    };
}

Vec.prototype


function entity(size, spawnPos, color){ // entity cretae constructor
    this.pos = spawnPos;
    this.size = size;
    this.color = color;

    this.setPos = function(pos) {
        this.pos = pos;
    };
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
function background(x, y, width, height) 
{
    this.x = x;
    this.y = y;
    this.width = width; 
    this.height = height; 
    this.draw = function(color, globalAlpha) 
    {
        context.globalAlpha = globalAlpha;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}

function handleMouseMove(event) {
    cursor = new Vec(event.clientX, event.clientY);
}

function update() {
    pointer.setPos(cursor);
    follower.oldPos = follower.pos;
    var ad = (subtract = function subtract(vec1, vec2){
    // console.log(vec1.x + '   -   '+ vec2.x)
    var vec3 = new Vec(
        vec1.x - vec2.x,
        vec1.y - vec2.y
    );
    return vec3
}(cursor, follower.pos)).multiply(0.03);
    console.log(ad);
    follower.pos = addition(follower.pos, ad)
}
function draw() {
    game.draw();
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

var game = new background(0, 0, 480, 320); // прямоугольник закрашивающий фон
var cursor;

var pointer = new entity(15, new Vec(50, 50), 'blue'); // шар
var follower = new entity(20, new Vec(50, 50), 'red');

document.onmousemove = handleMouseMove;

var canvas = document.getElementById("myCanvas");
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.width = game.width; // ширина холста
canvas.height = game.height; // высота холста
context = canvas.getContext("2d");
setInterval(main, 1000/ 60); //отрисовываем 50 раз за секунду
