function getCellCoordsFromIndex(cellIndex, sceneWidth) {
  const y = Math.floor(cellIndex / sceneWidth);
  const x = cellIndex % sceneWidth;
  return {x, y};
}

function getCellIndexFromCoords({x, y}, sceneWidth) {
  return y * sceneWidth + x;
}

const fallDirections = {
  1: 1,
  0: -1,
};

const oppositeValues = {
  1: 0,
  0: 1,
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
      const group = cellGroups.find((group) => group.includes(intent.sourceIndex));
      if (group) {
        const hasForbiddenIndent = forbiddenIntents.some(({sourceIndex}) => group.includes(sourceIndex));
        if (hasForbiddenIndent) {
          intent.isPermitted = false;
        }
      }
    }
  });
}


// an intent which target is of same value as its source is forbidden
// unless an intent exists for that target which is
// 1. not forbidden
// 2. its target is not of the same value or
// 3. its target has an intent that satisfies the 3 conditions above
function collideSameValueIntents(intents, scene, sceneWidth) {
  intents.forEach((intent) => {
    if (intent.isPermitted) {
      let targetIndex;
      let targetIntent = intent;

      // todo: optimize by walking the chain backwards and forbidding intents one by one

      do {
        targetIndex = getCellIndexFromCoords(targetIntent.targetCoords, sceneWidth);
        const targetValue = scene[targetIndex];
        const sourceValue = scene[targetIntent.sourceIndex];
        if (targetValue !== sourceValue) {
          return;
        }
      } while (targetIntent = intents.find((intent) => intent.isPermitted && intent.sourceIndex === targetIndex));

      intent.isPermitted = false;
    }
  });
}

function applyIntents(intents, scene, sceneWidth) {
  const indexedIntents = {};
  const conflicts = [];
  let permittedIntents = intents.filter(({isPermitted}) => isPermitted);
  permittedIntents.forEach((intent) => {
    const targetIndex = getCellIndexFromCoords(intent.targetCoords, sceneWidth);
    const conflictingIntents = indexedIntents[targetIndex];
    if (!conflictingIntents) {
      indexedIntents[targetIndex] = [intent];
    } else {
      conflictingIntents.push(intent);
    }
  });
  for (const targetIndex in indexedIntents) {
    if (indexedIntents[targetIndex].length > 1) {
      indexedIntents[targetIndex].forEach((intent) => intent.isPermitted = false);
      conflicts.push(Number(targetIndex));
    }
  }
  const newScene = scene.slice();
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
  return {
    scene: newScene,
    conflicts,
  };
}

module.exports = {
  getCellCoordsFromIndex,
  buildFallIndents,
  forbidOutOfBoundsIntents,
  forbidGroupIntents,
  collideSameValueIntents,
  applyIntents,
};
