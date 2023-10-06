let sound;
let fft;
let positions = [];

function preload() {
  sound = loadSound('assets/burials.mp3');
}

function setup() {
  //pixelDensity(10);
  cnv = createCanvas(400, 400);
  p5grain.setup();
  generatePositions(20);
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();
  sound.amp(0.2);
  cnv.mouseClicked(togglePlay);
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function draw() {
  background(120);

  drawBackground();

  let spectrum = fft.analyze();

  let voice = spectrum.slice(40,60);
  voice = voice.concat(voice).concat(voice).concat(voice).concat(voice);

  p5grain.textureOverlay(cnv, {mode: MULTIPLY, animate: {amount: 2, atFrame: 1}});

  
  push();
  strokeWeight(2);
  translate(width/2, height/2);

  fill(50,50,50, 20);
  beginShape();
  drawRadial(voice, 1, 0, 200);
  endShape(CLOSE);

  let bass = spectrum.slice(80, 150);

  //append inverted spectrum2 to spectrum
  bass = bass.concat(bass.reverse());

  fill(200, 200, 200, 40);

  beginShape();
  drawRadial(bass, 2, 4, 100);
  endShape(CLOSE);
  

  fill(204, 0, 0, random(200));
  
  strokeWeight(1);
  beginShape();
  drawRadial(bass, 2, 9, 25);
  endShape(CLOSE);
  pop();
}

function drawBackground() {
  for (let i  = 0; i < 360; i += 1) {
    let angle = i * TWO_PI/360;
    let x = width/2 + width/2 * cos(angle);
    let y = height/2 + height/2 * sin(angle);
    stroke(0,0,0);
    strokeWeight(1);
    line(width/2, height/2, x, y);
  }
}


function drawRadial(spectrum, overlaps = 1, offset = 0, maxAmp = 50) {
  for (let i = 0; i < spectrum.length; i++)  {
    amp = map(spectrum[i], 0, max(spectrum), 0, maxAmp);
    let angle = (i*TWO_PI)/(spectrum.length) * overlaps + offset;
    let x = amp * cos(angle - PI/2)
    let y = amp * sin(angle - PI/2)
    stroke(10);
    vertex(x, y);
  }

}

function generatePositions(n) {
  for (let i = 0; i < n; i++) {
    positions.push(createVector(random(width), random(height)));
  }
}

