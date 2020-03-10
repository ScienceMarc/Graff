class FunctionObject { //Contains the function as well as the color of the line.
	constructor(f) {
		this.f = f;
		this.color = color(random(0,255),random(0,255),random(0,255)); //TODO: come up with a better random color function which ensures good contrast.
	}
}

let scale = 40; //The amount that the chart is zoomed in by. The higher, the more zommed in. Small numbers lead to problems
let functions = [];


function setup() {
	createCanvas(windowWidth, windowHeight); //Take up the whole window.
}

function draw() {
	background(20);
	push()
	fill("white")
	stroke("black")
	text(round(frameRate()),0,10); //TODO: hide later
	for (let i = -round((windowWidth/2)/scale); i < round((windowWidth/2)/scale) + 1; i++) { //X axis units 
		text(round(i*10)/10,i*scale + windowWidth/2,windowHeight/2 + 10); //TODO: Add support for variable increments
	}
	for (let i = -round((windowHeight/2)/scale); i < round((windowHeight/2)/scale) + 1; i++) { //Y axis units
		text(round(i*10)/10,windowWidth/2, i*scale + windowHeight/2 - 5); //TODO: add support for the complex plane and polar coordinates
	}
	pop()
	push()
	strokeWeight(2);
	stroke(40)
	//TODO: add support for polar coordinates and warping due to transformations
	for (let i = -round((windowWidth/2)/scale); i < round((windowWidth/2)/scale) + 1; i++) { //X axis subdivision lines
		line(i*scale + windowWidth/2,0,i*scale + windowWidth/2,windowHeight);
	}
	for (let i = -round((windowHeight/2)/scale); i < round((windowHeight/2)/scale) + 1; i++) { //Y axis subdivision lines
		line(0, i*scale + windowHeight/2, windowWidth, i*scale + windowHeight/2);
	}
	stroke("gray");
	line(0,windowHeight/2,windowWidth,windowHeight/2); //Horizontal line
	line(windowWidth/2,0,windowWidth/2,windowHeight); //Vertical line
	pop()
	stroke("white");
	
	strokeWeight(2);
	////scale = frameCount/10;
	for (let i = 0; i < functions.length; i++) { //Plot every function in the list
		plot(functions[i].f,functions[i].color)
	}
}

function plot(f,color) {
	let points = [];
	for (let i = -(windowWidth/2)/scale; i < (windowWidth/2)/scale + 1; i+=1/(Math.ceil(scale/2))) { //Computes all of the points along the function
		points.push(createVector((i*scale)+(windowWidth/2),-(f(i)*scale)+windowHeight/2,i)); //TODO: add support for complex values
	}
	for (let i = 0; i < points.length - (points.length%2) - 1; i++) {
		let grad = (f(points[i].z + 0.0001) - f(points[i].z))/0.0001; //Finds the dervative of the curret point.
		if (Math.abs(grad) > 200 || Number.isNaN(grad)) { //If the line is too steep or invalid make the line invisible
			stroke(0,0,0,0);
		}
		else { //Otherwise draw it using the correct color
			stroke(color);
		}
		line(points[i].x,points[i].y,points[i+1].x,points[i+1].y); //Links the calculated points with lines to smooth out the curve
	}
}

function addFunction(f) {
	functions.push(new FunctionObject(math.evaluate(f))); //Allows adding functions using a string
														  //TODO: add support to use this without the console.
}