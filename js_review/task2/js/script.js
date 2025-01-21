"use strict";

function setup() {
    console.log("go")

    createCanvas(600, 600);
}

function draw() {
    //background
    background("#000000");

    drawEllipse(50, 50, 80, 80, 255, 0, 0);
    drawEllipse(150, 150, 100, 100, 0, 0, 255);
    drawEllipse(300, 300, 120, 120, 0, 255, 0);
}

function drawEllipse(x,y,w,h,r,g,b){
    push();
    noStroke();
    fill(r,g,b);
    ellipse(x,y,w,h) 
    pop();
}