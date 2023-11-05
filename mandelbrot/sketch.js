function setup() {
  createCanvas(600,600);
  noStroke();
  colorMode(HSB);
  
  drawBrot();
}

//Center values and zoom scale
let cenX = -0.716;
let cenY = 0.35361;
let scale = 250;

//Draws the mandelbrot set, with the given center and scale
function drawBrot() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let c = pixelToPoint(x,y);
      let result = calculatePoint(c);
      
      //Coloring
      if (result.isIn) {
        set(x,y,color(200, 100, 45));
      } else if (result.i > 1) {
        set(x,y, color(
        200 - pow(result.i/(22), 2) * 200 % 255, 20, 255));
      } else {
        set(x, y, color(255));
      }
    }
  }
  updatePixels();
}

//Converts a pixel coordinate to a point on the complex plane
function pixelToPoint(x, y) {
  let p = createVector(
  (x - width/2) * (4/width) * (16/(9*scale)) + cenX,
  (y - height/2)  * (4/height) * (2/scale) + cenY);
  return p;
}

//Calculates the number of iterations it takes for a point to escape the mandelbrot set
function calculatePoint(c) {
  let z0 = createVector(0,0);
  let i = 0;
  let bounds = 2;
  let isIn = true;
  
  while ( i < 70 && isIn) {
      z0 = createVector(
      z0.x**2 - z0.y**2 + c.x,
      2*z0.x*z0.y + c.y);
      i++;
      if(z0.mag() > bounds) {
        isIn = false
      }
    }
  return{
    'i':i,
    'isIn':isIn
  };
}