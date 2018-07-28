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

function fallStep(state) {
  const {scene, groups, size} = state;

  const intents = buildFallIndents(scene, size.width);
  forbidOutOfBoundsIntents(intents, size);
  collideSameValueIntents(intents, scene, size.width);
  forbidGroupIntents(intents, groups);
  let {
    scene: newScene,
    groups: newGroups,
    conflicts,
  } = applyIntents(intents, scene, groups, size.width);

  {
    const landedFigures = pickBy(groups, (cellIndices, groupName) => {
      if (groupName === '0' || groupName === '1') {
        // by this condition we distinguish between the figures and the bases
        // todo perform fall on figures, not on the whole scene
        return false;
      }
      return intents.some(({sourceIndex, isPermitted}) => !isPermitted && cellIndices.includes(sourceIndex));
    });

    const affectedRowIndicesByFigure = mapValues(landedFigures, (cellIndices) => cellIndices.map((cellIndex) => {
      const {y} = getCellCoordsFromIndex(cellIndex, size.width);
      return y;
    }));

    for (const name in landedFigures) {
      const [memberIndex] = landedFigures[name];
      const value = scene[memberIndex];
      newGroups[value].push(...landedFigures[name]);
      newGroups[name] = [];
    }

    for (const groupName in affectedRowIndicesByFigure) {
      const filledRows = findFilledRows(affectedRowIndicesByFigure[groupName], newScene, size.width);
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

  }

  return {
    scene: newScene,
    groups: newGroups,
    conflicts,
  };
}
