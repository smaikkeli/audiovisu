let shapeSets = [];
let sizeoff = 0.0;
let bassTrigger = true;

function setup() {
  //play the sound if mouse button clicked on the canva
  cnv = createCanvas(400, 400);
  colorMode(RGB);
  frameRate(60);
}



function draw() {
  background(30);
  
  //Randomly make a new wave
  if (random() < 0.5) {
    shapeSets.push(createEllipseWave(random(5,10)));
  }
  
  for (let wave of shapeSets) {
    let waveStroke = random(0,100);
    for (let i = 0; i < wave.length; i++) {
      let e = wave[i];
      stroke(e.color.levels[0], e.color.levels[1], e.color.levels[2], e.a);
      noFill();
      if (e.appearing) {
        if (e.a == 0) {
          e.a += random() < 0.2 ? 1 : 0;
          continue;
        }
        //rect(r.x, r.y, r.size, r.size);
        ellipse(e.x, e.y, e.width, 50);
        //addShine(e.x, e.y, e.size, e.size);

        wave[i].a = wave[i].a  + 10;
        if (wave[i].a >= 255) {
          wave[i].appearing = false;
        }
      } else {
        wave[i].a -= random(5,20); 
        if (wave[i].a < 2 | shapeSets.length > 3) {
          // Remove the rectangle when alpha is very low
          wave.splice(i, 1);// Add the rectangle to be removed
      }
      }
    }
  }
}

// Generates a perlin noise wave of ellipses
// Param int step: x distance in pixels between subsequent ellipses
function createEllipseWave(step) {
  let ellipses = [];

  // Generate a pastel color
  colorMode(HSB, 360, 100, 100); // Switch to HSB mode
  let hueValue = random(360); // Any hue from 0 to 360
  let saturationValue = random(100); // Low to medium saturation for pastel feel
  let brightnessValue = random(30,60); // High brightness for pastel feel
  let waveColor = color(hueValue, saturationValue, brightnessValue);

  colorMode(RGB, 255); // Switch back to RGB mode

  // Go through the wave
  let yoff = random(-height/4, 5*height/4);
  let widthoff = random(0, 1000); // separate offset for width variation
  for (let x = 0; x < width; x += step) {
    // Change the strength of the waves
    yoff += 0.02;
    // Change size of the ellipses
    sizeoff += 0.1;

    widthoff += 10;
    
    // Calculate the new y value
    let y = noise(yoff) * height;
    
    // Calculate the new ellipse size
    let ellipseHeight = noise(sizeoff) * 50;

    let ellipseWidth = noise(widthoff) * 50;
    
    // Push the current ellipse
    ellipses.push({
      x: x,
      y: y,
      width: ellipseWidth,
      height: ellipseHeight,
      a: 0, // Angle for potential future use (e.g., rotation)
      appearing: true,
      color: waveColor
    });
  }
  
  return ellipses;
}

//Generates a perlin noise wave of rectangles
//Param int step: x distance in pixels between subsequent rectangles
function createRectangleWave(step) {
  let rects = [];

  // Generate a pastel color
  colorMode(HSB, 360, 100, 100); // Switch to HSB mode
  let hueValue = random(360); // Any hue from 0 to 360
  let saturationValue = random(100); // Low to medium saturation for pastel feel
  let brightnessValue = random(80,100); // High brightness for pastel feel
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