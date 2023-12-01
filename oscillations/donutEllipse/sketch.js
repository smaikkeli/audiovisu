let ellipses = [];
let currentAngle = 0;
let noiseOffset = 0;
let removing = false;

//Donut parameters
let radiusScale = 40;
let noiseIncrement = 0.02;
let angleStep = 0.02;

function setup() {
  createCanvas(500,500);
  noFill();
  colorMode(HSB);
  startNewDonut();
  frameRate(35);
  noLoop(); // Stop the draw loop initially
}

function mousePressed() {
  if (isLooping()) {
    noLoop();
  } else {
    loop();
  }
}

function draw() {
  background(20);
  translate(width / 2, height / 2);

  // Calculate wobble effect
  //let wobbleX = noise(frameCount * 0.01) * 20 - 10; // Horizontal wobble
  //let wobbleY = noise(frameCount * 0.01) * 20 - 10; // Vertical wobble

  // Apply wobble transformation
  //translate(wobbleX, wobbleY);

  let wobbleRotation = noise(frameCount * 0.002) * 5; // Rotation wobble
  rotate(wobbleRotation);
  

  let donutRadius = 100; // The overall radius of the donut
  let baseEllipseRadius = 10; // The base radius of each individual ellipse

  if (!removing) {
    if (currentAngle < TWO_PI) {
       // Interpolate radius for a smooth transition in size
      // Noise for variation
      let noiseValue = noise(noiseOffset) * radiusScale;
      // Sine wave for looping
      let sineValue = (sin(currentAngle * 2) * 0.5 + 0.5);
      // Combine both effects
      let ellipseRadius = baseEllipseRadius + noiseValue * sineValue;

      let x = (donutRadius + cos(currentAngle) * ellipseRadius) * cos(currentAngle);
      let y = (donutRadius + cos(currentAngle) * ellipseRadius) * sin(currentAngle);
      // Dynamic color based on angle
      // Dynamic color based on angle within the new hue range
      let colorHue = map(currentAngle, 0, TWO_PI, startHue, endHue);

      ellipses.push({ x: x - ellipseRadius, y: y, radius: ellipseRadius, color: color(colorHue, 100, 60) });
      currentAngle += angleStep;
      noiseOffset += noiseIncrement; // Increment noise offset
    } else {
      removing = true;
    }
  } else {
    if (ellipses.length > 0) {
      ellipses.shift(); // Remove the first ellipse
    } else {
      startNewDonut();
    }
  }

  for (let e of ellipses) {
    stroke(e.color); // Use the stored color for each ellipse
    //ellipse(e.x, e.y, e.radius * 2, e.radius * 2);
    jitter = random(1, 50);
    distortedEllipse(e.x, e.y, e.radius * 2, e.radius * 2, jitter);

  }

  //Randomly can switch from not removing to removing and vice versa

}

function startNewDonut() {
  // Reset parameters for a new donut and choose new color range
  currentAngle = 0;
  removing = false;
  ellipses = [];

  //Paremeters for the donut
  noiseIncrement = random(0.01, 0.04);
  radiusScale = random(20,100);
  //Choose angle step based on a probability distributrion with high density on lower values and lower density on higher values
  angleStep = random([0.02, 0.02, 0.05, 0.05, 0.08, 0.1, 0.2, 1]);

  strokeWeight(random([0.4, 0.5, 0.6, 1, 2]));
  startHue = random(360); // Starting hue
  endHue = (startHue + random(60, 180)) % 360; // Ending hue within a range of 60 to 180 degrees from the start hue
  noiseOffset = random(1000); // Reset noiseOffset for variety

}

function distortedEllipse(x, y, w, h) {
  push(); // Save current drawing state
  translate(x, y);

  // Simulate hand-drawn effect
  let jitter = 50;
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.1) {
    let jitterX = noise(angle, frameCount * 0.01) * jitter - jitter / 2;
    let jitterY = noise(frameCount * 0.01, angle) * jitter - jitter / 2;
    let sx = cos(angle) * w / 2 + jitterX;
    let sy = sin(angle) * h / 2 + jitterY;
    vertex(sx, sy);
  }
  endShape(CLOSE);

  pop(); // Restore original drawing state
}