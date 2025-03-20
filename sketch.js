//   Code name : Conway's Game of Life

//   Background: The Game of Life, also known as Conway's Game of Life or simply Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is orginally a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. However, this code currently has two modes, an initial randomized evolution where the player can affect the evolution by manually adding live cells. The second mode follows the original life game, where the player sets the initial “seed” and waits for it to evolve.

var columns, rows;
var block;

// Smaller the size is, more cells there will be
var cell_size = 10;
var stage;

// Bigger the index is, slower the iteration will be
var iterate_index = 10;
var mode = 1;
var game_begin = false;
var count = 0;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('p5-canvas');
  columns = width / cell_size;
  rows = (height - 100) / cell_size; // UI occupys the last 100 in y-axis
  block = [];
  reset();
}

function draw() {
  background(0);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (block[i][j] == 1) {
        fill(255);
      } else {
        // change from 0 to 36 to make it more visible
        fill(36);
      }
      noStroke();
      rect(i * cell_size, j * cell_size, cell_size, cell_size);
    }
  }
  UI();
  counter();

  if (game_begin && frameCount % iterate_index == 0) {
    iterate();
    count++;
  }

  if (mouseIsPressed && mouseY < height - 100) {
    let i = floor(mouseX / cell_size);
    let j = floor(mouseY / cell_size);
    if (i >= 0 && i < columns && j >= 0 && j < rows) {
      block[i][j] = 1;
    }
  }
}

function UI() {
  fill(50);
  rect(0, height - 100, width, 100);

  draw_button(20, "Ancient References", mode == 1);
  draw_button(180, "Your Laboratory", mode == 2);
  draw_button(340, "▶", game_begin);

  fill(255);
  textAlign(RIGHT, CENTER);
  text("Cells: " + counter(), width - 20, height - 75);
  text("Iterations: " + count, width - 20, height - 50);
}

function draw_button(x, label, pressed) {
  if (pressed) {
    fill(180);
    rect(x, height - 78, 135, 38, 5);
    fill(50);
    textStyle(BOLD);
    
    textAlign(CENTER, CENTER);
    text(label, x + 135 / 2, height - 78 + 38 / 2);
  } else {
    fill(120);
    rect(x, height - 85, 135, 45, 5);
    fill(255);
    textStyle(NORMAL);
    
    textAlign(CENTER, CENTER);
    text(label, x + 135 / 2, height - 85 + 45 / 2);
  }
}


function iterate() {
  let iteration_block = [];
  for (let i = 0; i < columns; i++) {
    iteration_block[i] = [];
    for (let j = 0; j < rows; j++) {
      let sum = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx == 0 && dy == 0) continue;
          let nx = (i + dx + columns) % columns;
          let ny = (j + dy + rows) % rows;
          
          //if (nx >= 0 && nx < columns && ny >= 0 && ny < rows) {
          sum += block[nx][ny];
          //}
        }
      }
      if (block[i][j] == 1) {
        if (sum <= 1 || sum >= 4) {
          iteration_block[i][j] = 0;
        } else {
          iteration_block[i][j] = 1;
        }
      } else {
        if (sum == 3) {
          iteration_block[i][j] = 1;
        } else {
          iteration_block[i][j] = 0;
        }
      }
    }
  }
  block = iteration_block;
}

function mousePressed() {
  if (mouseY >= height - 100) {
    if (mouseX >= 20 && mouseX <= 155) {
      mode = 1;
      game_begin = false;
      reset();
      count = 0;
    } else if (mouseX >= 180 && mouseX <= 315) {
      mode = 2;
      game_begin = false;
      clearBlocks();
      count = 0;
    } else if (!game_begin && mouseX >= 340 && mouseX <= 420) {
      game_begin = true;
    }
  }
}

function keyPressed() {
  if (key === "R" || key === "r") {
    if (mode == 1) {
      reset();
    } else if (mode == 2) {
      clearBlocks();
    }
    game_begin = false; // reset but not start
    count = 0;
  }
}

function counter() {
  let count = 0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      count += block[i][j];
    }
  }
  return count;
}

function reset() {
  for (let i = 0; i < columns; i++) {
    block[i] = [];
    for (let j = 0; j < rows; j++) {
      block[i][j] = floor(random(2));
    }
  }
}

function clearBlocks() {
  for (let i = 0; i < columns; i++) {
    block[i] = [];
    for (let j = 0; j < rows; j++) {
      block[i][j] = 0;
    }
  }
}