let ellipses = [];
let currentAngle = 0;
let noiseOffset = 0;
let removing = false;

function setup() {
  createCanvas(400, 400);
  noFill();
  colorMode(HSB);
  startNewDonut();
  frameRate(30);
}

function draw() {
  background(30);
  translate(width / 2, height / 2);

  // Calculate wobble effect
  let wobbleX = noise(frameCount * 0.001) * 20 - 10; // Horizontal wobble
  let wobbleY = noise(frameCount * 0.001) * 20 - 10; // Vertical wobble
  let wobbleRotation = noise(frameCount * 0.002) * 5; // Rotation wobble

  // Apply wobble transformation
  translate(wobbleX, wobbleY);
  rotate(wobbleRotation);
  

  let donutRadius = 100; // The overall radius of the donut
  let baseEllipseRadius = 10; // The base radius of each individual ellipse
  let angleStep = 0.02; // The increment in angle for each frame

  if (!removing) {
    if (currentAngle < TWO_PI) {
      let ellipseRadius = baseEllipseRadius + noise(noiseOffset)*40;
      let x = (donutRadius + cos(currentAngle) * ellipseRadius) * cos(currentAngle);
      let y = (donutRadius + cos(currentAngle) * ellipseRadius) * sin(currentAngle);

      // Dynamic color based on angle
      // Dynamic color based on angle within the new hue range
      let colorHue = map(currentAngle, 0, TWO_PI, startHue, endHue);

      ellipses.push({ x: x - ellipseRadius, y: y, radius: ellipseRadius, color: color(colorHue, 100, 60) });
      currentAngle += angleStep;
      noiseOffset += 0.02; // Increment noise offset
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
    ellipse(e.x, e.y, e.radius * 2, e.radius * 2);
  }
}

function startNewDonut() {
  // Reset parameters for a new donut and choose new color range
  currentAngle = 0;
  removing = false;
  ellipses = [];
  startHue = random(360); // Starting hue
  endHue = (startHue + random(60, 180)) % 360; // Ending hue within a range of 60 to 180 degrees from the start hue
}