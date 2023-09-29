let rectSets = [];
let yoff = 0.0
let sizeoff = 0.0;
let bassTrigger = true;

function preload() {
  sound = loadSound('assets/brkdp.mp3');
}

function setup() {
  //play the sound if mouse button clicked on the canva
  cnv = createCanvas(400, 400);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(0.3);

  colorMode(RGB);
  frameRate(25);
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function draw() {
  background(30);
  
  //Randomly make a new wave
  if (random() < 0.1) {
    rectSets.push(createRectangleWave(random(1,5)));
  }
  
  for (let wave of rectSets) {
    let waveStroke = random(0,100);
    for (let i = 0; i < wave.length; i++) {
      let r = wave[i];
      fill(r.color.levels[0], r.color.levels[1], r.color.levels[2], r.a);
      if (r.appearing) {
        if (r.a == 0) {
          r.a += random() < 0.2 ? 1 : 0;
          continue;
        }
        rect(r.x, r.y, r.size, r.size);
        //addShine(r.x, r.y, r.size, r.size);
        stroke(waveStroke);
        wave[i].a = wave[i].a  + 10;
        if (wave[i].a >= 255) {
          wave[i].appearing = false;
        }
      } else {
        wave[i].a -= random(5,20); 
        if (wave[i].a < 2 | rectSets.length > 3) {
          // Remove the rectangle when alpha is very low
          wave.splice(i, 1);// Add the rectangle to be removed
      }
      }
    }
  }
}

//Generates a perlin noise wave of rectangles
//Param int step: x distance in pixels between subsequent rectangles
function createRectangleWave(step) {
  let rects = [];

  // Generate a pastel color
  colorMode(HSB, 360, 100, 100); // Switch to HSB mode
  let hueValue = random(360); // Any hue from 0 to 360
  let saturationValue = random(100); // Low to medium saturation for pastel feel
  let brightnessValue = random(100); // High brightness for pastel feel
  let waveColor = color(hueValue, saturationValue, brightnessValue);

  colorMode(RGB, 255); // Switch back to RGB mode>

  //Go through the wave
  yoff = random(0, height);
  for (let x = 0; x<width; x += step) {
    //Change the strength of the waves
    yoff += 0.01;
    //Change strength of the rectangles
    sizeoff += 0.05;
    
    //Calculate the new y value
    let y = noise(yoff)*height;
    
    //Calculate the new rectangle size
    let rectSize = noise(sizeoff)*50;
    
    //Push the current rectangle
    rects.push({x: x,
                y: y,
                size: rectSize,
                a: 0,
                appearing: true,
                color: waveColor});
  }
  
  return rects;
}

function addShine(x, y, w, h) {
  noFill();
  for (let i = w/2; i > 0; i--) {
    let inter = map(i, 0, w/2, 50,0); // Decrease alpha value
    let c = color(255, 255, 255, inter);
    stroke(c);
    line(x + w/2 - i, y + h, x + w/2 - i, y );
    line(x + w/2 + i, y + h, x + w/2 + i, y);
  }
}