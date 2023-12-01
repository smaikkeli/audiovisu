let numArcs; // Number of arcs
let arcAngle; // Angle of each arc

function setup() {
  createCanvas(400, 400);
  noiseDetail(24);
  numArcs = 10;
  arcAngle = PI/ 10;
}


function draw() {
  background(50, 255, 100);

  let t = frameCount / 100;
  let n = 20; // Number of points per arc

  noFill(); // No fill for the shapes
  stroke(100); // Color of the shapes
  strokeWeight(5); // Thickness of the shapes

  push(); // Start a new drawing state
  beginShape(); // Start a new shape

  for (let arc = 0; arc < numArcs; arc++) {
    let angleOffset = arc * TWO_PI / numArcs;


    for (let i = 0; i <= n; i++) {
      let angle = angleOffset + (arcAngle / n) * i;
      let baseDistance = dist(0, 0, width / 2, height / 2);

      let noiseFactor = noise(arc * 0.1 + i * 0.1, t);
      let distance = baseDistance * noiseFactor * sin(2*t);

      let horizontalOffset = map(noise(i * 0.1, t), 0, 1, -50, 50);

      let x = width / 2 + distance * cos(angle + t) + horizontalOffset;
      let y = height / 2 + distance * sin(angle + t);

      vertex(x, y); // Add a vertex to the shape at this location
    }

  }
  //Connect the last point back to the first point

  endShape(); // End the shape

  pop(); // Restore original drawing state
}


function glitches(){
  if (frameCount % 10 == 0) {
    //Copy random rectangle from the screen to another part of the canvas
    let x1 = random(width+10);
    let y1 = random(height+10);
    let x2 = random(width)+10;
    let y2 = random(height+10);
    let w = random(10, 50);
    let h = random(10, 50);
    glitches.push({'copy': [x1, y1, x2, y2, w, h], 'frames': random(10,100)});
  }

  //Draw the copied rectangles
  for (let i = glitches.length - 1; i >= 0; i--) {
    let g = glitches[i];
    if (g.frames > 0) {
      copy(g.copy[0], g.copy[1], g.copy[4], g.copy[5], g.copy[2], g.copy[3], g.copy[4], g.copy[5]);
      g.frames--;
    //Remove the rectangle from the array when it's done
    } else {
      glitches.splice(i, 1);
    }
  }
}

function periodic(p) {
  return map(sin(TWO_PI * p), -1, 1, random(4,5), random(7,9));
}

function offsetMiddle(x, y) {
  return dist(x, y, width/2, height/2) / 100;
}

function offsetVar(x,y ,ox,oy) {
  return dist(x,y, ox, oy) / 100;
}

function keyPressed() {
  if (key == 's' || key == 'S') saveGif('radialWave', 5);
}