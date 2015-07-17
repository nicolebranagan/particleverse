// Main view object

var gamecanvas = document.getElementById('gamecanvas');
var objects = new Array();
var uiObjects = new Array();
var nextobject;
var objType = Particle;

function onFieldClick(event) {	
	var posx = (event.pageX - gamecanvas.offsetLeft);
	var posy = (event.pageY - gamecanvas.offsetTop);
	
	nextobject = new objType();
	nextobject.x = posx;
	nextobject.y = posy;

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
	objects.forEach(function (e) {e.update()});
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
gamecanvas.addEventListener("mousedown", onFieldClick, false);


Loop();