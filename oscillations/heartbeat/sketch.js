let heartPoints = [];
const RESOLUTION = 0.1;
let startColor, endColor, midColor;

function setup() {
  createCanvas(400, 400);
  background(220);
  frameRate(30); // Adjust this for faster or slower heartbeat
  
  startColor = color(255, 100, 180);  // Pink
  midColor = color(200, 50, 230);       // Red
  endColor = color(50, 0, 0);        // Dark Red
}

let heartScales = [8, 5, 2];

//Calculate the points of a heart shape using the parametric equation
function computeHeartPoints(scale) {
  let points = [];
  for (let t = 0; t < TWO_PI; t += RESOLUTION) {
    let x = 16 * pow(sin(t), 3) * scale;
    let y = -(13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4*t)) * scale;
    points.push(createVector(x, y));
  }
  return points;
}

//Find the nearest point that lies on a heart shape
function distanceToNearestHeart(x, y, allHeartPoints) {
  let minDist = Infinity;
  for (let heartPoints of allHeartPoints) {
    for (let pt of heartPoints) {
      let d = dist(x, y, pt.x, pt.y);
      if (d < minDist) {
        minDist = d;
      }
    }
  }
  return minDist;
}  

function draw() {
  background(0);
  translate(width/2, height/2); 
  strokeWeight(0);

  let spacing = 7;
  let allHeartPoints = [];  // This will store points for all hearts

  for (let i = 0; i < heartScales.length; i++) {
    let beat = 0.1 * sin(frameCount * 0.1);
    heartScales[i] += beat / (i + 1); // Different hearts have different beat magnitudes.
    allHeartPoints.push(computeHeartPoints(heartScales[i]));
  }

  let colorOscillator = (sin(frameCount * 0.2) + 1) /2;  // Oscillates between 0 and 1
  let currentHeartColor = lerpColor(startColor, midColor, colorOscillator); // Interpolate between pink and red
  
  for (let x = -width/2; x < width/2; x += spacing) {
    for (let y = -height/2; y < height/2; y += spacing) {
      let minDist = distanceToNearestHeart(x, y+25, allHeartPoints);
      let size = constrain(map(minDist, 0, 25, 25, 5), 1, 4);
      let col = lerpColor(currentHeartColor, endColor, map(minDist, 0, 25, 0, 1));
      fill(col);
      ellipse(x, y, size);
    }
  }
}




