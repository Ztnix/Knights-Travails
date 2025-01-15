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
  ans.forEach((element) => console.log(element));
}

knightTravails([0, 0], [7, 7]);
