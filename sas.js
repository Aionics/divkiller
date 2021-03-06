
var it = 0;
var cursor = {};
var field = {
	'sizeX': window.innerWidth - 30,
	'sizeY': window.innerHeight - 30
}
var elastic = 30;
var mass = 1.9;
var score = 0;
document.body.style.cursor = 'none';
var scoreLabel = document.getElementById("score");
scoreLabel.style.position = 'absolute';
scoreLabel.style.left = '90%';

document.onmousemove = handleMouseMove;

function enemySpawnPos () {
	var pos = {};
	var side = Math.floor(Math.random() * 4)
	switch (side){
		case 0:
			pos = {
				'x': Math.random() * (field.sizeX),
				'y': 30
			}
			break
		case 1:
			pos = {
				'x': field.sizeX - 30,
				'y': Math.random() * (field.sizeY)
			}
			break		
		case 2:
			pos = {
				'x': Math.random() * (field.sizeX),
				'y': field.sizeY - 30
			}
			break
		case 3:
			pos = {
				'x': 30,
				'y': Math.random() * (field.sizeY)
			}
			break		
	}
	return pos;
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
	'boost': [],
	'splinter': [],
	'splinter-shrapnel': [],

};
var a = {
	x: 100,
	y: 100
}
follower.setPos( a );
pointer.setPos( a );

// for (var i = 0; i < 5; i++) {
// 	enemies[i] = new entity(i, 20);
// 	var pos = {
// 		'x': Math.floor(Math.random() * (window.innerWidth-50 - 0 + 1)) + 0,
// 		'y': Math.floor(Math.random() * (window.innerHeight-50 - 0 + 1)) + 0
// 	}
// 	enemies[i].setPos(pos);
// 	enemies[i].direction = normalize(vector(pointer.pos, pos));
// 	enemies[i].speed = 0;
// }


var newPos = {
	'x': follower.pos.x,
	'y': follower.pos.y
};
var oldPos = {
	'x': follower.pos.x,
	'y': follower.pos.y
};
function main() {
		if ( Math.floor(Math.random() * 450) == 0){
			var newEnt = new entity(1, 20, 'green');
			var pos = enemySpawnPos()
			newEnt.setPos(pos);
			newEnt.direction = normalize(vector(pointer.pos, pos));
			newEnt.speed = 1.5;
			enemies['default'].push(newEnt);
		}
		if ( Math.floor(Math.random() * 450) == 0){
			var newEnt = new entity(1, 15, 'lightgrey');
			var pos = enemySpawnPos()
			newEnt.setPos(pos);
			newEnt.direction = normalize(vector(pointer.pos, pos));
			newEnt.speed = 2;
			newEnt.boost = {
				'currnetTime': 0,
				'boostTime': Math.floor(Math.random() * 250) + 150,
				'phase': 0
			}
			enemies['boost'].push(newEnt);
		}
		if ( Math.floor(Math.random() * 250) == 0){
			var newEnt = new entity(1, 25, 'orange');
			var pos = enemySpawnPos()
			newEnt.setPos(pos);
			newEnt.direction = normalize(vector(pointer.pos, pos));
			newEnt.speed = 1;
			newEnt.die = function (pos) {
				setTimeout(function(){
					for (var i = 0; i < 4; i++) {
						var subEnt = new entity(1, 10, 'orange');
						subEnt.setPos(pos);
						subEnt.direction = normalize( {'x':Math.random() - 0.5, 'y':Math.random() - 0.5} );
						subEnt.speed = 4;
						enemies['splinter-shrapnel'].push(subEnt);
					};
				}, 65);
			}
			enemies['splinter'].push(newEnt);
		}

	for (var i in cursor) {
		follower.direction[i] = newPos[i]-oldPos[i];
		newPos[i] =  follower.pos[i] +  ( (cursor[i] - follower.pos[i])/elastic  + follower.direction[i]*mass) /2;
	}

	// default-enemies
	for (var y in enemies['default']) {
		enemies['default'][y].setPos( add(enemies['default'][y].pos, multiply(enemies['default'][y].direction, enemies['default'][y].speed)) );
	}

	// boost-enemies 
	for (var y in enemies['boost']) {
		if (enemies['boost'][y].boost.phase < 2){
			enemies['boost'][y].boost.currnetTime++;
		}
		if (enemies['boost'][y].boost.currnetTime == enemies['boost'][y].boost.boostTime){
			enemies['boost'][y].boost.phase = 1;
			enemies['boost'][y].changeColor('yellow');
		}
		if (enemies['boost'][y].boost.currnetTime == (enemies['boost'][y].boost.boostTime + 40)) {
			enemies['boost'][y].boost.currnetTime++;
			enemies['boost'][y].speed = 7;
			enemies['boost'][y].direction = normalize(vector(pointer.pos, enemies['boost'][y].pos));
			enemies['boost'][y].boost.phase = 2;
		}
		if (enemies['boost'][y].boost.phase == 0 || enemies['boost'][y].boost.phase == 2){
			enemies['boost'][y].setPos( add(enemies['boost'][y].pos, multiply(enemies['boost'][y].direction, enemies['boost'][y].speed)) );
		}
	}
	// splinter-enemies
	for (var y in enemies['splinter']) {
		enemies['splinter'][y].setPos( add(enemies['splinter'][y].pos, multiply(enemies['splinter'][y].direction, enemies['splinter'][y].speed)) );
		if( range(follower.pos, enemies['splinter'][y].pos) <= (follower.size+enemies['splinter'][y].size)/1.4){
			enemies['splinter'][y].die(enemies['splinter'][y].pos);
		}
	}
	for (var y in enemies['splinter-shrapnel']) {
		enemies['splinter-shrapnel'][y].setPos( add(enemies['splinter-shrapnel'][y].pos, multiply(enemies['splinter-shrapnel'][y].direction, enemies['splinter-shrapnel'][y].speed)) );
	}


	for (var type in enemies){
		for (var u in enemies[type]){
			if( range(pointer.pos, enemies[type][u].pos) <= (pointer.size+enemies[type][u].size)/1.4){
				// console.log(enemies[type][u] + ' - ' + u);
				removeAllEnemies();
				setTimeout(function(){
					alert('You get REKT, your score is ' + score + '!');
					}, 1000);
				score = 0;
			}
			else if( range(follower.pos, enemies[type][u].pos) <= (follower.size+enemies[type][u].size)/1.4){ 
				score++
				scoreLabel.innerHTML = 'Score: ' + score;
				enemies[type][u].removeElement();
				enemies[type].splice(u, 1);
				// console.log(enemies[type][u] + ' - ' + u);
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

var gameTick = setInterval(main, 1000 / 60);
