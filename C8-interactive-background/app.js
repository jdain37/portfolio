const NUM_CONFETTI = 100;
const COLORS = [
    [243, 238, 234], // '#F3EEEA'
    [235, 227, 213], // '#EBE3D5'
    [176, 166, 149], // '#B0A695'
    [208, 212, 202], // '#D0D4CA'
];

const PI_2 = 2 * Math.PI;

const canvas = document.getElementById("snow");
const canvasContext = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', resizeWindow, false);

window.onload = () => setTimeout(resizeWindow, 0);

function range(min, max) {
    return (max - min) * Math.random() + min;
  }
  

function drawCircle(x, y, r, style) {
  canvasContext.beginPath();
  canvasContext.arc(x, y, r, 0, PI_2, false);
  canvasContext.fillStyle = style;
  canvasContext.fill();
}

let xpos = 0.5;

document.onmousemove = (e) => {
  xpos = e.pageX / window.innerWidth;
};

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };

class Confetti {
  constructor() {
    this.style = COLORS[~~range(0, 4)];
    this.rgb = `rgba(${this.style[0]}, ${this.style[1]}, ${this.style[2]}`;
    this.r = ~~range(2, 7);
    this.r2 = 2 * this.r;
    this.replace();
  }

  replace() {
    this.opacity = 0;
    this.dop = 0.03 * range(1, 4);
    this.x = range(-this.r2, window.innerWidth - this.r2);
    this.y = range(-20, window.innerHeight - this.r2);
    this.xmax = window.innerWidth - this.r;
    this.ymax = window.innerHeight - this.r;
    this.vx = range(0, 2) + 8 * xpos - 5;
    this.vy = 0.7 * this.r + range(-1, 1);
  }

  draw() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;
    if (this.opacity > 1) {
      this.opacity = 1;
      this.dop *= -1;
    }
    if (this.opacity < 0 || this.y > this.ymax) {
      this.replace();
    }
    if (!(0 < this.x && this.x < this.xmax)) {
      this.x = (this.x + this.xmax) % this.xmax;
    }
    drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb}, ${this.opacity})`);
  }
}

const confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());

function step() {
  requestAnimationFrame(step);
  canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confetti.forEach((c) => c.draw());
}

step();

function resizeWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  confetti.forEach((c) => c.replace());
}
