const {without} = require('lodash');
const counterValues = require('./counter-values');
const {getCellCoordsFromIndex} = require('./shared');

module.exports = {
  findFilledRows,
  swapRows,
  splitBase,
};

function findFilledRows(intents, scene, sceneWidth) {
  const checkedRows = [];
  const completedRows = [];

  for (const {targetCoords: {y}} of intents) {
    if (checkedRows.includes(y)) {
      continue;
    }
    let allSameValue = true;
    const sampleCellValue = scene[y * sceneWidth];
    for (let x = 1; x < sceneWidth; x++) {
      const cellIndex = y * sceneWidth + x;
      const cellValue = scene[cellIndex];
      if (cellValue !== sampleCellValue) {
        allSameValue = false;
        break;
      }
    }
    checkedRows.push(y);
    if (allSameValue) {
      completedRows.push(y);
    }
  }

  return completedRows;
}

function swapRows(rowIndices, scene, sceneWidth) {
  const newScene = scene.slice();
  for (const y of rowIndices) {
    for (let x = 0; x < sceneWidth; x++) {
      const cellIndex = y * sceneWidth + x;
      const cellValue = scene[cellIndex];
      newScene[cellIndex] = counterValues[cellValue];
    }
  }
  return newScene;
}

function splitBase(gapRowIndices, scene, groups, {width, height}) {
  const sampleCellIndex = gapRowIndices[0] * width;
  const cellValue = counterValues[scene[sampleCellIndex]];
  if (cellValue === 1) {
    const edgeRowIndex = Math.min(...gapRowIndices);
    if (edgeRowIndex < 0) {
      return null;
    }
    const figure = groups[cellValue].filter((cellIndex) => {
      const {y} = getCellCoordsFromIndex(cellIndex, width);
      return y < edgeRowIndex;
    });
    const base = without(groups[cellValue], ...figure);
    return {
      figure1: figure,
      1: base,
    };
  }
  if (cellValue === 0) {
    const edgeRowIndex = Math.max(...gapRowIndices);
    if (edgeRowIndex >= height) {
      return null;
    }
    const figure = groups[cellValue].filter((cellIndex) => {
      const {y} = getCellCoordsFromIndex(cellIndex, width);
      return y > edgeRowIndex;
    });
    const base = without(groups[cellValue], ...figure);
    return {
      figure0: figure,
      0: base,
    };
  }
}
