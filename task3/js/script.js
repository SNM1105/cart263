let rect1X, rect1Y, rect1Width, rect1Height;
let rect2X, rect2Y, rect2Width, rect2Height;
let rect3X, rect3Y, rect3Width, rect3Height;

function setup() {
  createCanvas(600, 400);

  rect1X = 50;
  rect1Y = 50;
  rect1Width = 50;
  rect1Height = 50;

  rect2X = 200;
  rect2Y = 200;
  rect2Width = 50;
  rect2Height = 50;

  rect3X = 350;
  rect3Y = 0;
  rect3Width = 50;
  rect3Height = 50;
}

function draw() {
  background("#000000");

  fill('red');
  rect(rect1X, rect1Y, rect1Width, rect1Height);

  fill('green');
  rect(rect2X, rect2Y, rect2Width, rect2Height);

  fill('blue');
  rect(rect3X, rect3Y, rect3Width, rect3Height);

  rect3Y += 2;

  if (rect3Y > height) {
    rect3Y = 0;
  }
}

function mousePressed() {
  rect1X = mouseX - rect1Width / 2;
  rect1Y = mouseY - rect1Height / 2;
}

function keyPressed() {
  if (key === ' ') {
    rect2X = random(0, width - rect2Width);
    rect2Y = random(0, height - rect2Height);
  }
}
