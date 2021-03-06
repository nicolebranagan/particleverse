// Main view object

//var gamecanvas = document.getElementById('gamecanvas');
var manager = new CanvasManager( {
    id: "gamecanvas",
    updatecycle: 10,
    drawcycle: 10,
});
var gamecanvas = manager.canvas;
manager.Initialize();

var objects = new Array();
//var uiObjects = new Array();
var killList = new Array();
var nextobject;
var objType = Particle;
var canDrag = false;
var nowDragging = false;

var eraseMode = false;
var paused = false;

MapGrid = {
    width: 320,
    height: 240,
    particles: new Array(320 * 240),
    newparticles: new Array(320 * 240),
    createParticle: function(x, y, particle) {
        if (particle) {
            particle.x = x;
            particle.y = y;
            this.particles[this.width * y + x] = particle;
        }
    },
    getParticle: function(x, y) {
        var part = this.particles[this.width * y + x];
        if (part === null || part === undefined)
            return null;
        else
            return part;
    },
    setParticle: function(x, y, particle) {
        if (particle) {
            particle.x = x;
            particle.y = y;
            this.newparticles[this.width * y + x] = particle;
        }
    },
    moveParticle: function(x, y, particle) {
        if (this.newparticles[this.width * y + x])
            return false;
        else {
            this.setParticle(x, y, particle);
            return true;
        }
    },
    clearParticle: function(x, y) {
        this.newparticles[this.width * y + x] = null;
    },
    drawGrid: function(context) {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.getParticle(x,y) != null) {
                    context.fillStyle = this.getParticle(x,y).style;
                    context.fillRect(x*2,y*2,2,2);
                }
            }
        }
    },
    clearGrid: function() {
        this.particles = new Array(320 * 240);
        nextobject = null;
    },
    update: function() {
        this.newparticles = this.particles.slice(0);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.getParticle(x,y) != null) {
                    this.getParticle(x,y).update();
                }
            }
        }
        this.particles = this.newparticles.slice(0);
        
        for (var i = 0; i < killList.length; i++) {
            this.particles[killList[i].y * this.width + killList[i].x] = null;
        }
        killList = new Array();
    }
}

function onFieldClick(event) {	
	var posx = Math.round((event.pageX - gamecanvas.offsetLeft)/2);
	var posy = Math.round((event.pageY - gamecanvas.offsetTop)/2);
	
	if (!eraseMode) {
		nextobject = new objType();
		nextobject.x = posx;
		nextobject.y = posy;
	}
	else {
            var dead = {
                x: posx,
                y: posy
            }
            killList.push(dead);
	}
	
	if (canDrag)
		nowDragging = true;
	
	//uiObjects.forEach(function(e) {e.onClick(event)});
}

function onMouseUp(event) {
	nowDragging = false;
}

function onMouseMove(event) {
	if (canDrag && nowDragging) {
		var posx = Math.round((event.pageX - gamecanvas.offsetLeft)/2);
		var posy = Math.round((event.pageY - gamecanvas.offsetTop)/2);
		
		if (!eraseMode) {
                    nextobject = new objType();
                    nextobject.x = posx;
                    nextobject.y = posy;
		}
		else {
                    var dead = {
                        x: posx,
                        y: posy
                    }
                    killList.push(dead);
		}
	}
	//uiObjects.forEach(function(e) {e.mouseMove(event)});
}

manager.draw = function(ctx) {
        MapGrid.drawGrid(ctx);
}

manager.update = function() {
        if (nextobject) {
            MapGrid.createParticle(nextobject.x, nextobject.y, nextobject);
            nextobject = null;
        }
        
	if (!paused) {
		MapGrid.update();
	}
}

manager.getManagedObject(new Button( {
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

manager.getManagedObject(new Button( {
	x: 530,
	y: 10,
	width: 50,
	height: 25,
	label: "Clear",
	clickFunction: function() {
            MapGrid.clearGrid();
        }
} ));

manager.getManagedObject(new Button( {
	x: 580,
	y: 35,
	width: 50,
	height: 25,
	label: "Step",
	clickFunction: function() {
		MapGrid.update();
		nextobject = null;
		}
} ));

manager.getManagedObject(new Button( {
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

manager.getManagedObject(new Button( {
	x: 10,
	y: 35,
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

manager.getManagedObject(new Button( {
	x: 10,
	y: 60,
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

manager.getManagedObject(new Button( {
	x: 10,
	y: 85,
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

manager.getManagedObject(new Button( {
	x: 10,
	y: 110,
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

manager.getManagedObject(new Button( {
	x: 10,
	y: 135,
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

manager.getManagedObject(new Button( {
	x: 10,
	y: 160,
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

manager.getManagedObject(new Button( {
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

manager.getManagedObject(new Button( {
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

manager.getManagedObject(new Button( {
	x: 10,
	y: 235,
	width: 50,
	height: 25,
	label: "aparti",
	clickFunction: function() {
		objType = Antiparticle;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

manager.getManagedObject(new Button( {
	x: 10,
	y: 260,
	width: 50,
	height: 25,
	label: "collider",
	clickFunction: function() {
		objType = Collider;
		nextobject = null;
		canDrag = false;
		eraseMode = false;
		}
} ));

manager.getManagedObject(new Button( {
	x: 60,
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

manager.getManagedObject(new Button( {
	x: 60,
	y: 60,
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

manager.getManagedObject(new Button( {
	x: 60,
	y: 85,
	width: 50,
	height: 25,
	label: "c4",
	clickFunction: function() {
		objType = C4;
		nextobject = null;
		canDrag = true;
		eraseMode = false;
		}
} ));

manager.getManagedObject(new Button( {
	x: 60,
	y: 110,
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

manager.getManagedObject(new Button( {
	x: 60,
	y: 135,
	width: 50,
	height: 25,
	label: "nanobot",
	clickFunction: function() {
		objType = Nanobot;
		nextobject = null;
		canDrag = false;
		eraseMode = false;
		}
} ));

//gamecanvas.addEventListener("mousedown", onFieldClick, false);
manager.onClick = onFieldClick;
//gamecanvas.addEventListener("mouseup", onMouseUp, false);
manager.offClick = onMouseUp;
//gamecanvas.addEventListener("mousemove", onMouseMove, false);
manager.mouseMove = onMouseMove;