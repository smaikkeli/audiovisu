let offset = 0;
let barWidth = 0;
let padding = 8;
let colorIndex = 0;
let wrect;
let bpm;
let sound;

function preload() {
  sound = loadSound('./assets/brkdp.mp3');
}


function setup() {
  frameRate(60);
  let cnv = createCanvas(600,600);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  //let sound = loadSound('./assets/brkdp.mp3');
  sound.amp(0.3);
  colorMode(HSB);
  colorStart = random(360)
  wrect = random(5,15);
  background(200, 20, 20);
  addShine(width/4, height/4, 400, 300, 80);
  circle(width/2, height/2, 100);
  addShine(width/2 - 50, height/2 - 50, 100, 100, 80);
  line(width/4, 3*height/4, width/4 + 200, height/4);
  line(width/4, 3*height/4, 0, height/4);
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function draw() {
  background(200, 20, 20);
  addShine(width/4, height/4, 400, 300, 80);
  circle(width/2, height/2, 100);
  addShine(width/2 - 50, height/2 - 50, 100, 100, 80);
  line(width/4, 3*height/4, width/4 + 200, height/4);
  line(width/4, 3*height/4, 0, height/4);
  //set image as background
  let spectrum = fft.analyze();
  stroke(0);

  let n = noise(offset);
  //Make a variable currentColor that starts from colorStart, goes 100 next and then back to  colorstat
  let currentColor = colorStart + (++colorIndex % 100);
  //Loop through the array of spectrum points
  for (let i = 0; i<spectrum.length; i += 20) {
    stroke(20);

    //Map x positions the width with x padding on each side
    let x =  map(i, 0, spectrum.length, padding, width - padding);
    let h = -height + map(spectrum[i], 0, 255, height, 0);

    //fill(n*100 + currentColor, 40, 40, 0);
    
    //Draw a rectangle at each position spanning the screen
    addShine(x + width/2 + 10, height/2, width / spectrum.length * wrect, h/4);
    rect(x + width/2 + 10, height/2, width / spectrum.length * wrect, h/4);
    //addShine(x + width/2 + 10, height/2, width / spectrum.length * wrect, h/4);
    //Make another similar rectangle which is flipped vertically
    rect(x + width/2 + 10, height/2, width / spectrum.length * wrect, -h/4);
    addShine(x + width/2 + 10, height/2, width / spectrum.length * wrect, -h/4);

    stroke(0);
    //fill(n*100 + currentColor, 40, 40, 10);
    //Draw a rectangle at each position spanning the screen
    rect(width/2 - x - 10 - wrect/2, height/2, width / spectrum.length * wrect, h/4);
    addShine(width/2 - x - 10 - wrect/2, height/2, width / spectrum.length * wrect, h/4);
    //Make another similar rectangle which is flipped vertically
    rect(width/2 - x - 10 - wrect/2, height/2, width / spectrum.length * wrect, -h/4);
    //addShine(width/2 - x - 10, height/2, width / spectrum.length * wrect, -h/4);
  }

  offset += 0.025;

  /*
  if (frameCount % 60 == 0) {
    wrect = random(10,16)
    background(200, 20, 20);
    addShine(width/4, height/4, 400, 300, 80);
    circle(width/2, height/2, 100);
    addShine(width/2 - 50, height/2 - 50, 100, 100, 80);
    line(width/4, 3*height/4, width/4 + 200, height/4);
    line(width/4, 3*height/4, 0, height/4);
    newColor();
  }*/
}

function newColor() {
  colorStart = random(255);
}

function addShine(x, y, w, h, maxAlpha = 255) {
  noFill();
  colorMode(RGB);
  for (let i = w/2; i > 0; i--) {
    let inter = map(i, 0, w/2, maxAlpha,0); // Decrease alpha value
    let c = color(255, 255, 255, inter);
    stroke(c);
    line(x + w/2 - i, y + h, x + w/2 - i, y );
    line(x + w/2 + i, y + h, x + w/2 + i, y);
  }
  colorMode(HSB);
}
