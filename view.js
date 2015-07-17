// Main view object

var gamecanvas = document.getElementById('gamecanvas');
var objects = new Array();
var uiObjects = new Array();
var nextparticle;

function onFieldClick(event) {	
	var posx = (event.pageX - gamecanvas.offsetLeft);
	var posy = (event.pageY - gamecanvas.offsetTop);
	
	nextparticle = new Particle( {
		x: posx,
		y: posy,
		g: -1 
	} );
	
	uiObjects.forEach(function(e) {e.onClick(event)});
}

function Loop() {
	ctx = gamecanvas.getContext("2d");
	ctx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);
	if (nextparticle) {
		objects.push(nextparticle);
		nextparticle = null;
	}
	objects.forEach(function (e) {e.draw(ctx)});
	objects.forEach(function (e) {e.update()});
	
	uiObjects.forEach(function (e) {e.draw(ctx)});
	setTimeout(Loop, 50)
}

uiObjects.push(new Button( {
	x: 10,
	y: 10,
	width: 50,
	height: 20,
	label: "clear",
	clickFunction: function() {
		objects = new Array();
		}
} ));
gamecanvas.addEventListener("mousedown", onFieldClick, false);


Loop();