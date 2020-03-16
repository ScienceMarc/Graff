class FunctionObject { //Contains the function as well as the color of the line.
	constructor(f, input) {
		this.f = f;
		this.color = color(random(0, 255), random(0, 255), random(0, 255)); //TODO: come up with a better random color function which ensures good contrast.
		if (typeof this.f != "function") {
			this.color = color("white");
		}
		this.input = input;
	}
}

let scale = 40; //The amount that the chart is zoomed in by. The higher, the more zommed in. Small numbers lead to problems
let functions = [];
let scope = {};
let offset;
let accuracy = 5;

function setup() {
	createCanvas(windowWidth, windowHeight); //Take up the whole window.
	offset = createVector(0,0);
}
let offsetIncrement = 0;
function draw() {
	background(20);
	push();
	strokeWeight(2);
	let increment = max(1,Math.round(40/scale))/Math.ceil(scale/200);
	//TODO: add support for polar coordinates and warping due to transformations
	offsetIncrement = round(offset.x * (1/scale))
	////line(windowWidth/2,10,scale + windowWidth/2,10)
	for (let i = -round((windowWidth / 2) / scale) - offsetIncrement; i < round((windowWidth / 2) / scale) + 1 - offsetIncrement; i+=increment) { //X axis subdivision lines
		if ((round(i * 10) / 10)%1!=0 && false) {
			stroke(40);
		}
		else {
			stroke(80);
		}
		line(i * scale + windowWidth / 2 + offset.x, 0, i * scale + windowWidth / 2 + offset.x, windowHeight);
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
	line(windowWidth / 2 + offset.x, 0, windowWidth / 2 + offset.x, windowHeight); //Vertical line
	pop();
	push();
	fill("white");
	stroke("black");
	for (let i = -round((windowWidth / 2) / scale) - offsetIncrement; i < round((windowWidth / 2) / scale) + 1 - offsetIncrement; i+=increment) { //X axis units 
		text(round(i * 10) / 10, i * scale + windowWidth / 2 - 3 + offset.x, windowHeight / 2 + 10);
	}
	for (let i = -round((windowHeight / 2) / scale); i < round((windowHeight / 2) / scale) + 1; i+=increment) { //Y axis units
		if (-round(i * 10) / 10 == 0) { continue; }
		text(-round(i * 10) / 10, windowWidth / 2 + 1 + offset.x, i * scale + windowHeight / 2 + 3); //TODO: add support for the complex plane and polar coordinates
	}
	pop();
	stroke("white");

	strokeWeight(2);
	for (let i = 0; i < functions.length; i++) { //Plot every function in the list
		functions[i].points = [];
		try {
			plot(i, functions[i].color);
		}
		catch(e) {
			alert(e)
			functions.pop();
		}
	}
	UI();
	noLoop()
}

function plot(index, color) {
	let f = functions[index].f;
	if (typeof f != "function") { //Dont plot if it isn't a function e.g. "a = 10"
		return;
	}
	let points = [];
	if (points.length == 0 || true) {
		for (let i = -(windowWidth / 2) / scale; i < (windowWidth / 2) / scale + 1; i += 1 / (Math.ceil(scale / accuracy))) { //Computes all of the points along the function
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
		line(points[i].x + offset.x, points[i].y, points[i + 1].x + offset.x, points[i + 1].y); //Links the calculated points with lines to smooth out the curve
	}
}

function randomFunctionName(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

function addFunction(f) {
	let sanatized = f;
	if (/^[^=]*$/i.test(sanatized)) {
		sanatized = randomFunctionName(8) + "(x) = " + sanatized;
	}
	else {
		sanatized = sanatized.replace(/^y(\s)*/i, randomFunctionName(8) + "(x) ");
	}
	console.log(sanatized)
	try {
		functions.push(new FunctionObject(math.evaluate(sanatized, scope),f)); //Allows adding functions using a string
	}
	catch(e) {
		alert(e);
	}
}


let isTyping = false;
let typedText = "";
let showingSidebar = true;
function UI() {
	if (showingSidebar) {
		push();
		stroke(100);
		fill(50);
	
		rect(0, 0, 300, windowHeight);
		fill("white");
		textSize(24);
		push();
		stroke(0,0,0,0);
		text("+", 300 - 24, 24);
		pop();
		for (let i = 0; i < functions.length; i++) {
			push()
			fill(functions[i].color);
			text(functions[i].input, 0, 50 + 50*i);
			pop()
		}
		if (isTyping) {
			text(typedText + "|", 0, 50 + 50*functions.length);
		}
		pop();
	}
	push();
	fill("white");
	stroke(0,0,0,0);
	textSize(24);
	text("≡",5,24);
	pop();
}

function mouseClicked() {
	if (mouseX >= 300 - 24 && mouseX <= 300 && mouseY >= 5 && mouseY <= 24 && showingSidebar) { //Check if clicked on plus button
		isTyping = true;
	}
	if (mouseX >= 5 && mouseX <= 5 + 24 && mouseY >= 5 && mouseY <= 24) {
		showingSidebar = !showingSidebar;
	}
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
	loop();
	return false;
}
function mouseDragged() {
	if (Math.abs(pmouseX - mouseX) > 100) {
		loop();
		return;
	}
	offset.x -= pmouseX-mouseX;
	//console.log(pmouseX - mouseX)
	loop();
}