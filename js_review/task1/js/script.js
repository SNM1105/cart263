"use strict";

function setup() {
    console.log("go")

    createCanvas(600, 600);
}

function draw() {
    //background
    background("#000000");

    drawCircles();
}

function drawCircles() {
    drawCircle1();
    drawCircle2();
    drawCircle3();
}

function drawCircle1(){
    push();
    noStroke();
    fill('red');
    ellipse(50, 50, 80, 80) 
    pop();
}
function drawCircle2(){
    push();
    noStroke();
    fill('blue');
    ellipse(150, 150, 100, 100) 
    pop();
}
function drawCircle3(){
    push();
    noStroke();
    fill('green');
    ellipse(300, 300, 120, 120) 
    pop();
}