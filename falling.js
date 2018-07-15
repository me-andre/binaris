const {
  getCellCoordsFromIndex,
} = require('./shared');

const fallDirections = {
  1: 1,
  0: -1,
};

module.exports = {
  buildFallIndents,
};

function buildFallIndents(scene, sceneWidth) {
  return scene.map((cellValue, cellIndex) => {
    const fallDirection = fallDirections[cellValue];
    // consider building 2 change intents instead of 1 movement intent
    const sourceCoords = getCellCoordsFromIndex(cellIndex, sceneWidth); // maybe destruct
    const targetCoords = {
      x: sourceCoords.x,
      y: sourceCoords.y + fallDirection,
    };
    return {
      sourceIndex: cellIndex,
      // sourceCoords,
      targetCoords,
      isPermitted: true,
    };
  });
}
