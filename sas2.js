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
        vec = new Vec(self.x * number, self.y * number);
        return vec;
    };
    this.range = function(vec){
        number = Math.sqrt(Math.pow((vec.x - self.x), 2) + Math.pow((vec.y - self.y), 2));
        return number;
    }
    this.normalize = function(){
        module = Math.sqrt( Math.pow(self.x, 2) + Math.pow(self.y, 2));
        vec = new Vec(self.x / module, self.y / module);
        return vec;
    }
}
function enemySpawnPos() {
    side = Math.floor(Math.random() * 4);
    switch (side){
    case 0:
        x = Math.random() * (game.field.width);
        y = 30;
        break;
    case 1:
        x = game.field.width - 30;
        y = Math.random() * (game.field.height);
        break;       
    case 2:
        x = Math.random() * (game.field.width);
        y = game.field.height - 30;
        break;
    case 3:
        x = 30;
        y = Math.random() * (game.field.height);
        break;
    }
    return new Vec(x, y);
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


    for(id in enemies['default']){
        enemies['default'][id].pos = enemies['default'][id].pos.addition( enemies['default'][id].direction.multiply(enemies['default'][id].speed) );
    } 

    for(type in enemies){
        for(id in enemies[type]){
            if(enemies[type][id].pos.range(pointer.pos) <= (enemies[type][id].size + pointer.size) * 1.2 ){
                enemies[type].splice(id, 1);
                alert('You got REKT!');
            }
            if(enemies[type][id].pos.range(follower.pos) <= (enemies[type][id].size + follower.size) * 1.2 ){
                enemies[type].splice(id, 1);
            }
        }
    }



    //###### spawn enemies ######
    game.enemyCounter = 0;
    for(type in enemies){
        for(id in enemies[type]){
            game.enemyCounter++;
        }
    }
    game.spawnRate = (game.enemyCounter <= 1) ? 70 : 200;

    if(Math.floor(Math.random() * game.spawnRate) == 0){
        //who will spawn?
        for(type in enemies){
            spawnRates['currentRoll'][type] = Math.floor(Math.random() * spawnRates[type]);
        }
        highestRoll = 0;
        for(type in spawnRates['currentRoll']){
            highestRoll = (spawnRates['currentRoll'][type]>=highestRoll) ? spawnRates['currentRoll'][type] : highestRoll;
        }
        spawnType = '';
        for(type in spawnRates['currentRoll']){
            if(spawnRates['currentRoll'][type] == highestRoll){
                spawnType = type;
                break;
            }
        }

        // spawn
        switch(spawnType){
            case 'default':
                newEntity = new entity(12, enemySpawnPos(), 'green');
                newEntity.direction = pointer.pos.subtract(newEntity.pos).normalize();
                newEntity.speed = 1.5;
                break;                
        }
        enemies[spawnType].push(newEntity);
    }
}
function draw() {    
    game.field.draw('grey', 1);
    rope.draw(pointer.pos, follower.pos);
    follower.draw();
    pointer.draw();
    for(type in enemies){
        for(id in enemies[type]){
            enemies[type][id].draw()
        }
    }
}
function main()
{   
    draw();
    update();
}

var it = 0;
var game = {
    'field': new background(0, 0, window.innerWidth - 10, window.innerHeight - 10),
    'spawnRate': 200,
};
var cursor = new Vec(1, 1);


var pointer = new entity(15, new Vec(50, 50), 'blue'); //mainEntity
document.body.style.cursor = 'none';
var rope = new rope();

var follower = new entity(20, new Vec(50, 50), 'red'); //followerEntity
follower.direction = new Vec(0, 0);

enemies = {
    'default': [],
};
spawnRates = {
    'currentRoll': {},
    'default': 100,
};

document.onmousemove = handleMouseMove;

var canvas = document.getElementById("myCanvas");
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.width = game.field.width;
canvas.height = game.field.height;
context = canvas.getContext("2d");
setInterval(main, 1000/ 60);

