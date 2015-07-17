// Particle constructor

function Particle(options) {
	this.x = options.x; // screen pixels
	this.y = options.y; // screen pixels
	this.g = options.g; // pixels / click
	this.style = options.style || "#FFF" ; // style
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