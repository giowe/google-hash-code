'use strict';

const c = document.getElementById('canvas');
const ctx = c.getContext("2d");

ctx.beginPath();
ctx.rect(20, 20, 150, 100);
ctx.fillStyle = "red";
ctx.fill();
