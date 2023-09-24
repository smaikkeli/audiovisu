let offset = 0;
let colorStart = 0;
let colorPalette = 0;
let currentColor = 0;
let barWidth = 0;
let padding = 80;

function preload() {
  sound = loadSound('assets/brkdp.mp3')
}

function setup() {
  let cnv = createCanvas(400, 400);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(0.3);
  colorMode(HSB);
  colorStart = random(360)
  barWidth = random(1,5);
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}



let colorIndex = 0;
function draw() {
  background(200, 30, 20);

  let spectrum = fft.analyze();
  noStroke();

  let n = noise(offset);
  //Make a variable currentColor that starts from colorStart, goes 100 next and then back to  colorstat
  currentColor = colorStart + (++colorIndex % 100);
  //Loop through the array of spectrum points
  for (let i = 0; i<spectrum.length; i += 15) {

    //Map x positions the width with x padding on each side
    let x =  map(i, 0, spectrum.length, padding, width - padding);
    let h = -height + map(spectrum[i], 0, 255, height, 0);

    fill(n*100 + currentColor, 70, 80)
    //Draw a rectangle at each position spanning the screen
    rect(x, height/2, width / spectrum.length * 5, h/4)
    //Make another similar rectangle which is flipped vertically
    rect(x, height/2, width / spectrum.length * 5, -h/4)
  }

  //granulateFuzzify(10);
  filter(DILATE);
  offset += 0.025;
}
