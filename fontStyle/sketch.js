let font;
let armyfont;
let pehmeet = [];
let billboard = [];
let camo_picture;

function preload() {
  font = loadFont('assets/Anyk.ttf');
  armyfont = loadFont('assets/armyrust.ttf');
}

function setup() {
  createCanvas(400, 400);
  pehmeet = font.textToPoints('pehmeat pojat', 75, 140, 40, 
    { sampleFactor: 3});

  pehmeet.forEach(p => {
    p.x += noise(p.x)*2;
    p.y += noise(p.y)*2;  
  });

  billboard = armyfont.textToPoints('BILLBOARD', 50, 200, 80,
   { sampleFactor: 0.5});
  
  billboard.forEach(p => {
    p.x += noise(p.x)*2;
    p.y += noise(p.y)*2;
  })
}

function draw() {
  background(80);
  stroke(50, 200, 50);

  let t = frameCount;

  stroke(200);
  for (let j = 0; j < 100; j += 30) {
    for (let i = 0; i < billboard.length; i++) {
      let p = billboard[i];
      //Make a rotating line based on time and sin
      let angle = map(noise(t/100), 0, 1, 0, TWO_PI*2);
      let r = noise(t/10)*1;
      let x = p.x + cos(angle)*r;
      let y = p.y + sin(angle)*r;
      stroke(100 + abs(sin(frameCount * i * 0.000003)*150));
      line(p.x, p.y + j, x, y + j);
      /*push();
      translate(p.x, p.y);
      rotate(radians(sin(frameCount * i * 0.00003) * 180));
      let w = dist(mouseX + i, mouseY, p.x, p.y);
      w = constrain(w, 0, 50);
      line(0,0, w, w);
      pop()*/
    }
  }

  stroke(50, 200, 50);


  pehmeet.forEach(p => {

    if (random(1) < 0.9) {
      point(p.x + random(-1,1)*(mouseX - width/2), p.y  +random()*(mouseY- height/2));
    } else {
      point(p.x, p.y);
    }
  });

}


