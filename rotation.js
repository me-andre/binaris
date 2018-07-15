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

function findGroupCenters(group, sceneWidth) {
  // todo consider optimization of finding Y axis bounds (indices should be enough)
  const coords = group.map((cellIndex) => getCellCoordsFromIndex(cellIndex, sceneWidth));
  const {x: minX} = minBy(coords, ({x}) => x);
  const {x: maxX} = maxBy(coords, ({x}) => x);
  const {y: minY} = minBy(coords, ({y}) => y);
  const {y: maxY} = maxBy(coords, ({y}) => y);
  const x = minX + (maxX - minX) / 2;
  const y = minY + (maxY - minY) / 2;
  const centersX = [];
  const centersY = [];
  const centers = [];
  if (x % 1 === 0) {
    centersX.push(x);
  } else {
    const leftX = Math.floor(x);
    const rightX = Math.ceil(x);
    const leftWeight = count(coords, ({x}) => x === leftX);
    const rightWeight = count(coords, ({x}) => x === rightX);
    if (leftWeight > rightWeight) {
      centersX.push(leftX);
    } else if (rightWeight > leftWeight) {
      centersX.push(rightX);
    } else {
      centersX.push(leftX, rightX);
    }
  }
  if (y % 1 === 0) {
    centersY.push(y);
  } else {
    const topY = Math.floor(y);
    const bottomY = Math.ceil(y);
    const topWeight = count(coords, ({y}) => y === topY);
    const bottomWeight = count(coords, ({y}) => y === bottomY);
    if (topWeight > bottomWeight) {
      centersY.push(topY);
    } else if (bottomWeight > topWeight) {
      centersY.push(bottomY);
    } else {
      centersY.push(topY, bottomY);
    }
  }
  for (const x of centersX) {
    for (const y of centersY) {
      centers.push({x, y});
    }
  }
  return centers;
}

function rotate(group, groupCenter, sceneWidth, rotationMatrix) {
  return group.map((cellIndex) => {
    // consider mapping cellIndices to cellCoords at the toplevel of rotation
    const {x, y} = getCellCoordsFromIndex(cellIndex, sceneWidth);
    const distX = x - groupCenter.x;
    const distY = y - groupCenter.y;
    const newX = groupCenter.x + distY * rotationMatrix.y;
    const newY = groupCenter.y + distX * rotationMatrix.x;
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

function rotateCW(group, groupCenter, sceneWidth) {
  return rotate(group, groupCenter, sceneWidth, rotationMatrix.cw);
}

function rotateCCW(group, groupCenter, sceneWidth) {
  return rotate(group, groupCenter, sceneWidth, rotationMatrix.ccw);
}

module.exports = {
  findGroupCenters,
  rotateCW,
  rotateCCW,
};
