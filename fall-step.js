const {
  pickBy,
  mapValues,
} = require('lodash');

const {
  getCellCoordsFromIndex,
  forbidOutOfBoundsIntents,
  forbidGroupIntents,
  collideSameValueIntents,
  applyIntents,
} = require('./shared');

const {
  buildFallIndents,
} = require('./gravity');

const {
  findFilledRows,
  swapRows,
  splitBase,
} = require('./swap-rows');

const {
  fall,
} = require('./drop');

module.exports = {
  fallStep,
};

const {prettyPrintScene} = require('./util');

function fallStep(state) {
  const {scene, groups, size} = state;

  const intents = buildFallIndents(scene, size.width);
  forbidOutOfBoundsIntents(intents, size);
  forbidGroupIntents(intents, groups);
  collideSameValueIntents(intents, scene, size.width);
  forbidGroupIntents(intents, groups);

  let {
    scene: newScene,
    groups: newGroups,
    conflicts,
  } = applyIntents(intents, scene, groups, size.width);

  if (conflicts.length > 0) {
    return {scene, groups, conflicts};
  }

  const landedFigures = pickBy(groups, (cellIndices, groupName) => {
    if (groupName === '0' || groupName === '1') {
      // by this condition we distinguish between the figures and the bases
      // todo perform fall on figures, not on the whole scene
      return false;
    }
    return intents.some(({sourceIndex, isPermitted}) => !isPermitted && cellIndices.includes(sourceIndex));
  });

  const filledRowsByFigure = mapValues(landedFigures, (cellIndices) => {
    const affectedRowIndices = cellIndices.map((cellIndex) => {
      const {y} = getCellCoordsFromIndex(cellIndex, size.width);
      return y;
    });

    return findFilledRows(affectedRowIndices, newScene, size.width);
  });

  for (const groupName in landedFigures) {
    const value = Number(groupName.charAt(groupName.length - 1));
    // a hack goes below:
    // we should land the figures before applying intents because a free figure can fall into a stuck one.
    // we can however work around that trap by detecting that a figure has lost its cell (cell's value changed).
    const cellIndices = landedFigures[groupName].filter((cellIndex) => newScene[cellIndex] === value);
    newGroups[value].push(...cellIndices);
    newGroups[groupName] = [];

    const filledRows = filledRowsByFigure[groupName];
    if (filledRows.length > 0) {
      (
        {
          scene: newScene,
          groups: newGroups,
        } = swapRows(filledRows, newScene, newGroups, size.width)
      );
      const split = splitBase(filledRows, newScene, newGroups, size);
      if (split) {
        newGroups = {
          ...newGroups,
          ...split,
        };
        (
          {
            scene: newScene,
            groups: newGroups,
          } = fall({
            scene: newScene,
            groups: newGroups,
            size,
          }, groupName)
        );
      }
    }
  }

  return {
    scene: newScene,
    groups: newGroups,
    conflicts,
  };
}
