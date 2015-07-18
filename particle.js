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
		if (!objects.reduce(particleInteraction(this.x, ytest), false))
			this.y = ytest;
		else {
			xtest = this.x + Math.sign(Math.random() - 0.5);
			if ((xtest < 320) && (xtest >= 0) && !objects.reduce(particleInteraction(xtest, this.y), false))
				this.x = xtest;
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
	var index = newobjects.indexOf(this);
	if (ytest < 240 && ytest >= 0) {
		var collided = false;
		for ( i = 0; i < objects.length; i++ ) {
			var testobj = objects[i];
			if ( !(testobj === this) && ( Math.abs(testobj.x - this.x) < 1 ) && ( Math.abs(testobj.y - ytest) < 1 ) ) {
				var collided = true;
				if (testobj.matter) {
					newobjects.splice( i, 1 ); // annihilate
					newobjects[index] = new Fire();
					newobjects[index].x = this.x;
					newobjects[index].y = ytest;
				}
			}
		}
		if (newobjects[index] === this) {
			var xtest = this.x + Math.sign(Math.random() - 0.5);;
			if (!collided)
				this.y = ytest;
			else
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
		else if (testobj.wet) {
			if ( ( Math.abs(testobj.x - this.x) < 1.5 ) && ( Math.abs(testobj.y - this.y) < 1.5 ) ) {
				// Extinguish the fire
				var index = newobjects.indexOf(this);
				newobjects.splice( index, 1 );
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
	for(i = 0; i < objects.length; i++) {
		var testobj = objects[i];
		
		if ((testobj.wet) && !(testobj === this)) {
			if ( ( Math.abs(testobj.x - this.x) < 1.5 ) && ( Math.abs(testobj.y - this.y) < 1.5 ) ) {
				newobjects.splice( i, 1 ); // remove the water
				var index = newobjects.indexOf(this);
				newobjects[index] = new Plant();
				newobjects[index].x = this.x;
				newobjects[index].y = this.y;
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
		
		if (!objects.reduce(particleInteraction(testx,testy,this),false)) {
			var newVine = new Plant();
			newVine.x = testx; newVine.y=testy;
			objects.push(newVine);
			
			index = newobjects.indexOf(this);
			newobjects[index] = new Wood();
			newobjects[index].x = this.x;
			newobjects[index].y = this.y;
		}
	}
	
	this.counter = this.counter - 1;
	if (this.counter < 0) {
		index = newobjects.indexOf(this);
		newobjects[index] = new Wood();
		newobjects[index].x = this.x;
		newobjects[index].y = this.y;
	}
}

Water.prototype = new Particle();
Water.prototype.constructor = Water;
function Water() {
	this.g = -1; // pixels / click
	this.style = "cyan" ; // style
	this.flammable = false;
	this.wet = true;
	this.lubricant = false;
	this.matter = true;
}

Fountain.prototype = new generalFactory(Water);
Fountain.prototype.constructor = Fountain;
function Fountain() {}

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
	for(i = 0; i < objects.length; i++) {
		var testobj = objects[i];
		
		if ((testobj.lubricant)&& !(testobj === this)) {
			if ( ( Math.abs(testobj.x - this.x) < 1.5 ) && ( Math.abs(testobj.y - this.y) < 1.5 ) ) {
				newobjects.splice( i, 1 ); // remove the oil
				var index = newobjects.indexOf(this);
				newobjects[index] = new Nanobot();
				newobjects[index].x = this.x;
				newobjects[index].y = this.y;
			}
		}
	}
}

Nanobot.prototype = new Particle();
Nanobot.prototype.constructor = Nanobot;
function Nanobot() {
	this.g = 0;
	this.style = "#AAA";
	this.flammable = false;
	this.counter = 20;
	this.wet = false;
	this.lubricant = false;
	this.matter = true;
}
Nanobot.prototype.update = function() {
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
		
		if (!objects.reduce(particleInteraction(testx,testy,this),false)) {
			var newVine = new Nanobot();
			newVine.x = testx; newVine.y=testy;
			objects.push(newVine);
			
			index = newobjects.indexOf(this);
			newobjects[index] = new Rust();
			newobjects[index].x = this.x;
			newobjects[index].y = this.y;
		}
	}
	
	this.counter = this.counter - 1;
	if (this.counter < 0) {
		index = newobjects.indexOf(this);
		newobjects[index] = new Rust();
		newobjects[index].x = this.x;
		newobjects[index].y = this.y;
	}
}