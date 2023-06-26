// let notes = [1000, 2000, 5000, 8000, 1000, 12000, 14000];
let notes;
let currentNote = 0;
let ndot;
let songStart;
let dotSpeed = 2;
let notesImp;

let song;

let playing = false;

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
  createCanvas(2500, 950);
  ndot = new noteDot(width / 2, height / 2);
}

function draw() {
  background(220);

  if (!playing) return;

  if (millis() - songStart >= notes[currentNote + 1] - notes[0]) {
    // console.log("next note", millis() - songStart);
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
  if (playing || !song.isLoaded()) return;
  playing = true;
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
    this.lastAddition = 0;
  }

  updateVelocity() {
    this.startPos = this.pos.copy();
    const previousAngle = this.velocity.heading();
    // console.log(int(notes[currentNote + 2] - notes[currentNote + 1]), int(notes[currentNote + 1] - notes[currentNote]));

    const angleAddition = PI / 6;
    let newAngle;
    let thisAddition = 0;
    // if (!this.lastAddition) {
    //   thisAddition = -PI;
    //   newAngle = thisAddition;
    // } else {
    //   if (int(notes[currentNote - 2] - notes[currentNote - 3]) - int(notes[currentNote - 1] - notes[currentNote - 2]) > 50) {
    //     console.log(
    //       "Note of same length,",
    //       int(notes[currentNote - 2] - notes[currentNote - 3]) - int(notes[currentNote - 1] - notes[currentNote - 2])
    //     );
    //     thisAddition = this.lastAddition;
    //     newAngle = previousAngle + PI + this.lastAddition;
    //   } else {
    //     // thisAddition = this.lastAddition * -1;
    //   }
    // }
    if (currentNote == 0) {
      newAngle = PI;
      thisAddition = PI;
    } else if (currentNote == 1) {
      let undoLastAngle = previousAngle - this.lastAddition;
      thisAddition = random() < 0.5 ? (5 * PI) / 6 : -(5 * PI) / 6;
      newAngle = undoLastAngle + thisAddition;
    } else {
      let undoLastAngle = previousAngle - this.lastAddition;
      if (random() < 0.5) {
        thisAddition = this.lastAddition;
      } else {
        thisAddition = this.lastAddition * -1;
      }
      console.log("set to", thisAddition);
      // let thisAddition = random() < 0.5 ? (5 * PI) / 6 : -(5 * PI) / 6;
      // console.log(thisAddition);
      // newAngle = previousAngle + (5 * PI) / 6;
      newAngle = previousAngle + thisAddition;
    }
    this.lastAddition = thisAddition;
    console.log(thisAddition, this.lastAddition);
    // const angleAddition = PI/2
    // const newAngle = previousAngle + angleAddition;
    // console.log("\nangleAddition", angleAddition);
    // console.log("newAngle", newAngle);
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
