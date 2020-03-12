class FunctionObject { //Contains the function as well as the color of the line.
	constructor(f, input) {
		this.f = f;
		this.color = color(random(0, 255), random(0, 255), random(0, 255)); //TODO: come up with a better random color function which ensures good contrast.
		this.input = input;
	}
}

let scale = 40; //The amount that the chart is zoomed in by. The higher, the more zommed in. Small numbers lead to problems
let functions = [];
let scope = {};

function setup() {
	createCanvas(windowWidth, windowHeight); //Take up the whole window.
}

function draw() {
	background(20);

	push();
	strokeWeight(2);
	let increment = max(1,Math.round(40/scale))/Math.ceil(scale/200)
	//TODO: add support for polar coordinates and warping due to transformations
	for (let i = -round((windowWidth / 2) / scale); i < round((windowWidth / 2) / scale) + 1; i+=increment) { //X axis subdivision lines
		if ((round(i * 10) / 10)%1!=0) {
			stroke(40);
		}
		else {
			stroke(80);
		}
		line(i * scale + windowWidth / 2, 0, i * scale + windowWidth / 2, windowHeight);
	}
	for (let i = -round((windowHeight / 2) / scale); i < round((windowHeight / 2) / scale) + 1; i+=increment) { //Y axis subdivision lines
		if ((round(i * 10) / 10)%1!=0) {
			stroke(40);
		}
		else {
			stroke(80);
		}
		line(0, i * scale + windowHeight / 2, windowWidth, i * scale + windowHeight / 2);
	}
	stroke(150);
	line(0, windowHeight / 2, windowWidth, windowHeight / 2); //Horizontal line
	line(windowWidth / 2, 0, windowWidth / 2, windowHeight); //Vertical line
	pop();
	push();
	fill("white");
	stroke("black");
	text(round(frameRate()), 0, 10); //TODO: hide later
	for (let i = -round((windowWidth / 2) / scale); i < round((windowWidth / 2) / scale) + 1; i+=increment) { //X axis units 
		text(round(i * 10) / 10, i * scale + windowWidth / 2 - 3, windowHeight / 2 + 10);
	}
	for (let i = -round((windowHeight / 2) / scale); i < round((windowHeight / 2) / scale) + 1; i+=increment) { //Y axis units
		if (-round(i * 10) / 10 == 0) { continue; }
		text(-round(i * 10) / 10, windowWidth / 2 + 1, i * scale + windowHeight / 2 + 3); //TODO: add support for the complex plane and polar coordinates
	}
	pop();
	stroke("white");

	strokeWeight(2);
	////scale = frameCount/10;
	for (let i = 0; i < functions.length; i++) { //Plot every function in the list
		functions[i].points = [];
		plot(i, functions[i].color);
	}
	UI();
	noLoop()
}

function plot(index, color) {
	let f = functions[index].f;
	if (typeof f != "function") {
		return;
	}
	let points = [];
	if (points.length == 0 || true) {
		for (let i = -(windowWidth / 2) / scale; i < (windowWidth / 2) / scale + 1; i += 1 / (Math.ceil(scale / 5))) { //Computes all of the points along the function
			points.push(createVector((i * scale) + (windowWidth / 2), -(f(i) * scale) + windowHeight / 2, i)); //TODO: add support for complex values
		}
	}

	for (let i = 0; i < points.length - (points.length % 2) - 1; i++) {
		let grad = (f(points[i].z + 0.0001) - f(points[i].z)) / 0.0001; //Finds the dervative of the curret point.
		if (Math.abs(grad) > 200 || Number.isNaN(grad)) { //If the line is too steep or invalid make the line invisible
			stroke(0, 0, 0, 0);
		}
		else { //Otherwise draw it using the correct color
			stroke(color);
		}
		line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y); //Links the calculated points with lines to smooth out the curve
	}
}


function addFunction(f) {
	let sanatized = f;
	if (/^[^=]*/i.test(sanatized)) {
		sanatized = "f(x) = " + sanatized;
	}
	sanatized = sanatized.replace(/^y(\s)*/i, "f(x) ");
	console.log(sanatized)
	functions.push(new FunctionObject(math.evaluate(sanatized, scope),f)); //Allows adding functions using a string
	//TODO: add support to use this without the console.
}


let isTyping = false;
let typedText = "";
function UI() {
	push();
	stroke(100);
	fill(50);

	rect(0, 0, windowWidth * 0.2, windowHeight);
	fill("white");
	textSize(24);
	text("+", windowWidth * 0.2 - 24, 24);
	for (let i = 0; i < functions.length; i++) {
		text(functions[i].input, 0, 50 + 50*i);
	}
	if (isTyping) {
		text(typedText + "|", 0, 50 + 50*functions.length);
	}
	pop();
}

function mouseClicked() {
	if (mouseX >= windowWidth * 0.2 - 24 && mouseX <= windowWidth * 0.2 && mouseY >= 5 && mouseY <= 24) {
		isTyping = true;
	}
	//console.log(mouseX)
	loop();
}

function keyPressed() {
	if (isTyping) {
		if (keyCode == BACKSPACE) {
			typedText = typedText.substring(0, typedText.length - 1);
		}
		if (keyCode == ENTER) {
			addFunction(typedText);
			typedText = "";
			isTyping = false;
		}
	}
	loop();
}
function keyTyped() {
	if (isTyping) {
		typedText += key;
	}
	loop();
}
function mouseWheel(event) {
	scale -= event.delta/10;
	if (scale < 25) {
		scale = 25;
	}
	//console.log(scale)
	loop();
	return false;
}