function setup() {
  createCanvas(200,200);
}

function draw() {
  background(50,255,100); //green
  //background(230);

  let t = frameCount / 100;
  let n = 60 + noise(t);

  stroke(100); //Gray
  //stroke(255,140,150); //Pink
  //stroke(30,10,10); //Dark red

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++){
      x = map(i, 0, n - 1, 0, width);
      y = map(j, 0, n - 1, 0, height);

      let size = periodic(t - offsetMiddle(x, y))*sin(dist(x, y, width/2, height/2));
      strokeWeight(size);
      point(x,y);
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

//Best functions for size:
/*
periodic(t - offsetMiddle(x, y))*sin(dist(x, y, width/2, height/2))
cos(dist(x, y, width/2, height/2));
periodic(t - (offsetVar(x, sin(y), width/4, height/4)))*periodic(t - (offsetVar(x, y, width - width/4, height - height/4)));
*/

//TODO:
// - Make it generative, find good constraints for each variable
