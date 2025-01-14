const knightMoves = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];

function knightTravails(origin, goal) {
  let queue = [origin];
  let hasBeenQueued = [origin];
  let visited = [];
  while (queue.length > 0) {
    let current = queue.shift();
    visited.push(current);
    console.log(`Current item: ${current}`);
    console.log(`Current Visisted nodes:`, visited);
    let movesMade = knightMoves.map(([dx, dy]) => [
      current[0] + dx,
      current[1] + dy,
    ]);
    for (let i = 0; i < movesMade.length; i++) {
      if (
        movesMade[i][0] >= 0 &&
        movesMade[i][0] < 8 &&
        movesMade[i][1] >= 0 &&
        movesMade[i][1] < 8
      ) {
        const beenVisited = (matrix, row) =>
          matrix.some((r) => r.toString() === row.toString());
        const everQueued = (matrix, row) =>
          matrix.some((r) => r.toString() === row.toString());
        if (
          !beenVisited(visited, movesMade[i]) &&
          !everQueued(queue, movesMade[i])
        ) {
          if (movesMade[i].toString() === goal.toString()) {
            visited.push(movesMade[i]);
            console.log(`YAY you did it!`, visited);
            return;
          } else {
            // console.log("queue triggered");
            queue.push(movesMade[i]);
            hasBeenQueued.push(movesMade[i]);
            console.log(`Current Queue:`, queue);
          }
        } else {
          console.log(`Already visited ${movesMade[i]}`);
        }
      }
    }
  }
}
// Si el nodo visitado, ninguno de sus movimientos se puede ejecutar, entonces es eliminado de la lista de visitados
knightTravails([0, 0], [7, 7]);
