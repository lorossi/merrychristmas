let santas_number, dragons_number, fires_number;
let img_number = 5;
let santas = [];
let dragons = [];
let fires = [];
let img_palette = [];
let background_palette; // red and green

let jingle_bells, jingle_bells_hardstyle;
let mouse_pressed = false;
let sound_loaded = false;

function preload() {
    soundFormats('mp3');
    jingle_bells = loadSound('assets/jingle_bells.mp3');
    jingle_bells_hardstyle = loadSound('assets/jingle_bells_hardstyle.mp3', fullyLoaded);
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
    dragons_number = 35;
    fires_number = 25;
  } else {
    santas_number = 20;
    dragons_number = 15;
    fires_number = 10;
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

  for (let i = 0; i < dragons_number; i++) {
    let dx, dy, dimg;
    dx = random(width);
    dy = random(height);
    dimg = {
      name: "assets/dragon",
      extension: "png"
    };

    dragons.push(
      new Dragon(dx, dy, dimg)
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

  dragons.forEach((d, i) => {
    d.show();
    d.move();
  });

  fires.forEach((f, i) => {
    f.show();
    f.move();
  });

  for (let i = fires.length - 1; i >= 0; i--) {
    if (!fires[i].alive) {
      fires.splice(i, 1);
    }
  }


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
      this.max_acceleration = 0.25;
      this.max_velocity = 10;
      this.speed = map(this.distance, 0, 10, 5, 1);
      this.max_y = 2 * this.scl;
    } else {
      this.scl = map(this.distance, 0, 10, 0.75, 0.2);
      this.max_force = 2;
      this.max_acceleration = 0.25;
      this.max_velocity = 7;
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

    if (this.position.x - this.image.width * this.scl > width) this.position.x -= width;
    else if (this.position.x + this.image.width * this.scl < 0) this.position.x += width;

    if (fires.length < fires_number && random(1) < .05 && mouse_pressed) {
      let fx, fy, fvel, fdir, fimg, fscl;
      fx = this.position.x,
      fy = this.position.y;
      fvel = this.speed * 5;
      fdir = this.velocity.heading();
      fimg = {
        name: "assets/fire",
        extension: "png"
      };
      fscl = this.scl / 2;

      fires.push(
        new Fire(fx, fy, fvel, fdir, fimg, fscl)
      );
    }
  }

  reset() {
    this.force.mult(0);
    this.acceleration.mult(0);
  }
}

class Fire {
  constructor(x, y, velocity, direction, image_path, scl) {
    this.position = createVector(x, y);
    this.image = loadImage(`${image_path.name}.${image_path.extension}`);
    this.inverted_image = loadImage(`${image_path.name}-inverted.${image_path.extension}`);

    this.scl = scl;
    this.distance = random(10);
    this.direction = direction;
    this.velocity = createVector(velocity, 0).rotate(direction);

    this.alive = true;
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.direction + PI/2);
    imageMode(CENTER);

    if (mouse_pressed) {
      image(this.inverted_image, 0, 0, this.inverted_image.width * this.scl, this.inverted_image.height * this.scl);
    } else {
      image(this.image, 0, 0, this.image.width * this.scl, this.image.height * this.scl);
    }
    pop();
  }

  move() {
    this.position.add(this.velocity);
    if (this.position.x - this.image.width * this.scl > width) this.alive = false;
    else if (this.position.x + this.image.width * this.scl < 0) this.alive = false;

    if (this.position.y - this.image.height * this.scl > height) this.alive = false;
    else if (this.position.y + this.image.height * this.scl < 0) this.alive = false;
  }
}


class Dragon {
  constructor(x, y, image_path) {
    this.position = createVector(x, y);
    this.image = loadImage(`${image_path.name}.${image_path.extension}`);
    this.inverted_image = loadImage(`${image_path.name}-inverted.${image_path.extension}`);

    this.distance = random(10);
    this.period = random(0.25, 1) * 60;
    this.phi = random(1000);

    if (windowWidth > 600) {
      this.scl = map(this.distance, 0, 10, 1, 0.25);
      this.speed = map(this.distance, 0, 10, 15, 4);
    } else {
      this.scl = map(this.distance, 0, 10, 0.75, 0.2);
      this.speed = map(this.distance, 0, 10, 10, 2);
    }

    this.velocity = createVector(this.speed, 0).rotate(this.phi);
  }

  show() {
    if (!mouse_pressed) return
    push();
    translate(this.position.x, this.position.y);
    rotate(this.phi + frameCount * TWO_PI / this.period);
    imageMode(CENTER);
    image(this.inverted_image, 0, 0, this.inverted_image.width * this.scl, this.inverted_image.height * this.scl);
    pop();
  }

  move() {
    if (!mouse_pressed) return
    this.position.add(this.velocity);
    if (this.position.x - this.image.width * this.scl > width) this.position.x -= width;
    else if (this.position.x + this.image.width * this.scl < 0) this.position.x += width;

    if (this.position.y - this.image.height * this.scl > height) this.position.y -= height;
    else if (this.position.y + this.image.height * this.scl < 0) this.position.y += height;
  }
}

function mousePressed() {
  if (!sound_loaded) return;
  mouse_pressed = true;

  jingle_bells.pause();
  jingle_bells_hardstyle.loop();
}

function mouseReleased() {
  if (!sound_loaded) return;
  mouse_pressed = false;

  jingle_bells_hardstyle.pause();
  jingle_bells.loop();
}

function fullyLoaded() {
  sound_loaded = true;
}
