const {find, mapValues, pull} = require('lodash');
const oppositeValues = require('./counter-values');

function getCellCoordsFromIndex(cellIndex, sceneWidth) {
  const y = Math.floor(cellIndex / sceneWidth);
  const x = cellIndex % sceneWidth;
  return {x, y};
}

function getCellIndexFromCoords({x, y}, sceneWidth) {
  return y * sceneWidth + x;
}

// better name, not forbit or permit, something like control, filter or validate
function forbidOutOfBoundsIntents(intents, {width, height}) {
  // consider immutability
  intents.forEach((intent) => {
    const {x, y} = intent.targetCoords;
    if (x < 0 || x >= width || y < 0 || y >= height) {
      intent.isPermitted = false;
    }
  });
}

function forbidGroupIntents(intents, cellGroups) {
  const forbiddenIntents = intents.filter(({isPermitted}) => !isPermitted);

  intents.forEach((intent) => {
    if (intent.isPermitted) {
      const group = find(cellGroups, (group) => group.includes(intent.sourceIndex));
      if (group) {
        const hasForbiddenIndent = forbiddenIntents.some(({sourceIndex}) => group.includes(sourceIndex));
        if (hasForbiddenIndent) {
          intent.isPermitted = false;
        }
      }
    }
  });
}

// an intent which target cell is of same value as its source is forbidden
// unless an intent exists which source is that target cell.
// that intent must satisfy 3 conditions below:
// 1. it's not forbidden
// 2. its target is not of the same value or
// 3. its target has an intent that satisfies the 3 conditions above
function collideSameValueIntents(intents, scene, sceneWidth) {
  intents.forEach((intent) => {
    if (intent.isPermitted) {
      let targetIndex;
      let targetIntent = intent;

      // todo: optimize by walking the chain backwards and forbidding intents one by one

      while (true) {
        targetIndex = getCellIndexFromCoords(targetIntent.targetCoords, sceneWidth);
        const targetValue = scene[targetIndex];
        const sourceValue = scene[targetIntent.sourceIndex];
        if (targetValue !== sourceValue) {
          return;
        }
        targetIntent = intents.find((intent) => intent.isPermitted && intent.sourceIndex === targetIndex);
        if (!targetIntent || !targetIntent.isPermitted) {
          intent.isPermitted = false;
          return;
        }
        if (intent.sourceIndex === targetIntent.sourceIndex) {
          // circular movement
          return;
        }
      }
    }
  });
}

function applyIntents(intents, scene, groups, sceneWidth) {
  const intentsIndexedByTarget = {};
  const conflicts = [];
  let permittedIntents = intents.filter(({isPermitted}) => isPermitted);
  permittedIntents.forEach((intent) => {
    const targetIndex = getCellIndexFromCoords(intent.targetCoords, sceneWidth);
    const conflictingIntents = intentsIndexedByTarget[targetIndex];
    if (!conflictingIntents) {
      intentsIndexedByTarget[targetIndex] = [intent];
    } else {
      conflictingIntents.push(intent);
    }
  });
  for (const targetIndex in intentsIndexedByTarget) {
    if (intentsIndexedByTarget[targetIndex].length > 1) {
      intentsIndexedByTarget[targetIndex].forEach((intent) => intent.isPermitted = false);
      conflicts.push(Number(targetIndex));
    }
  }
  const newScene = [...scene];
  permittedIntents = intents.filter(({isPermitted}) => isPermitted);
  permittedIntents.forEach((intent) => {
    const cellValue = scene[intent.sourceIndex];
    newScene[intent.sourceIndex] = oppositeValues[cellValue];
  });
  permittedIntents.forEach((intent) => {
    const cellValue = scene[intent.sourceIndex];
    const targetIndex = getCellIndexFromCoords(intent.targetCoords, sceneWidth);
    newScene[targetIndex] = cellValue;
  });

  // todo: shitty code goes below
  const newGroups = mapValues(groups, (cells) => cells.map((cellIndex) => {
    // todo we already do this: forbidGroupIntents finds unmovable groups
    const intent = permittedIntents.find(({sourceIndex}) => sourceIndex === cellIndex);
    return intent ? getCellIndexFromCoords(intent.targetCoords, sceneWidth) : cellIndex;
  }));
  permittedIntents.forEach((intent) => {
    const cellValue = scene[intent.sourceIndex];
    const counterValue = oppositeValues[cellValue];
    if (newGroups[counterValue]) {
      newGroups[counterValue].push(intent.sourceIndex);
    }
  });
  permittedIntents.forEach((intent) => {
    const targetIndex = getCellIndexFromCoords(intent.targetCoords, sceneWidth);
    for (const cellValue in oppositeValues) {
      pull(newGroups[cellValue], targetIndex);
    }
  });
  // eof shitty code

  return {
    scene: newScene,
    groups: newGroups,
    conflicts,
  };
}

module.exports = {
  getCellCoordsFromIndex,
  getCellIndexFromCoords,
  forbidOutOfBoundsIntents,
  forbidGroupIntents,
  collideSameValueIntents,
  applyIntents,
};
