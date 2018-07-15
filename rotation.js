const { minBy, maxBy } = require('lodash');
const {
  getCellCoordsFromIndex,
} = require('./shared');

const rotationMatrix = {
  cw: {
    x: 1,
    y: -1,
  },
  ccw: {
    x: -1,
    y: 1,
  },
};

function count(array, condition) {
  let i = 0;
  for (const item of array) {
    if (condition(item)) {
      i++;
    }
  }
  return i;
}

function findGroupCenter(group, sceneWidth) {
  // todo consider optimization of finding Y axis bounds (indices should be enough)
  const coords = group.map((cellIndex) => getCellCoordsFromIndex(cellIndex, sceneWidth));
  const {x: minX} = minBy(coords, ({x}) => x);
  const {x: maxX} = maxBy(coords, ({x}) => x);
  const {y: minY} = minBy(coords, ({y}) => y);
  const {y: maxY} = maxBy(coords, ({y}) => y);
  let x = minX + (maxX - minX) / 2;
  let y = minY + (maxY - minY) / 2;
  if (x % 1) {
    const leftX = Math.floor(x);
    const rightX = Math.ceil(x);
    const leftWeight = count(coords, ({x}) => x === leftX);
    const rightWeight = count(coords, ({x}) => x === rightX);
    if (leftWeight > rightWeight) {
      x  = leftX;
    } else if (rightWeight > leftWeight) {
      x = rightX;
    }
  }
  if (y % 1) {
    const topY = Math.floor(y);
    const bottomY = Math.ceil(y);
    const topWeight = count(coords, ({y}) => y === topY);
    const bottomWeight = count(coords, ({y}) => y === bottomY);
    if (topWeight > bottomWeight) {
      y = topY;
    } else if (bottomWeight > topWeight) {
      y = bottomY;
    }
  }
  return {x, y};
}

function rotate(group, sceneWidth, rotationMatrix) {
  const center = findGroupCenter(group, sceneWidth);
  return group.map((cellIndex) => {
    // consider mapping cellIndices to cellCoords at the toplevel of rotation
    const {x, y} = getCellCoordsFromIndex(cellIndex, sceneWidth);
    const distX = x - center.x;
    const distY = y - center.y;
    const newX = center.x + distY * rotationMatrix.y;
    const newY = center.y + distX * rotationMatrix.x;
    return {
      sourceIndex: cellIndex,
      targetCoords: {
        x: newX,
        y: newY,
      },
      isPermitted: true,
    };
  });
}

function rotateCW(group, sceneWidth) {
  return rotate(group, sceneWidth, rotationMatrix.cw);
}

function rotateCCW(group, sceneWidth) {
  return rotate(group, sceneWidth, rotationMatrix.ccw);
}

module.exports = {
  findGroupCenter,
  rotateCW,
  rotateCCW,
};
