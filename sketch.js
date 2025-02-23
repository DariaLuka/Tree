let paths = [];
let txtIndex = 0;
let txt = "Bo na starość różnie bywa. Śmierć zaglądnie w oczy, to wtedy i magister człowiek, i inżynier człowiek. Wtedy z życia niby z drzewa jesienią wszystkie liście opadną i jak goły pień człowiek zostaje. Wtedy już nie w świat go ciągnie, ale z powrotem do tej ziemi, gdzie urodził się, z której wyrósł, bo to jedyna jego ziemia na tym świecie. I nawet grób w tej ziemi jakby domem mu był.";
let cols = 10;
let rows = 10;
let cellWidth, cellHeight;
let coverage;
let randomizer;
let f = 0;
let timer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellWidth = width / cols;
  cellHeight = height / rows;
  background(0);
  ellipseMode(CENTER);
  noStroke();
  
  paths.push(new Pathfinder());
  coverage = Array.from({ length: cols }, () => Array(rows).fill(0));
  randomizer = random(0.1, 1.5);
}

function draw() {
  if (frameCount < 300 || (!mouseIsPressed && timer > 100)) {
    fill(0, 4);
    rect(0, 0, width, height);
  }
  
  if (mouseIsPressed) {
    timer = 0;
  }
  
  if (frameCount > 200 && !mouseIsPressed) {
    timer++;
  }
  
  fill(255);
  let unfinishedPaths = [];
  
  for (let i = 0; i < paths.length; i++) {
    let currentPath = paths[i];
    let loc = currentPath.location;
    let diam = currentPath.diameter;
    ellipse(loc.x, loc.y, diam, diam);
    currentPath.update();
    
    if (!currentPath.isFinished) {
      unfinishedPaths.push(currentPath);
    }
  }
  paths = unfinishedPaths;
}

function mousePressed() {
  paths = [new Pathfinder()];
  coverage = Array.from({ length: cols }, () => Array(rows).fill(0));
}

class Pathfinder {
  constructor(parent) {
    if (parent) {
      this.location = createVector(parent.location.x, parent.location.y);
      this.velocity = createVector(parent.velocity.x, parent.velocity.y);
      let area = PI * sq(parent.diameter / 2);
      let newDiam = sqrt(area / 2 / PI) * 2;
      this.diameter = newDiam;
      parent.diameter = newDiam;
    } else {
      this.location = createVector(width / 2, height);
      this.velocity = createVector(0, -1);
      this.diameter = 32;
    }
    this.isFinished = false;
    this.size = 2;
    this.randomizer_2 = random(0.01, 0.2);
    this.letterDrawn = false;
    this.eFill = 255;
  }

  update() {
    if (this.diameter > randomizer && !this.isFinished) {
      if (!mouseIsPressed) {
        this.velocity.lerp(createVector(0, 0), 0.05);
      } else {
        let bump = createVector(random(-1, 1), random(-1, 1)).mult(0.1);
        this.velocity.add(bump).normalize();
      }
      this.location.add(this.velocity);
      if (random() < 0.01) {
        paths.push(new Pathfinder(this));
      }
      if (this.location.x <= 20 || this.location.x >= width - 20) {
        this.velocity.x *= -0.1;
        this.velocity.y *= -0.2;
      }
    }
    if (this.diameter < randomizer) {
      this.isFinished = true;
    }
    if (!mouseIsPressed) {
      this.eFill--;
    }
    if (this.isFinished) {
      fill(255, this.eFill);
      ellipse(this.location.x, this.location.y, this.size, this.size);
      if (!this.letterDrawn) {
        this.drawRandomLetter();
        this.letterDrawn = true;
      }
    }
  }

  drawRandomLetter() {
    let index = int(random(txt.length));
    let letter = txt.charAt(index);
    let offset = random(-10, 10);
    textSize(this.size * 10);
    text(letter, this.location.x + offset, this.location.y + offset);
  }
}
