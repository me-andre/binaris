const {
  without,
  difference,
} = require('lodash');
const counterValues = require('./counter-values');
const {getCellCoordsFromIndex} = require('./shared');

module.exports = {
  findFilledRows,
  swapRows,
  splitBase,
};

function findFilledRows(rowIndices, scene, sceneWidth) {
  const checkedRows = [];
  const completedRows = [];

  for (const y of rowIndices) {
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

function swapRows(rowIndices, scene, groups, sceneWidth) {
  const newScene = [...scene];
  const newGroups = {...groups};
  const transfers = {0: [], 1: []};
  for (const y of rowIndices) {
    for (let x = 0; x < sceneWidth; x++) {
      const cellIndex = y * sceneWidth + x;
      const cellValue = scene[cellIndex];
      const swappedValue = counterValues[cellValue];
      newScene[cellIndex] = swappedValue;
      transfers[swappedValue].push(cellIndex);
    }
  }
  for (const cellValueString in transfers) {
    const prevValue = counterValues[cellValueString];
    newGroups[cellValueString] = difference(groups[cellValueString], transfers[prevValue]);
    newGroups[cellValueString].push(...transfers[cellValueString]);
  }
  return {
    scene: newScene,
    groups: newGroups,
  };
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
    const base = without(groups[cellValue], ...figure);// diff
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
