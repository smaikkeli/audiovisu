let heartPoints = [];
const RESOLUTION = 0.07;
let startColor, endColor, midColor;

const heartScales = [8, 5, 2]; // Fixed sizes of hearts
const spacing = 6;             // Spacing between points

function setup() {
  createCanvas(400, 400);
  noLoop();  // Render only once
  
  // Define colors
  startColor = color(255, 100, 180);  // Pink
  midColor = color(200, 50, 230);     // Purple
  endColor = color(50, 0, 0);         // Dark Red

  // Precompute heart points for each scale
  for (let scale of heartScales) {
    heartPoints.push(computeHeartPoints(scale));
  }

  drawHearts(); // Call to render the hearts
}

// Compute the points of a heart shape using the parametric equation
function computeHeartPoints(scale) {
  let points = [];
  for (let t = 0; t < TWO_PI; t += RESOLUTION) {
    let x = 16 * pow(sin(t), 3) * scale;
    let y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)) * scale;
    points.push(createVector(x, y));
  }
  return points;
}

// Draw the hearts
function drawHearts() {
  background(0);
  translate(width / 2, height / 2);
  strokeWeight(3);

  let currentHeartColor = startColor; // Fixed color, no animation

  for (let x = -width / 2; x < width / 2; x += spacing) {
    for (let y = -height / 2; y < height / 2; y += spacing) {
      let minDist = distanceToNearestHeart(x, y);
      let size = constrain(map(minDist, 0, 25, 25, 5), 7, spacing);
      let col = lerpColor(currentHeartColor, endColor, map(minDist, 0, 25, 0, 1));
      fill(col);
      ellipse(x, y, size);
    }
  }
}

// Find the nearest point that lies on a heart shape
function distanceToNearestHeart(x, y) {
  let minDist = Infinity;
  for (let points of heartPoints) {
    for (let pt of points) {
      let d = dist(x, y, pt.x, pt.y);
      if (d < minDist) {
        minDist = d;
      }
    }
  }
  return minDist;
}