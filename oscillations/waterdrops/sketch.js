function setup() {
  createCanvas(300,300);
  frameRate(30);
}

let waterDrops = [];
let gridSize = 5; // Distance between grid points

function draw() {
  //Sea blue background
  background(0, 150, 255);

  let waveAmplitude = 5; // Amplitude of the wave
  let waveFrequency = 0.1; // Frequency of the wave
  let waveSpeed = 0.01; // Speed of the wave movement

  let gridStartY = height / 4;
  let maxDepth = height;
  let maxSize = 4;
  let minSize = 0.5;
  let maxSpacing = 8;
  let minSpacing = 2;

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
      waterDrops.splice(i, 1);
    }
  }
  // Draw the grid and interact with waterdrops
  for (let y = gridStartY; y <= maxDepth + 20; y += lerp(minSpacing, maxSpacing, y/maxDepth)) {
    let pointSize = lerp(minSize, maxSize, y / maxDepth);
    for (let x = 0-50; x <= width + 50; x += lerp(minSpacing, maxSpacing, y / maxDepth)) {
      waveAmplitude = lerp(3, 6, y / maxDepth);
      let waveX = x + sin(frameCount * waveSpeed + y * waveFrequency) * waveAmplitude;
      let waveY = y + sin(frameCount * waveSpeed + x * waveFrequency) * waveAmplitude;

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
        drawPoint(waveX, waveY + y_offset, size);

      } if (waterDrops.length === 0) {
        drawPoint(waveX + y_offset, waveY + y_offset, size);
      }
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
    this.growthRate = random(1, 4);
    this.effectStrength = random(2,5);
    this.lifetime = 0;

    this.fallSpeed = random(1,4); // Speed of the falling drop
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
    console.log("displaying drop");
    let spiralX = this.x + sin(this.angle)*2;
    this.angle += 0.5;
    stroke(255,220,215);
    strokeWeight(random(4,5));
    noFill();
    point(spiralX, this.y);
  }

  isOffScreen() {
    return this.lifetime > 500;
  }
}

function periodic(p) {
  return map(sin(TWO_PI * p), -1, 1, random(4,5), random(7,9));
}

function offsetMiddle(x, y) {
  return dist(x, y, width/2, height/2) / 100;
}

function offsetRandomPoint(x, y) {
  return dist(x, y, random(width), random(height)) / 100;
}

function offsetVar(x,y ,ox,oy) {
  return dist(x,y, ox, oy) / 100;
}

function keyPressed() {
  if (key == 's' || key == 'S') saveGif('radialWave', 5);
}

function glitch() {
  if (frameCount % 10 == 0) {
    //Copy random rectangle from the screen to another part of the canvas
    let x1 = random(width+10);
    let y1 = random(height+10);
    let x2 = random(width)+10;
    let y2 = random(height+10);
    let w = random(10, 50);
    let h = random(10, 50);
    glitches.push({'copy': [x1, y1, x2, y2, w, h], 'frames': random(10,100)});
  }

  //Draw the copied rectangles
  for (let i = glitches.length - 1; i >= 0; i--) {
    let g = glitches[i];
    if (g.frames > 0) {
      copy(g.copy[0], g.copy[1], g.copy[4], g.copy[5], g.copy[2], g.copy[3], g.copy[4], g.copy[5]);
      g.frames--;
    //Remove the rectangle from the array when it's done
    } else {
      glitches.splice(i, 1);
    }
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
