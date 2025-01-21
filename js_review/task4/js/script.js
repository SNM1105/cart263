"use strict";

function setup() {
    console.log("go")

    createCanvas(600, 600);
}

function draw() {
    background('#000000');

    drawRect(0, 0, 200, 600, 0, 0, 255);
    drawRect(200, 0, 200, 600, 0, 100, 255);
    drawRect(400, 0, 200, 600, 50, 255, 255);
}

function drawRect(x, y, w, h, r, g, b) {
    push();
    noStroke();
    fill(hoverWhite(x,y,w,h,r,g,b));
    rect(x, y, w, h);
    pop();
}

function hoverWhite(x, y, w, h, r, g, b) {
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        return color(255);
    } else {
        return color(r, g, b);
    }
}