// Particle constructor

function Particle(options) {
	this.g = -1; // pixels / click
	this.style = "#FFF" ; // style
}

Particle.prototype.draw = function(context) {
	context.fillStyle = this.style;
	context.fillRect(this.x*2,this.y*2,2,2);
}

Particle.prototype.update = function() {
	var ytest = this.y - this.g;	
	if (ytest < 240 && ytest > 0) {
		if (!objects.reduce(particleInteraction(this.x, ytest), false))
			this.y = ytest;
		else {
			xtest = this.x + Math.sign(Math.random() - 0.5);
			if (!objects.reduce(particleInteraction(xtest, this.y), false))
				this.x = xtest;
		}
	}
}

Solid.prototype = new Particle();
Solid.prototype.constructor = Solid;
function Solid() {
	this.g = 0; // pixels / click
	this.style = "#888" ; // style
}
Solid.prototype.update = function() {;}

Factory.prototype = new Particle();
Factory.prototype.constructor = Factory;
function Factory() {
	this.g = 0;
	this.style = "#F00";
	this.counter = 0;
}
Factory.prototype.update = function() {
	this.counter = this.counter + 1;
	console.log(this.counter);
	if (this.counter == 2) {
	var obj = new Particle();
	obj.x = this.x + Math.floor(Math.random() * 3 - 1);
	obj.y = this.y + 1;
	
	objects.push(obj);
	this.counter = 0;
	}
}

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