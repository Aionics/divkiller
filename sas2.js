function Vec(x, y){  //class vector
    this.x = x;
    this.y = y;
}

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
}
function draw() {
    game.draw();
    pointer.draw();
}
function main() // рисуем на холсте
{   
    // it++
//     if(it%100 == 1){
//         console.log(pointer);
    //  }
    draw();
    update();
}

var it = 0;
var game = new background(0, 0, 480, 320); // прямоугольник закрашивающий фон
var pointer = new entity(20, new Vec(50, 50), 'blue'); // шар
var cursor;

document.onmousemove = handleMouseMove;

var canvas = document.getElementById("myCanvas");
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.width = game.width; // ширина холста
canvas.height = game.height; // высота холста
context = canvas.getContext("2d");
setInterval(main, 1000/ 60); //отрисовываем 50 раз за секунду
