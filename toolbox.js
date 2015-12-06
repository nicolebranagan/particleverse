// Basic GUI functions, nothing complicated

function Button(options) {
	this.x = options.x;
	this.y = options.y;
	this.w = options.width;
	this.h = options.height;
	this.label = options.label || "";
        this.clicked = false;
        this.mouseover = false;
	
	this.clickFunction = options.clickFunction;
}

Button.prototype.draw = function(context) {
	context.beginPath();
	context.rect(this.x, this.y, this.w, this.h);
        if (this.clicked)
            context.fillStyle = '#555';
        else if (this.mouseover)
            context.fillStyle = '#BBB';
        else
            context.fillStyle = 'white';
	context.fill();
	context.lineWidth = 3;
	context.strokeStyle = 'grey';
	context.stroke();
	
	context.fillStyle="black";
	context.font = "15px serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(this.label,this.x + (this.w/2),this.y + (this.h/2));
	context.textAlign = "center";
}

Button.prototype.onClick = function(event) {
	var x = event.pageX - gamecanvas.offsetLeft;
	var y = event.pageY - gamecanvas.offsetTop;
	
	if ((x > this.x) && (x < (this.x + this.w)) && 
			(y > this.y) && (y < (this.y + this.h))) {
		this.clickFunction();
        	this.clicked = true;
	}
}

Button.prototype.offClick = function(event) {
    this.clicked = false;
}

Button.prototype.mouseMove = function(event) {
    var x = event.pageX - gamecanvas.offsetLeft;
    var y = event.pageY - gamecanvas.offsetTop;
    
    if ((x > this.x) && (x < (this.x + this.w)) && 
                    (y > this.y) && (y < (this.y + this.h))) {
            this.mouseover = true;
    }
    else
        this.mouseover = false;
}
