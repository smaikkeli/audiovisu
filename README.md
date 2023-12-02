**WARNING: when playing the sketches, remember to pause before continuing or else your computer might get really slow**

**The animations may not work on mobile**

# Final Assignment: oscillations

## Introduction

"Oscillations" is a creative coding project, which is an exploration of oscillations and periodic movement through mathematics and programming. The aim of the project is to visualize oscillating movement; movement that repeats itself, in an aesthetically pleasing way. The works explore the notion of distance and trigonometry through a function of time. It consists of 4 personally chosen sketches that I have made during the course. They are continuous animations, and exhibit generative art elements and randomness in different ways; using perlin noise to provide continuous change over time, or just changing parameters to produce new patterns, adding a surprise element to each iteration. I decided to only vary a subset of possible changeable variables in order to ensure a certain level of visual appeal.

Each of the sketches are made in p5.js, a creative coding Javascript library, which provides handy functions for drawing shapes and an animation loop. The github repository contains all rest of my sketches, and the easiest way is to run them is by using Visual Studio Code, Live Server Extension, and "going live" at the root directory of the p5.js project.

[How to run each sketch from the repo](https://github.com/processing/p5.js/wiki/Local-server)

This project also serves as my introduction to creative coding. I had basically no experience with p5.js before, and have only reproduced some sketches from youtube tutorials. However, I am experienced in programming, having just completed my computer science bachelors and now pursuing machine learning here in Aalto, I was able to immediately jump into programming. I am really blessed being able to take part in this course, and am definitely continuing creative coding on my freetime.

# The works

For each of the works, I will explain the main programming concepts and provide short code snippets in addition to the sketch itself. You can play the sketches by pressing left click on the canvas.

### Sinusoid

<iframe src = "./oscillations/sinusoid/index.html" width = 505 height = 505></iframe>

To get a new pattern, refresh the page

The first work "sinusoid" is a generative oscillating animation. The sketch consists from a grid of points drawn evenly on the screen. These points vary their sizes based on the distance from the screen over a function of time. This creates a moving animation, where the waves move outwards from the middle point. In addition, the distance calculation is altered by including trigonometric functions over the position of the points, such as cos() and sin(). The functions below are used to calculate the size of each point.

```javascript
function periodic(p) {
  return map(sin(TWO_PI * p), -1, 1, random(10,12), random(20,22));
}

function offsetMiddle(x, y) {
  return dist(x, y, width/2, height/2) / 100;
}

let t = frameCount;
let size = periodic(t - (offsetMiddle(x, y)))*sin(dist(x, y, width/2, height/2));
```

Choosing a different number of points results in a different animation. The beauty behind this sketch is its "simplicity" (depends on who you ask), and how one can easily test different ways of calculating the distance to achieve totally different animations. Furthermore, there is a "glitch" effect which copies rectangles of the canvas to other places, creating the illusion.

### Hearbeat

<iframe src = "./oscillations/heartbeat/index.html" width = "505" height = "505"></iframe>

The heartbeat consists of three pulsing hearts on a grid of points. The hearts are drawn by a parametric equation, which changes magnitude over time. The grid points change their color and size as they get closer to these hearts. The distance to the nearest heart can be calculated by finding the nearest point over all the computed heart points. Below are the main functions to achieve this:

```javascript
//Calculate the points of a heart shape using the parametric equation
function computeHeartPoints(scale) {
  let points = [];
  for (let t = 0; t < TWO_PI; t += RESOLUTION) {
    let x = 16 * pow(sin(t), 3) * scale;
    let y = -(13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4*t)) * scale;
    points.push(createVector(x, y));
  }
  return points;
}

//Find the nearest point that lies on a heart shape
function distanceToNearestHeart(x, y, allHeartPoints) {
  let minDist = Infinity;
  for (let heartPoints of allHeartPoints) {
    for (let pt of heartPoints) {
      let d = dist(x, y, pt.x, pt.y);
      if (d < minDist) {
        minDist = d;
      }
    }
  }
  return minDist;
}  
```

### Slinky donut

<iframe src = "./oscillations/donutEllipse/index.html" width = "505px" height = "505px"></iframe>

Slinky donut is a continuously generating distorted ellipse of distorted ellipses, which looks like a slinky, or a donut as my friend said (a rare iteration). It could be a nice screensaver. It basically calculates a radial angle over varying step size, and draws an ellipse which width is determined by perlin noise, to create a continuously changing radial shape. Each time the donut finishes a revolution, it backtracks itself, and generates a new one with semi-randomly chosen parameters. The distortion effect on single ellipses is achieved by drawing the ellipse with individual vertices, that have a perlin noise distortion offset. Below is the code for calculating a single ellipse in the ring:

```javascript
let noiseValue = noise(noiseOffset) * radiusScale;
// Sine wave for looping
let sineValue = (sin(currentAngle * 2) * 0.5 + 0.5);
// Combine both effects
let ellipseRadius = baseEllipseRadius + noiseValue * sineValue;

//Calculate x and y
let x = (donutRadius + cos(currentAngle) * ellipseRadius) * cos(currentAngle);
let y = (donutRadius + cos(currentAngle) * ellipseRadius) * sin(currentAngle);

// Dynamic color based on angle within the new hue range
let colorHue = map(currentAngle, 0, TWO_PI, startHue, endHue);

ellipses.push({ x: x - ellipseRadius, y: y, radius: ellipseRadius, color: color(colorHue, 100, 60) });
currentAngle += angleStep;  //Angle for next ellipse
noiseOffset += noiseIncrement; // Increment noise offset
```

### Waterdrops

<iframe src = "./oscillations/waterdrops/index.html" width = "505px" height = "505px"></iframe>

Watedrops depicts a drizzly sea, where each drop of water spreads a wave on the sea surface. There are multiple levels of trigonometry here, starting from the waving grid, to combined waves by each of the waterdrops. The grid is tilted and scaled to create perspective, as if a human was watching it. Each drop is their own class object. The drops wall randomly, but not too frequently to crash my computer. This sketch serves as my final work for the course, and presents most of the previously learned skills. Unlike the previous sketches, this idea was not inspired by some other work, but full OC. Below is the code for waterdrop class.

```javascript
class WaterDrop {
  constructor(x, targetY) {
    this.x = x;
    this.y = 0; // Start at the top of the screen
    this.targetY = targetY;
    this.radius = 0;
    this.falling = true; // Initial state is falling
    this.growthRate = random(1,4);
    this.effectStrength = random(1,3);
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
```

# Self reflection

This course has been a welcomed breath of fresh air. Creating generative art is for me, a completely new perspective on coding, and has helped me clarify a many athematical and algorithmic concepts, but also pursue my artistic skills. I have tried to get myself doing creative coding multiple times before, but have not just been able to. This course forced me to learn concepts and actually make the code myself, instead of looking at other peoples works on instagram and thinking "yeah I know how to do that".

Due to my previous knowledge on data structures, algorithms, and programming paradigms, I was able to immediately jump into making the sketches. I also found ChatGPT to be really good in helping me get started with a lot of the projects, and teaching how to calculate distance a set of points laying on a parametric equation.

Check out rest of the sketches I did on the github page.

