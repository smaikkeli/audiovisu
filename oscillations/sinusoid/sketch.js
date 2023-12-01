let n;

function setup() {
  createCanvas(500,500);
  //Choose color randomly from a list
  stroke(70);
  n = random(65,80)
  noLoop(); // Stop the draw loop initially
}

function touchStarted() {
  if (isLooping()) {
    noLoop();
  } else {
    loop();
  }
}

let glitches = [];

function draw() {
  background(50, 200, 82); //green
  //background(230);

  let t = frameCount / 50;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++){
      x = map(i, 0, n - 1, 0, width);
      y = map(j, 0, n - 1, 0, height);

      let size = periodic(t - (offsetMiddle(x, y)))*sin(dist(x, y, width/2, height/2));
      //let size = periodic(t - offsetMiddle(x,y))*sin(dist(x, cos(y), width/2, height/2));
      strokeWeight(size);
      point(x,y);
    }
  }

  if (frameCount % 10 == 0) {
    //Copy random rectangle from the screen to another part of the canvas
    let x1 = random(width+25);
    let y1 = random(height+25);
    let x2 = random(width)+25;
    let y2 = random(height+25);
    let w = random(25, 120);
    let h = random(25, 120);
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
  return map(sin(TWO_PI * p), -1, 1, random(10,12), random(20,22));
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

//Best functions for size:
/*
periodic(t - offsetMiddle(x, y))*sin(dist(x, y, width/2, height/2))
cos(dist(x, y, width/2, height/2));
periodic(t - (offsetVar(x, sin(y), width/4, height/4)))*periodic(t - (offsetVar(x, y, width - width/4, height - height/4)));
*/

//TODO:
// - Make it generative, find good constraints for each variable
