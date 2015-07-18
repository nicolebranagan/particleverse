// Particle constructor

function Particle(options) {
	this.g = -1; // pixels / click
	this.style = "#FFF" ; // style
	this.flammable = false;
}

Particle.prototype.draw = function(context) {
	context.fillStyle = this.style;
	context.fillRect(this.x*2,this.y*2,2,2);
}

Particle.prototype.update = function() {
	var ytest = this.y - this.g;	
	if (ytest < 240 && ytest >= 0) {
		if (!objects.reduce(particleInteraction(this.x, ytest), false))
			this.y = ytest;
		else {
			xtest = this.x + Math.sign(Math.random() - 0.5);
			if ((xtest < 320) && (xtest >= 0) && !objects.reduce(particleInteraction(xtest, this.y), false))
				this.x = xtest;
		}
	}
}

Oil.prototype = new Particle();
Oil.prototype.constructor = Oil;
function Oil() {
	this.g = -1; // pixels / click
	this.style = "brown" ; // style
	this.flammable = true;
}

Solid.prototype = new Particle();
Solid.prototype.constructor = Solid;
function Solid() {
	this.g = 0; // pixels / click
	this.style = "#888" ; // style
	this.flammable = false;
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
}
generalFactory.prototype.update = function() {
	this.counter = this.counter + 1;
	if (this.counter == 2) {
	var obj = new this.objtype();
	obj.x = this.x + Math.floor(Math.random() * 3 - 1);
	obj.y = this.y + 1;
	
	newobjects.push(obj);
	this.counter = 0;
	}
}

Factory.prototype = new generalFactory(Particle);
Factory.prototype.constructor = Factory;
function Factory() {}

Well.prototype = new generalFactory(Oil);
Well.prototype.constructor = Well;
function Well() {}

Fire.prototype = new Particle();
Fire.prototype.constructor = Fire;
function Fire() {
	this.g = -1;
	this.style = "#F00";
	this.deathcount = 2;
	this.flammable = false;
}
Fire.prototype.update = function() {
	for(i = 0; i < objects.length; i++) {
		var testobj = objects[i];
		
		if ((testobj.flammable) && !(testobj === this)) {
			if ( ( Math.abs(testobj.x - this.x) < 1.5 ) && ( Math.abs(testobj.y - this.y) < 1.5 ) ) {
				newobjects[i] = new Fire();
				newobjects[i].x = testobj.x;
				newobjects[i].y = testobj.y;
			}				
		}
	}
	
	if (this.deathcount < 0) {
		var index = newobjects.indexOf(this);
		newobjects.splice( index, 1 );
	} else 
		this.deathcount = this.deathcount - 1;
}

Wick.prototype = new Particle();
Wick.prototype.constructor = Wick;
function Wick() {
	this.g = 0; // pixels / click
	this.style = "#ffd" ; // style
	this.flammable = true;
}
Wick.prototype.update = function() {;}

particleInteraction = function(x, y, caller){
	return function(prev, curr, index, array) {
		if (prev)
			return true;
		else {
			if ((caller) && (curr == caller))
				return false;
			else
				return ((Math.abs(curr.y - y) < 1) && (Math.abs(curr.x - x) < 1));
		}
	}
}
