// Main view object

var gamecanvas = document.getElementById('gamecanvas');
var objects = new Array();
var newobjects;
var uiObjects = new Array();
var nextobject;
var objType = Particle;

function onFieldClick(event) {	
	var posx = (event.pageX - gamecanvas.offsetLeft);
	var posy = (event.pageY - gamecanvas.offsetTop);
	
	nextobject = new objType();
	nextobject.x = Math.round(posx/2);
	nextobject.y = Math.round(posy/2);

	uiObjects.forEach(function(e) {e.onClick(event)});
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
	newobjects = objects;
	objects.forEach(function (e) {e.update()});
	objects = newobjects; // particles should not act on Objects directly
	setTimeout(Loop, 10)
}

uiObjects.push(new Button( {
	x: 10,
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
	y: 35,
	width: 50,
	height: 25,
	label: "solid",
	clickFunction: function() {
		objType = Solid;
		nextobject = null;
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
		}
} ));

uiObjects.push(new Button( {
	x: 10,
	y: 160,
	width: 50,
	height: 25,
	label: "fire",
	clickFunction: function() {
		objType = Fire;
		nextobject = null;
		}
} ));
gamecanvas.addEventListener("mousedown", onFieldClick, false);


Loop();