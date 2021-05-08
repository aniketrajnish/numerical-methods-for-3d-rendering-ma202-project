let theta = 0.5; //initial angle
let coordinates = []; //array to store the coordinates of the cube
let augMatrix = []; //array of augmented matrices for gaussian elimination
let gaussianMatrix = []; //array of matrices pbtained after gaussian elimination
let a = 150; //size of side
let d = 200; //distance used to add perspective

function setup() {
  //background
  canvas = createCanvas(420, 420);
  canvas.center();
}

//gaussian Elimination to make the lower triangular matrix of the augmented matrix 0
function gaussianElimination(m) {
  temp = m[1][0];
  if (m[0][0] != 0) {
    for (let i = 0; i < 4; i++) {
      m[1][i] = m[1][i] - (temp / m[0][0]) * m[0][i];
    }
  }
  return m;
}

function draw() {
  //background properties
  background(225);
  translate(width / 2, height / 2);
  //changing angle input to degress
  angleMode(DEGREES);

  //loop to write our augmented matrices
  for (let i = 0; i < 8; i++) {
    if (i < 4) {
      augMatrix[i] = [
        [cos(theta + 90 * i), sin(theta + 90 * i), 0, a / 2],
        [cos(theta + 90 * (i + 1)), sin(theta + 90 * (i + 1)), 0, a / 2],
        [0, 0, 1, a / 2],
      ];
    } else {
      augMatrix[i] = [
        [cos(theta + 90 * i), sin(theta + 90 * i), 0, a / 2],
        [cos(theta + 90 * (i + 1)), sin(theta + 90 * (i + 1)), 0, a / 2],
        [0, 0, 1, -a / 2],
      ];
    }

    gaussianMatrix[i] = gaussianElimination(augMatrix[i]);    
  }


  //solving for the coordinates
  for (i = 0; i < 8; i++) {
    z = gaussianMatrix[i][2][3];
    y =
      (gaussianMatrix[i][1][3] - z * gaussianMatrix[i][1][2]) /
      gaussianMatrix[i][1][1];
    x =
      (gaussianMatrix[i][0][3] -
        y * gaussianMatrix[i][0][1] -
        z * gaussianMatrix[i][0][2]) /
      gaussianMatrix[i][0][0];
    coordinates[i] = [x, y, z];
  }

  //drawing the sides
  for (i = 0; i < 4; i++) {
    sides(i, i + 4);
    sides(i + 4, ((i + 1) % 4) + 4);
    sides(i, (i + 1) % 4);
  }

  //drawing the vertices
  stroke(255);
  strokeWeight(10);
  noFill();
  for (i = 0; i < 8; i++) {
    let z = 100 / (d - coordinates[i][0]); //to give perspective
    //projecting the coordinates to 2d and plotting it
    point(coordinates[i][1] * z, coordinates[i][2] * z);
  }

  //changing the angle to rotate
  theta += 1;
}

//function to draw the sides
function sides(i, j) {
  strokeWeight(4);
  stroke(0);
  let z1 = 100 / (d - coordinates[i][0]); //to give perspective
  let z2 = 100 / (d - coordinates[j][0]); //to give perspective
  line(
    coordinates[i][1] * z1,
    coordinates[i][2] * z1,
    coordinates[j][1] * z2,
    coordinates[j][2] * z2
  );
}
