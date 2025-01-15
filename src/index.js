import "./style.css";

let SQUARESPERSIDE = 8;
// let SQUARESIDE = 760 / SQUARESPERSIDE;
let boardContainer = document.querySelector(".rightSide");
let placeKnightBtn = document.querySelector(".placeKnightBtn");
let selectEndBtn = document.querySelector(".selectEndBtn");
let goBtn = document.querySelector(".goBtn");
let clearBtn = document.querySelector(".clearBtn");
let originalCoords = null;
let endCoords = null;
let mode = 0;
let horse = document.createElement("img");
horse.src = "./imgs/knight.svg";
horse.classList.add("horse");

(function createGrid() {
  for (let i = 0; i < SQUARESPERSIDE; i++) {
    for (let j = 0; j < SQUARESPERSIDE; j++) {
      let div = document.createElement("div");
      div.classList.add("square");
      div.dataset.col = j;
      div.dataset.row = i;
      div.dataset.num = i * SQUARESPERSIDE + j;
      boardContainer.appendChild(div);
    }
  }
  let squares = document.querySelectorAll(".square");
  squares.forEach((square, i) => {
    square.style.height = Math.round(760 / SQUARESPERSIDE) + "px";
    square.style.width = Math.round(760 / SQUARESPERSIDE) + "px";
    const row = Math.floor(i / SQUARESPERSIDE);
    const col = i % SQUARESPERSIDE;
    square.style.backgroundColor = (row + col) % 2 === 0 ? "white" : "black";
  });
})();

let squares = document.querySelectorAll(".square");

boardContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("square")) {
    const row = parseInt(e.target.dataset.row, 10);
    const col = parseInt(e.target.dataset.col, 10);
    const num = parseInt(e.target.dataset.num, 10);
    const coords = [row, col];

    switch (mode) {
      case 0:
        break;
      case 1:
        originalCoords = coords;
        squares[num].style.backgroundColor = "gray";
        placeKnightBtn.disabled = true;
        squares[num].append(horse);
        mode = 0;
        break;
      case 2:
        endCoords = coords;
        squares[num].style.backgroundColor = "red";
        selectEndBtn.disabled = true;
        squares[num].innerHTML = `<div class="goal">GOAL</div>`;
        mode = 0;
        break;
    }
  }
});

placeKnightBtn.addEventListener("click", function () {
  mode = 1;
  console.log("Click a square to place the knight");
});

selectEndBtn.addEventListener("click", function () {
  mode = 2;
  console.log("Click a square to set the goal square");
});

goBtn.addEventListener("click", function () {
  if (originalCoords && endCoords) {
    knightTravails(originalCoords, endCoords);
  } else {
    console.log("Please set coordinates");
  }
});

clearBtn.addEventListener("click", function () {
  originalCoords = null;
  endCoords = null;
  mode = 0;
  placeKnightBtn.disabled = false;
  selectEndBtn.disabled = false;
  goBtn.disabled = false;
  resetBoard();
});

function resetBoard() {
  squares.forEach((square, i) => {
    square.innerHTML = "";
    const row = Math.floor(i / SQUARESPERSIDE);
    const col = i % SQUARESPERSIDE;
    square.style.backgroundColor = (row + col) % 2 === 0 ? "white" : "black";
    square.innerHTML = "";
  });
  horse.style.transform = "";
  horse.style.left = "0";
  horse.style.top = "0";
}

function updateUI(coords, index, prevCoords, ans) {
  let targetSquare = coords[0] * SQUARESPERSIDE + coords[1];
  let prevSquare = prevCoords[0] * SQUARESPERSIDE + prevCoords[1];
  console.log(coords);

  squares[prevSquare].querySelector(".horse").remove();
  squares[targetSquare].style.backgroundColor = "gray";
  squares[targetSquare].innerHTML = ` 
  <div class="path">${index}
    <img src="./imgs/knight.svg" class="horse">
  </div>`;

  if (index == ans.length - 1) {
    clearBtn.disabled = false;
  }
}

const knightMoves = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
]; //All valid knight moves

function knightTravails(origin, goal) {
  let queue = [origin];
  const parentMap = new Map([[origin.toString(), null]]);
  let visited = []; //Create a queue starting with the origin node, create a map to keep track of which node leads to which one,
  //  populate with the original node pointing to null, lastly, create an array to keep track of every node you actually visit.

  while (queue.length > 0) {
    let current = queue.shift();
    visited.push(current); // Push current element to keep track of visited node and work with that one for the rest of the loop.
    let movesMade = knightMoves.map(([dx, dy]) => [
      current[0] + dx,
      current[1] + dy,
    ]); // returns an array of all posible 8 coordinates, calculated from current element
    for (let i = 0; i < movesMade.length; i++) {
      if (
        movesMade[i][0] >= 0 &&
        movesMade[i][0] < 8 &&
        movesMade[i][1] >= 0 &&
        movesMade[i][1] < 8
      ) {
        // Makes sure only moves within the size of the board (8x8) make it through. Does not care if it has been visited already yet.
        const valid = (matrix, row) =>
          matrix.some((r) => r.toString() === row.toString()); // Checks if array (currentMove[i]) already exists within arrays keeping track of visited elements.
        if (!valid(visited, movesMade[i]) && !valid(queue, movesMade[i])) {
          // If it has not been queued or already visited..
          if (movesMade[i].toString() === goal.toString()) {
            // If we've reached the goal add last node and print path
            parentMap.set(movesMade[i].toString(), current);
            visited.push(movesMade[i]);
            printAnswer(parentMap, goal);
            return;
          } else {
            //If not but it's still a valid move, keep track of previous move/node and add it to queue
            parentMap.set(movesMade[i].toString(), current);
            queue.push(movesMade[i]);
          }
        }
      }
    }
  }
}

function printAnswer(parentMap, current) {
  let ans = [];
  while (current !== null) {
    ans.unshift(current);
    current = parentMap.get(current.toString());
  }
  console.log(`You made it in ${ans.length - 1} moves! Here's your path:`);
  let prevCoords = ans[0];
  placeKnightBtn.disabled = true;
  selectEndBtn.disabled = true;
  goBtn.disabled = true;
  clearBtn.disabled = true;
  ans.forEach((element, index) => {
    setTimeout(() => {
      updateUI(element, index, prevCoords, ans);
      prevCoords = element;
    }, index * 500);
  });
}
