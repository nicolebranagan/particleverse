// Main view object

var gamecanvas = document.getElementById('gamecanvas');
var objects = new Array();
var newobjects;
var uiObjects = new Array();
var nextobject;
var objType = Particle;

var canDrag = false;
var nowDragging = false;

var eraseMode = false;
var paused = false;

function onFieldClick(event) {	
	var posx = Math.round((event.pageX - gamecanvas.offsetLeft)/2);
	var posy = Math.round((event.pageY - gamecanvas.offsetTop)/2);
	
	if (!eraseMode) {
		nextobject = new objType();
		nextobject.x = posx;
		nextobject.y = posy;
	}
	else {
		for (i = (objects.length - 1); i >= 0; i--) {
			if ((Math.abs(objects[i].x - posx) < 2) && (Math.abs(objects[i].y - posy) < 2)) {
				objects.splice(i,1);
			}
		}
	}
	
	if (canDrag)
		nowDragging = true;
	
	uiObjects.forEach(function(e) {e.onClick(event)});
}

function onMouseUp(event) {
	nowDragging = false;
}

function onMouseMove(event) {
	if (canDrag && nowDragging) {
		var posx = Math.round((event.pageX - gamecanvas.offsetLeft)/2);
		var posy = Math.round((event.pageY - gamecanvas.offsetTop)/2);
		
		if (!eraseMode) {
			if ((nextobject) && (nextobject.x != posx) && (nextobject.y != posy)) {
				objects.push(nextobject);
			}
			
			nextobject = new objType();
			nextobject.x = posx;
			nextobject.y = posy;
		}
		else {
			for (i = (objects.length - 1); i >= 0; i--) {
				if ((Math.abs(objects[i].x - posx) < 2) && (Math.abs(objects[i].y - posy) < 2)) {
					objects.splice(i,1);
				}
			}
		}
	}
}

function Loop() {
	ctx = gamecanvas.getContext("2d");
	ctx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);

	objects.forEach(function (e) {e.draw(ctx)});
	uiObjects.forEach(function (e) {e.draw(ctx)});
	
	if (nextobject) {
		objects.push(nextobject);
		nextobject = null;
	}
	if (!paused) {
		newobjects = objects;
		objects.forEach(function (e) {e.update()});
		objects = newobjects; // particles should not act on Objects directly
	}
	setTimeout(Loop, 10)
}

uiObjects.push(new Button( {
	x: 580,
	y: 10,
	width: 50,
	height: 25,
	label: "Pause",
	clickFunction: function() {
		if (paused) {
			this.label = "Pause";
			paused = false;
		}
		else {
			this.label = "Play";
			paused = true;
		}
		nextobject = null;
	}
} ));

uiObjects.push(new Button( {
	x: 530,
	y: 10,
	width: 50,
	height: 25,
	label: "Clear",
	clickFunction: function() {
		objects = new Array();
		nextobject = null;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 10,
	width: 50,
	height: 25,
	label: "eraser",
	clickFunction: function() {
		canDrag = true;
		eraseMode = true;
		nextobject = null;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 35,
	width: 50,
	height: 25,
	label: "solid",
	clickFunction: function() {
		objType = Solid;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 60,
	width: 50,
	height: 25,
	label: "particle",
	clickFunction: function() {
		objType = Particle;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 85,
	width: 50,
	height: 25,
	label: "factory",
	clickFunction: function() {
		objType = Factory;
		nextobject = null;
		canDrag = false;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 110,
	width: 50,
	height: 25,
	label: "oil",
	clickFunction: function() {
		objType = Oil;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 135,
	width: 50,
	height: 25,
	label: "well",
	clickFunction: function() {
		objType = Well;
		nextobject = null;
		canDrag = false;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 160,
	width: 50,
	height: 25,
	label: "wick",
	clickFunction: function() {
		objType = Wick;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 185,
	width: 50,
	height: 25,
	label: "fire",
	clickFunction: function() {
		objType = Fire;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 210,
	width: 50,
	height: 25,
	label: "torch",
	clickFunction: function() {
		objType = Torch;
		nextobject = null;
		canDrag = false;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 235,
	width: 50,
	height: 25,
	label: "plant",
	clickFunction: function() {
		objType = Plant;
		nextobject = null;
		canDrag = false;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 260,
	width: 50,
	height: 25,
	label: "water",
	clickFunction: function() {
		objType = Water;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 285,
	width: 50,
	height: 25,
	label: "fountain",
	clickFunction: function() {
		objType = Fountain;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

gamecanvas.addEventListener("mousedown", onFieldClick, false);
gamecanvas.addEventListener("mouseup", onMouseUp, false);
gamecanvas.addEventListener("mousemove", onMouseMove, false);

Loop();