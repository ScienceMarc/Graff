class FunctionObject {
	constructor(f) {
		this.f = f;
		this.color = color(random(0,255),random(0,255),random(0,255));
	}
}

let scale = 40;
let functions = [];


function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(20);
	push()
	fill("white")
	stroke("black")
	text(round(frameRate()),0,10);
	for (let i = -round((windowWidth/2)/scale); i < round((windowWidth/2)/scale) + 1; i++) {
		text(round(i*10)/10,i*scale + windowWidth/2,windowHeight/2 + 10);
	}
	for (let i = -round((windowHeight/2)/scale); i < round((windowHeight/2)/scale) + 1; i++) {
		text(round(i*10)/10,windowWidth/2, i*scale + windowHeight/2 - 5);
	}
	pop()
	push()
	strokeWeight(2);
	stroke(40)
	for (let i = -round((windowWidth/2)/scale); i < round((windowWidth/2)/scale) + 1; i++) {
		line(i*scale + windowWidth/2,0,i*scale + windowWidth/2,windowHeight);
	}
	for (let i = -round((windowHeight/2)/scale); i < round((windowHeight/2)/scale) + 1; i++) {
		line(0, i*scale + windowHeight/2, windowWidth, i*scale + windowHeight/2);
	}
	stroke("gray");
	line(0,windowHeight/2,windowWidth,windowHeight/2);
	line(windowWidth/2,0,windowWidth/2,windowHeight);
	pop()
	stroke("white");
	
	strokeWeight(2);
	//scale = frameCount/10;
	//plot(func,"white");
	//plot((x)=>{return (func(x + 0.0001) - func(x))/0.0001},"red")
	for (let i = 0; i < functions.length; i++) {
		plot(functions[i].f,functions[i].color)
	}
}

function plot(f,color) {
	let points = [];
	for (let i = -(windowWidth/2)/scale; i < (windowWidth/2)/scale + 1; i+=1/(Math.ceil(scale/2))) {
		points.push(createVector((i*scale)+(windowWidth/2),-(f(i)*scale)+windowHeight/2,i));
		//point((i*scale)+(windowWidth/2),-(f(i)*scale)+windowHeight/2);
	}
	for (let i = 0; i < points.length - (points.length%2) - 1; i++) {
		let grad = (f(points[i].z + 0.0001) - f(points[i].z))/0.0001;
		if (Math.abs(grad) > 200 || Number.isNaN(grad)) {
			stroke(0,0,0,0);
		}
		else {
			stroke(color);
		}
		line(points[i].x,points[i].y,points[i+1].x,points[i+1].y);
	}
}

function addFunction(f) {
	functions.push(new FunctionObject(math.evaluate(f)));
}