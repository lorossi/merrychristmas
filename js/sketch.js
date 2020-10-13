let santas_number;
let img_number = 5;
let santas = [];
let img_palette = [];
let background_palette; // red and green

let jingle_bells, jingle_bells_hardstyle;
let mouse_pressed = false;

function preload() {
    soundFormats('mp3');
    jingle_bells = loadSound('assets/jingle_bells.mp3');
    jingle_bells_hardstyle = loadSound('assets/jingle_bells_hardstyle.mp3');

}

function setup() {
  let canvas = createCanvas(displayWidth, displayHeight);
  canvas.parent('sketch');

  for (let i = 0; i < img_number; i++) {
    img_palette.push(
      {
        'name': `assets/${i+1}`,
        'extension': `png`
      }
    )
  }

  if (windowWidth > 600) {
    santas_number = 50;
  } else {
    santas_number = 25;
  }

  for (let i = 0; i < santas_number; i++) {
    let sx, sy, simg;
    sx = random(width);
    sy = random(height);
    simg = img_palette[Math.floor(random(img_number))];

    santas.push(
      new Santa(sx, sy, simg)
    )
  }

  background_palette = [color("#B3000C"), color("#0cb300")];
}

function draw() {
  let background_color;
  if (!mouse_pressed) {
    background_color = background_palette[0];
  } else {
    background_color = background_palette[Math.floor(frameCount / 8) % 2];
  }
  background(background_color);

  santas.forEach((s, i) => {
    s.show();
    s.move();
  });
}

class Santa {
  constructor(x, y, image_path) {
    this.position = createVector(x, y);
    this.image = loadImage(`${image_path.name}.${image_path.extension}`);
    this.inverted_image = loadImage(`${image_path.name}-inverted.${image_path.extension}`);

    this.distance = random(10);
    this.direction = random(1) > .5 ? -1 : 1;

    this.period = random(2, 5) * 60;
    this.phi = random(1000);

    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.force = createVector(0, 0);
    this.mouse_pos = createVector(0, 0);

    if (windowWidth > 600) {
      this.scl = map(this.distance, 0, 10, 1, 0.25);
      this.max_force = 5;
      this.max_acceleration = 0.5;
      this.max_velocity = 20;
      this.speed = map(this.distance, 0, 10, 5, 1);
      this.max_y = 2 * this.scl;
    } else {
      this.scl = map(this.distance, 0, 10, 0.75, 0.2);
      this.max_force = 5;
      this.max_acceleration = 0.25;
      this.max_velocity = 10;
      this.speed = map(this.distance, 0, 10, 2.5, 0.5);
      this.max_y = this.scl;
    }
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    imageMode(CENTER);

    if (mouse_pressed) {
      let direction = createVector(mouseX, mouseY).sub(this.position).heading();
      rotate(direction + PI/2);
      image(this.inverted_image, 0, 0, this.inverted_image.width * this.scl, this.inverted_image.height * this.scl);
    } else {
      image(this.image, 0, 0, this.image.width * this.scl, this.image.height * this.scl);
    }
    pop();
  }

  move() {
    if (!mouse_pressed) {
      this.position.x += this.speed * this.direction;
      this.position.y += cos(TWO_PI / this.period * frameCount + this.phi) * this.max_y;
    } else {
      this.mouse_pos = createVector(mouseX, mouseY);
      this.force.mult(0);
      this.force = this.mouse_pos.copy().sub(this.position).limit(this.max_force);
      this.acceleration.add(this.force).limit(this.max_acceleration);
      this.velocity.add(this.acceleration).limit(this.max_velocity);
      this.position.add(this.velocity);
    }

    if (this.position.x - this.image.width / 2 * this.scl > width) this.position.x -= width;
    else if (this.position.x + this.image.width / 2 * this.scl < 0) this.position.x += width;
  }

  reset() {
    this.force.mult(0);
    this.acceleration.mult(0);
  }
}


function mousePressed() {
  mouse_pressed = true;
  jingle_bells_hardstyle.loop();
  jingle_bells.pause();
}

function mouseReleased() {
  mouse_pressed = false;
  jingle_bells.loop();
  jingle_bells_hardstyle.pause();
}

function mouseMoved() {

}
