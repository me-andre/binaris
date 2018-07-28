const {pickBy} = require('lodash');

const {
  forbidOutOfBoundsIntents,
  forbidGroupIntents,
  collideSameValueIntents,
  applyIntents,
} = require('./shared');

const {
  buildFallIndents,
} = require('./gravity');

module.exports = {
  fallStep,
};

function fallStep(state) {
  const {scene, groups, size} = state;

  const intents = buildFallIndents(scene, size.width);
  forbidOutOfBoundsIntents(intents, size);
  collideSameValueIntents(intents, scene, size.width);
  forbidGroupIntents(intents, groups);
  const {
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

    for (const name in landedFigures) {
      const [memberIndex] = landedFigures[name];
      const value = scene[memberIndex];
      newGroups[value].push(...landedFigures[name]);
      newGroups[name] = [];
    }
  }

  return {
    scene: newScene,
    groups: newGroups,
    conflicts,
  };
}
