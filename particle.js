// Particle constructor

function Particle(options) {
	this.g = -1; // pixels / click
	this.style = "#FFF" ; // style
	this.flammable = false;
	this.wet = false;
	this.lubricant = false;
	this.matter = true;
}

Particle.prototype.draw = function(context) {
	context.fillStyle = this.style;
	context.fillRect(this.x*2,this.y*2,2,2);
}

Particle.prototype.update = function() {
	var ytest = this.y - this.g;	
	if (ytest < 240 && ytest >= 0) {
            if (MapGrid.getParticle(this.x, ytest) == null) {
                MapGrid.clearParticle(this.x, this.y);
                MapGrid.setParticle(this.x, ytest, this);
                this.y = ytest;
            }
            else {
                xtest = this.x + Math.sign(Math.random() - 0.5);
                if ((xtest < 320) && (xtest >= 0) && MapGrid.getParticle(xtest, this.y) == null) {
                    MapGrid.clearParticle(this.x, this.y);
                    MapGrid.setParticle(xtest, this.y);
                    this.x = xtest;
                }
            }
	}
}

Antiparticle.prototype = new Particle();
Antiparticle.prototype.constructor = Antiparticle;
function Antiparticle() {
	this.g = 1; // pixels / click
	this.style = "#FFF" ; // style
	this.flammable = false;
	this.wet = false;
	this.lubricant = false;
	this.matter = false;
}

Antiparticle.prototype.update = function() {
    var ytest = this.y - this.g;
    var xtest = this.x;
    //var index = newobjects.indexOf(this);
    if (ytest < 240 && ytest >= 0) {
        if (MapGrid.getParticle(this.x, ytest) == null) {
            MapGrid.clearParticle(this.x, this.y);
            MapGrid.setParticle(this.x, ytest, this);
            this.y = ytest;
        }
        else if (MapGrid.getParticle(this.x, ytest).matter) {
            MapGrid.clearParticle(this.x, this.y);
            var exp = new Explosion(20); exp.x = this.x; exp.y = this.y;
            MapGrid.setParticle(this.x, ytest, exp);
        }
        else {
            xtest = this.x + Math.sign(Math.random() - 0.5);
            if ((xtest < 320) && (xtest >= 0) && MapGrid.getParticle(xtest, this.y) == null) {
                MapGrid.clearParticle(this.x, this.y);
                MapGrid.setParticle(xtest, this.y);
                this.x = xtest;
            }
        }
    }
}

Oil.prototype = new Particle();
Oil.prototype.constructor = Oil;
function Oil() {
	this.g = -1; // pixels / click
	this.style = "brown" ; // style
	this.flammable = true;
	this.wet = false;
	this.lubricant = true;
	this.matter = true;
}

Solid.prototype = new Particle();
Solid.prototype.constructor = Solid;
function Solid() {
	this.g = 0; // pixels / click
	this.style = "#888" ; // style
	this.flammable = false;
	this.wet = false;
	this.lubricant = true;
	this.matter = true;
}
Solid.prototype.update = function() {;}

generalFactory.prototype = new Particle();
generalFactory.prototype.constructor = generalFactory;
function generalFactory(type) {
	this.g = 0;
	this.style = "#00F";
	this.counter = 0;
	this.flammable = false;
	this.objtype = type;
	this.wet = false;
	this.lubricant = false;
	this.matter = false;
}
generalFactory.prototype.update = function() {
	this.counter = this.counter + 1;
	if (this.counter == 2) {
	var obj = new this.objtype();
	obj.x = this.x + Math.floor(Math.random() * 3 - 1);
	obj.y = this.y + 1;
	
        if (MapGrid.getParticle(obj.x, obj.y) == null) {
            MapGrid.setParticle(obj.x, obj.y, obj);
        }
	this.counter = 0;
	}
}

Factory.prototype = new generalFactory(Particle);
Factory.prototype.constructor = Factory;
function Factory() {}

Well.prototype = new generalFactory(Oil);
Well.prototype.constructor = Well;
function Well() {}

Torch.prototype = new generalFactory(Fire);
Torch.prototype.constructor = Torch;
function Torch() {}


Collider.prototype = new generalFactory(Antiparticle);
Collider.prototype.constructor = Collider;
function Collider() {}

Fire.prototype = new Particle();
Fire.prototype.constructor = Fire;
function Fire() {
	this.g = -1;
	this.style = "#F00";
	this.deathcount = 2;
	this.flammable = false;
	this.wet = false;
	this.lubricant = false;
	this.matter = false;
	this.fire = true;
}
Fire.prototype.update = function() {
        var testx = 0; var testy = 0;
        
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                testx = this.x + x;
                testy = this.y + y;
                var testobj = MapGrid.getParticle(testx,testy);
                if (testobj != null && testobj.flammable) {
                    MapGrid.setParticle(testx, testy, new Fire());
                }
            }
        }
	
	if (this.deathcount < 0) {
		MapGrid.clearParticle(this.x, this.y);
	} else 
		this.deathcount = this.deathcount - 1;
}

Wick.prototype = new Particle();
Wick.prototype.constructor = Wick;
function Wick() {
	this.g = 0; // pixels / click
	this.style = "#ffd" ; // style
	this.flammable = true;
	this.wet = false;
	this.lubricant = false;
	this.matter = true;
}
Wick.prototype.update = function() {;}

Wood.prototype = new Particle();
Wood.prototype.constructor = Wood;
function Wood() {
	this.g = 0; // pixels / click
	this.style = "#060" ; // style
	this.flammable = true;
	this.wet = false;
	this.lubricant = false;
	this.matter = true;
}
Wood.prototype.update = function() {
    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            testx = this.x + x;
            testy = this.y + y;
            var testobj = MapGrid.getParticle(testx,testy);
            if (testobj && testobj.wet) {
                MapGrid.setParticle(this.x, this.y, new Plant());
                MapGrid.clearParticle(testx, testy);
            }
        }
    }
}

Plant.prototype = new Particle();
Plant.prototype.constructor = Plant;
function Plant() {
	this.g = 0;
	this.style = "#0A0";
	this.flammable = false;
	this.counter = 20;
	this.wet = false;
	this.lubricant = false;
	this.matter = true;
}
Plant.prototype.update = function() {
	var testx = this.x; var testy = this.y;
	if (Math.random() > 0.6) {
		if ((Math.random() > 0.5) && (testx < 320)) 
			testx = testx + 1;
		else if ((Math.random() > 0.5) && (testx > 0))
			testx = testx - 1;
		else if ((Math.random() > 0.5) && (testy < 240)) 
			testy = testy + 1;
		else if ((testy > 0))
			testy = testy - 1;
                
                if (MapGrid.getParticle(testx, testy) == null) {
                    MapGrid.setParticle(testx, testy, new Plant());
                    MapGrid.setParticle(this.x, this.y, new Wood());
                }
	}
	
	this.counter = this.counter - 1;
	if (this.counter < 0) {
                MapGrid.setParticle(this.x, this.y, new Wood());
	}
}

Water.prototype = new Particle();
Water.prototype.constructor = Water;
function Water() {
	this.g = -1; // pixels / click
	this.style = "cyan" ; // style
	this.flammable = false;
	this.wet = true;
	this.lubricant = true;
	this.matter = true;
}

Fountain.prototype = new generalFactory(Water);
Fountain.prototype.constructor = Fountain;
function Fountain() {}


Rust.prototype = new Particle();
Rust.prototype.constructor = Rust;
function Rust() {
	this.g = 0; // pixels / click
	this.style = "#866" ; // style
	this.flammable = false;
	this.wet = false;
	this.lubricant = true;
	this.matter = true;
}
Rust.prototype.update = function() {
	/*for(i = 0; i < objects.length; i++) {
		var testobj = objects[i];
		
		if ((testobj.lubricant)&& !(testobj === this)) {
			if ( ( Math.abs(testobj.x - this.x) < 1.5 ) && ( Math.abs(testobj.y - this.y) < 1.5 ) ) {
				newobjects.splice( i, 1 ); // remove the oil
				var index = newobjects.indexOf(this);
				newobjects[index] = new Nanobot(true);
				newobjects[index].x = this.x;
				newobjects[index].y = this.y;
			}
		}
		

	}*/
	
    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            testx = this.x + x;
            testy = this.y + y;
            var testobj = MapGrid.getParticle(testx,testy);
            if (testobj && testobj != this && testobj.lubricant) {
                MapGrid.setParticle(this.x, this.y, new Nanobot(true));
                MapGrid.clearParticle(testx, testy);
            }
        }
    }
}

Nanobot.prototype = new Particle();
Nanobot.prototype.constructor = Nanobot;
function Nanobot(fromRust) {
	this.g = 0;
	this.style = "#AAA";
	this.flammable = false;
	this.counter = 10;
	this.wet = false;
	this.lubricant = false;
	this.matter = true;
	
	this.fromRust = fromRust || false;
}
Nanobot.prototype.update = function() {
	var testx = this.x; var testy = this.y;
	if (Math.random() > 0.8) {
		if ((Math.random() > 0.5) && (testx < 320)) 
			testx = testx + 1;
		else if ((Math.random() > 0.5) && (testx > 0))
			testx = testx - 1;
		else if ((Math.random() > 0.5) && (testy < 240)) 
			testy = testy + 1;
		else if ((testy > 0))
			testy = testy - 1;
                
                if (!MapGrid.getParticle(testx, testy)) {
                    MapGrid.setParticle(testx, testy, new Nanobot());
                    if (this.fromRust) {
                        MapGrid.clearParticle(this.x, this.y);
                    }
                    else {
                        MapGrid.setParticle(this.x, this.y, new Rust());
                    }
                }
		
		/*if (!objects.reduce(particleInteraction(testx,testy,this),false)) {
			var newVine = new Nanobot();
			newVine.x = testx; newVine.y=testy;
			newVine.counter = this.counter;
			objects.push(newVine);
			
			index = newobjects.indexOf(this);
			if (this.fromRust) {
				newobjects.splice( index, 1 );
			}
			else {
				newobjects[index] = new Rust();
				newobjects[index].x = this.x;
				newobjects[index].y = this.y;
			}
		}*/
	}
	
	this.counter = this.counter - 1;
	if (this.counter < 0) {
            MapGrid.setParticle(testx, testy, new Nanobot());
            if (this.fromRust) {
                MapGrid.clearParticle(this.x, this.y);
            }
            else {
                MapGrid.setParticle(this.x, this.y, new Rust());
            }
	}
}

Explosion.prototype = new Particle();
Explosion.prototype.constructor = Explosion;
function Explosion(count) {
	this.g = 0;
	this.style = "#900";
	this.flammable = false;
	this.count = count;
	this.wet = false;
	this.lubricant = false;
	this.matter = false;
	this.fire = true;
}
Explosion.prototype.update = function() {
	if (this.count > 0) {
		var testx = new Array();
		var testy = new Array();
		
		testx[0] = this.x + 1;
		testy[0] = this.y;
		testx[1] = this.x - 1;
		testy[1] = this.y;
		testx[2] = this.x;
		testy[2] = this.y + 1;
		testx[3] = this.x;
		testy[3] = this.y - 1;
		
		for (j = 0; j < 4; j++) {
                    var testobj = MapGrid.getParticle(testx[j], testy[j]);
                    if (!testobj || !(testobj.fire))
                        MapGrid.setParticle(testx[j], testy[j], new Explosion(this.count - 1));
			/*var replaced = false;
			for (i = 0; i < objects.length; i++) {
				var testobj = objects[i];
				if ( ( Math.abs(testobj.x - testx[j]) < 1 ) && ( Math.abs(testobj.y - testy[j]) < 1 ) ) {
					if (!testobj.fire) {
						newobjects[i] = new Explosion(this.count - 1);
						newobjects[i].x = testobj.x;
						newobjects[i].y = testobj.y;
					}
					replaced = true;
				}
			}
			
			if (!replaced) {
				var newexp = new Explosion(this.count - 1);
				newexp.x = testx[j];
				newexp.y = testy[j];
				newobjects.push(newexp);
			}*/
		}
	}
	MapGrid.setParticle(this.x, this.y, new Fire());
}

C4.prototype = new Particle();
C4.prototype.constructor = C4;
function C4() {
	this.g = 0; // pixels / click
	this.style = "#DA8" ; // style
	this.flammable = false;
	this.wet = false;
	this.lubricant = false;
	this.matter = true;
}
C4.prototype.update = function() {
/*	for (i = 0; i < objects.length; i++) {
		var testobj = objects[i];
		if ( ( Math.abs(testobj.x - this.x) < 2 ) && ( Math.abs(testobj.y - this.y) < 2 ) ) {
			if (testobj.fire) {
				var index = newobjects.indexOf(this);
				newobjects[index] = new Explosion(90);
				newobjects[index].x = this.x;
				newobjects[index].y = this.y;
			}
		}
	}
	*/
    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            testx = this.x + x;
            testy = this.y + y;
            var testobj = MapGrid.getParticle(testx,testy);
            if (testobj && testobj != this && testobj.fire) {
                MapGrid.setParticle(this.x, this.y, new Explosion(90));
            }
        }
    }
}