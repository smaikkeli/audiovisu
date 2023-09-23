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
  background(200, 20, 10);

  let spectrum = fft.analyze();
  noStroke();

  let n = noise(offset);
  //Make a variable currentColor that starts from colorStart, goes 100 next and then back to  colorstat
  currentColor = colorStart + (++colorIndex % 100);
  //Loop through the array of spectrum points
  for (let i = 0; i<spectrum.length; i += 25) {

    //Map x positions the width with x padding on each side
    let x =  map(i, 0, spectrum.length, padding, width - padding);
    let h = -height + map(spectrum[i], 0, 255, height, 0);

    fill(n*100 + currentColor, 50, 70)
    //Draw a rectangle at each position spanning the screen
    rect(x, height/2, width / spectrum.length * 10, h/4)
    //Make another similar rectangle which is flipped vertically
    rect(x, height/2, width / spectrum.length * 10, -h/4)
  }

  //granulateFuzzify(10);
  granulateFuzzify(10);

  offset += 0.025;
}


function granulateFuzzify(amount) {
  loadPixels();
  const d = pixelDensity();
  const fuzzyPixels = 2; // pixels
  const modC = 4 * fuzzyPixels; // channels * pixels
  const modW = 4 * width * d;
  const pixelsCount = modW * (height * d);
  for (let i = 0; i < pixelsCount; i += 4) {
      const f = modC + modW;
      // fuzzify
      if (pixels[i+f]) {
          pixels[i] = round((pixels[i] + pixels[i+f])/2);
          pixels[i+1] = round((pixels[i+1] + pixels[i+f+1])/2);
          pixels[i+2] = round((pixels[i+2] + pixels[i+f+2])/2);
          // comment in, if you want to granulate the alpha value
          pixels[i+3] = round((pixels[i+3] + pixels[i+f+3])/2);
      }
      // granulate
      //pixels[i] = pixels[i] + random(-amount, amount);
      //pixels[i+1] = pixels[i+1] + random(-amount, amount);
      //pixels[i+2] = pixels[i+2] + random(-amount, amount);
      // comment in, if you want to granulate the alpha value
      //pixels[i+3] = pixels[i+3] + random(-amount, amount);
}
  updatePixels();
}