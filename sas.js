
var it = 0;
var cursor = {};
var field = {
	'sizeX': window.innerWidth - 30,
	'sizeY': window.innerHeight - 30
}
var running = new Boolean(1);
var elastic = 30;
var mass = 1.9;
var score = 0;
document.body.style.cursor = 'none';
var scoreLabel = document.getElementById("score");
scoreLabel.style.position = 'absolute';
scoreLabel.style.left = '90%';

document.onmousemove = handleMouseMove;
document.onkeydown = stopPause;

function stopPause(event) {
	running = !running;
}

function removeAllEnemies() {
	for (var type2 in enemies){
		for (var u2 in enemies[type2]){
			enemies[type2][u2].removeElement();
			enemies[type2].splice(u2, 1);
		}
	}
}

function handleMouseMove(event) {
	cursor = {
		'x': event.clientX - 10,
		'y': event.clientY - 10
	}
}

function vector (pos1, pos2){
	var vec = {
		'x': pos1.x - pos2.x,
		'y': pos1.y - pos2.y
	}
	return vec;
}
function normalize( vec ){
	var module = Math.sqrt( Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
	var vec2 = {
		'x': vec.x / module,
		'y': vec.y / module
	} 
	return vec2;
}
function range(vec1, vec2){
	return Math.sqrt(Math.pow((vec2.x - vec1.x), 2) + Math.pow((vec2.y - vec1.y), 2));
}
function multiply (vec, number){
	var vec2 = {
		'x': vec.x * number,
		'y': vec.y * number
	}
	return vec2;
}
function add (vec1, vec2){
	var vec3 = {
		'x': vec1.x + vec2.x,
		'y': vec1.y + vec2.y
	}
	return vec3;
}

function entity(id, size, color) {
	this.id = id;
	this.size = size;
	this.direction = {};
	this.element = document.createElement("div");
	document.body.appendChild(this.element);

	this.element.style.position = 'absolute';
	this.element.style.width = size + 'px';
	this.element.style.height = size + 'px';
	this.element.style.backgroundColor = 'black';
	this.element.style.border =  color + ' solid ' + Math.round(size*0.2) + 'px';
	this.element.style.borderRadius = Math.round(size*0.75) + 'px';

	this.setPos = function ( pos ) {
		this.element.style.top =  Math.round(pos.y - this.size*0.3) + 'px';
		this.element.style.left =  Math.round(pos.x - this.size*0.3) + 'px';
		this.pos = {
			'x': pos.x,
			'y': pos.y
		};
	}
	this.removeElement = function () {
		document.body.removeChild(this.element);
		return false;
	}
	this.changeColor = function(color) {
		this.element.style.border =  color + ' solid ' + Math.round(this.size*0.2) + 'px';
	}
}

var sas = document.getElementById("myCanvas");
var ctx = sas.getContext("2d");

var follower = new entity(1001, 18, 'red');
var pointer = new entity(1002, 25, 'blue');

var enemies = {
	'default': [],
	'fast': [],
};
var a = {
	x: 100,
	y: 100
}
follower.setPos( a );
pointer.setPos( a );

var newPos = {
	'x': follower.pos.x,
	'y': follower.pos.y
};

var oldPos = {
	'x': follower.pos.x,
	'y': follower.pos.y
};

function main() {
	
	if(running == 1) {
		if ( Math.floor(Math.random() * 80) == 0){
			var newEnt = new entity(1, 20, 'lightgrey');
			var pos = {
				'x': Math.random() * (field.sizeX),
				'y': Math.random() * (field.sizeY)
			}
			newEnt.setPos(pos);
			newEnt.direction = normalize(vector(pointer.pos, pos));
			newEnt.speed = 2;
			newEnt.changeColor('green');
			enemies['default'].push(newEnt);
		}

		for (var i in cursor) {
			follower.direction[i] = newPos[i]-oldPos[i];
			newPos[i] =  follower.pos[i] +  ( (cursor[i] - follower.pos[i])/elastic  + follower.direction[i]*mass) /2;
		}

		for (var y in enemies['default']) {
			enemies['default'][y].setPos( add(enemies['default'][y].pos, multiply(enemies['default'][y].direction, enemies['default'][y].speed)) );
		}
	 
		for (var type in enemies){
			for (var u in enemies[type]){
				if( range(pointer.pos, enemies[type][u].pos) <= (pointer.size+enemies[type][u].size)/1.4){
					console.log(enemies[type][u] + ' - ' + u);
					removeAllEnemies();
					alert('You get REKT, your score is ' + score + '!');
					score = 0;
				}
				else if( range(follower.pos, enemies[type][u].pos) <= (follower.size+enemies[type][u].size)/1.4){ 
					score++
					scoreLabel.innerHTML = 'Score: ' + score;
					enemies[type][u].removeElement();
					enemies[type].splice(u, 1);
					console.log(enemies[type][u] + ' - ' + u);
				}
				else if(enemies[type][u].pos.x >= field.sizeX || enemies[type][u].pos.x <= 0 || enemies[type][u].pos.y >= field.sizeY || enemies[type][u].pos.y <= 0){
					enemies[type][u].removeElement();
					enemies[type].splice(u, 1);
				}
			}
		}
		// newPos.x = cursor.x + Math.round((cursor.x - follower.pos.x)/20);
		field = {
			'sizeX': window.innerWidth - 30,
			'sizeY': window.innerHeight - 30
		}
		sas.width = field.sizeX;
		sas.height = field.sizeY;
		if(cursor.x){
			oldPos = follower.pos;
			follower.setPos(newPos);
			pointer.setPos(cursor);

			// ctx.clearRect(0,0,500,500);
			ctx.beginPath();
			ctx.moveTo(follower.pos.x,follower.pos.y);
			ctx.lineTo(pointer.pos.x,pointer.pos.y);
			ctx.stroke();  
		}

	}
}

var gameTick = setInterval(main, 1000 / 60);
