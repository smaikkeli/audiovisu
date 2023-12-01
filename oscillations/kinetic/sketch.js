let marsufont;
let t = 0;
let CELL_SIZE = 10;

function preload() {
}


function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20);

  t += 0.005;
  //stroke pink
  stroke(255, 0, 255);

  for (let theta = 0; theta < TWO_PI; theta += 0.2) {
    //Create a vector of size (width, y)
    let p = createVector(width/2, height/2);
    let v = createVector(cos(theta)*10, sin(theta)*10);
    console.log(p.x);
    for (let i = 0; i < 30; i++) {
      let oldX = p.x;
      let oldY = p.y;
      
      let a  = getFlow(p.x, p.y);
      console.log(a.y);
      v.x += a.x;
      v.y += a.y;
      p.x += v.x;
      p.y += v.y;

      line(oldX, oldY, p.x, p.y);
    }
  }
}

function getFlow(x, y) {
  let angle = noise(x/100 + t, y/100 + t) * TWO_PI * 2;
  let v = p5.Vector.fromAngle(angle);
  v.setMag(1);
  return v;
}
