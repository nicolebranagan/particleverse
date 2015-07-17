// Particle constructor

function Particle(options) {
	this.g = -1; // pixels / click
	this.style = "#FFF" ; // style
}

Particle.prototype.draw = function(context) {
	context.fillStyle = this.style;
	context.fillRect(this.x,this.y,2,2);
}

Particle.prototype.update = function() {
	var ytest = this.y - this.g;
	particleInteraction = function(x){
		return function(prev, curr, index, array) {
			if (prev)
				return true;
			else
				return ((Math.abs(curr.y - ytest) < 1) && (Math.abs(curr.x - x) < 1));
		}
	}
	
	if (ytest < 480 && ytest > 0 && !objects.reduce(particleInteraction(this.x), false))
		this.y = ytest;
}

Solid.prototype = new Particle();
Solid.prototype.constructor = Solid;
function Solid(options) {
	this.g = 0; // pixels / click
	this.style = "#888" ; // style
}
