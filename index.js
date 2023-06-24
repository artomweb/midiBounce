// let notes = [1000, 2000, 5000, 8000, 1000, 12000, 14000];
let notes;
let currentNote = 0;
let ndot;
let songStart;
let dotSpeed = 2;
let notesImp;

let song;

let loaded = false;

let lines = [];

let lineStart;
let lineEnd;

async function preload() {
  song = loadSound("debussy-clair-de-lune.mp3");

  await loadFile();

  notes = Object.keys(_.groupBy(notesImp, "time")).map((e) => +e * 1000);
}

async function loadFile() {
  const midi = await Midi.fromUrl("debussy-clair-de-lune.mid");
  console.log(midi.tracks[0]);
  notesImp = midi.tracks[0].notes;
}

function setup() {
  createCanvas(1500, 950);
  ndot = new noteDot(width / 2, height / 2);
}

function draw() {
  background(220);

  if (!loaded) return;

  if (millis() - songStart >= notes[currentNote + 1] - notes[0]) {
    console.log("next note", millis() - songStart);
    currentNote++;
    if (currentNote >= notes.length) {
      currentNote = 0;
    }

    lines.push({ start: ndot.startPos.copy(), end: ndot.pos.copy() });
    ndot.updateVelocity();
  }

  ndot.updatePosition();
  ndot.display();

  strokeWeight(5);

  line(ndot.startPos.x, ndot.startPos.y, ndot.pos.x, ndot.pos.y);
  for (let l of lines) {
    line(l.start.x, l.start.y, l.end.x, l.end.y);
  }
}

function mousePressed() {
  if (loaded) return;
  loaded = true;
  song.play();
  songStart = millis();
}

class noteDot {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.startPos = createVector(x, y);
    this.velocity = createVector();
    this.lastAngle;
    this.updateVelocity();
  }

  updateVelocity() {
    this.startPos = this.pos.copy();
    const previousAngle = this.velocity.heading();
    console.log(int(notes[currentNote + 2] - notes[currentNote + 1]), int(notes[currentNote + 1] - notes[currentNote]));
    // let newAngle;
    // if (parseInt((notes[currentNote + 1] - notes[currentNote]).toPrecision(2)) == parseInt((notes[currentNote] - notes[currentNote - 1]).toPrecision(2))) {
    //   //   newAngle = previousAngle + this.lastAngle;
    //   newAngle = previousAngle + PI / 3;
    //   //   this.lastAngle *= -1;
    // } else {
    // let newAngle = previousAngle + PI / 2;
    // }
    // const newAngle = previousAngle + PI / 3;
    const angleAddition = random(PI / 3, PI / 6);
    const newAngle = random() < 0.5 ? previousAngle + PI + angleAddition : previousAngle + PI - angleAddition;
    // console.log("\nangleAddition", angleAddition);
    console.log("newAngle", newAngle);
    this.velocity = p5.Vector.fromAngle(newAngle).mult(dotSpeed);
  }

  updatePosition() {
    this.pos.add(this.velocity);
  }

  display() {
    push();
    strokeWeight(20);
    point(this.pos.x, this.pos.y);
    pop();
  }
}
