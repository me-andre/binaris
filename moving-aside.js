const {
  getCellCoordsFromIndex,
} = require('./shared');

const directionX = {
  left: -1,
  right: 1,
};

module.exports = {
  moveLeft,
  moveRight,
};

function moveAside(group, sceneWidth, direction) {
  return group.map((cellIndex) => {
    const {x, y} = getCellCoordsFromIndex(cellIndex, sceneWidth);
    const targetCoords = {
      x: x + direction,
      y,
    };
    return {
      sourceIndex: cellIndex,
      targetCoords,
      isPermitted: true,
    };
  });
}

function moveLeft(group, sceneWidth) {
  return moveAside(group, sceneWidth, directionX.left);
}

function moveRight(group, sceneWidth) {
  return moveAside(group, sceneWidth, directionX.right);
}
