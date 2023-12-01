function setup() {
  createCanvas(500,500);
  frameRate(30);
  noLoop(); // Stop the draw loop initially
}

function mousePressed() {
  if (isLooping()) {
    noLoop();
  } else {
    loop();
  }
}

let waterDrops = [];

function draw() {
  //Sea blue background
  background(0, 80, 230);

  let waveAmplitude = 5; // Amplitude of the wave
  let waveFrequency = 0.1; // Frequency of the wave
  let waveSpeed = 0.01; // Speed of the wave movement

  let gridStartY = height / 4;
  let maxDepth = height;
  let maxSize = 7;
  let minSize = 2;
  let maxSpacing = 13;
  let minSpacing = 7;

  //Set really vintage off white stroke color
  stroke(255,220,215);

  // Periodically add a new waterdrop
  if (random(1) < 0.01) {
    waterDrops.push(new WaterDrop(random(width), random(gridStartY,height)));
  }

  // Update and draw waterdrops
  for (let i = waterDrops.length - 1; i >= 0; i--) {
    let drop = waterDrops[i];
    if (drop.falling) {
      drop.displayDrop();
    }
    drop.update();
    if (drop.isOffScreen()) {
      console.log("removing drop");
      waterDrops.splice(i, 1);
    }
  }
  // Draw the grid and interact with waterdrops
  for (let y = gridStartY; y <= maxDepth + 20; y += lerp(minSpacing, maxSpacing, y/maxDepth)) {
    let pointSize = lerp(minSize, maxSize, y / maxDepth);
    for (let x = 0-50; x <= width + 50; x += lerp(minSpacing, maxSpacing, y / maxDepth)) {
      waveAmplitude = lerp(6, 9, y / maxDepth);
      let waveX = x + sin((frameCount * waveSpeed + y * waveFrequency)/1.7) * waveAmplitude;
      let waveY = y + sin((frameCount * waveSpeed + x * waveFrequency)/1.7) * waveAmplitude;

      let size = pointSize;
      let y_offset = 0; // Default offset

      for (let drop of waterDrops) {
        if (!drop.falling) {
          // When the drop is in the wave phase
          let d = dist(x, y, drop.x, drop.y);

          let effect = drop.radius - abs(drop.radius - d)*drop.effectStrength;
          y_offset = max(y_offset, effect*0.03);
          //choose max size from all drops
          size = max(size, map(effect, 0, drop.radius, pointSize, pointSize*1.7, true));
        }
      } if (waterDrops.length === 0) {
        drawPoint(waveX + y_offset, waveY + y_offset, size);
      }
      drawPoint(waveX, waveY - y_offset, size);
    }
  }
}

function drawPoint(x, y, size) {
  stroke(255,248,220); // Gray color
  strokeWeight(size);
  point(x, y);
}

class WaterDrop {
  constructor(x, targetY) {
    this.x = x;
    this.y = 0; // Start at the top of the screen
    this.targetY = targetY;
    this.radius = 0;
    this.falling = true; // Initial state is falling
    this.growthRate = random(3,6);
    this.effectStrength = random(3,5);
    this.lifetime = 0;

    this.fallSpeed = random(2,4); // Speed of the falling drop
    this.angle = 0;
  }

  update() {
    if (this.falling) {
      // Handle the falling phase
      this.y += this.fallSpeed;
      if (this.y >= this.targetY) {
        // Start the wave phase when the drop reaches the target y
        this.falling = false;
      }
    } else {
      // Handle the wave phase
      this.radius += this.growthRate;
      this.lifetime++;
    }
  }

  displayDrop() {
    let spiralX = this.x + sin(this.angle)*2;
    this.angle += 0.5;
    stroke(255,220,215);
    strokeWeight(random(4,5));
    noFill();
    point(spiralX, this.y);
  }

  isOffScreen() {
    return this.lifetime > 300;
  }
}



//Best functions for size:
/*
periodic(t - offsetMiddle(x, y))*sin(dist(x, y, width/2, height/2))
cos(dist(x, y, width/2, height/2));
periodic(t - (offsetVar(x, sin(y), width/4, height/4)))*periodic(t - (offsetVar(x, y, width - width/4, height - height/4)));
*/

//TODO:
// - Make it generative, find good constraints for each variable
