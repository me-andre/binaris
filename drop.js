const {
  forbidOutOfBoundsIntents,
  collideSameValueIntents,
  applyIntents,
} = require('./shared');

const {
  buildFallIndentsForGroup,
} = require('./gravity');

const {
  findFilledRows,
  swapRows,
  splitBase,
} = require('./swap-rows');

module.exports = {
  fall,
  drop,
};

function drop({scene, groups, size}, groupName) {
  let lastStepIntents;

  ( {scene, groups, lastStepIntents} = fall({scene, groups, size}, groupName) );

  const affectedRowIndices = lastStepIntents.map(({targetCoords}) => targetCoords.y);

  const filledRows = findFilledRows(affectedRowIndices, scene, size.width);
  if (filledRows.length > 0) {
    ( {scene, groups} = swapRows(filledRows, scene, groups, size.width) );
    const split = splitBase(filledRows, scene, groups, size);
    if (split) {
      groups = {
        ...groups,
        ...split,
      };
      ( {scene, groups} = fall({scene, groups, size}, groupName) );
    }
  }

  return {scene, groups};
}

function fall({scene, groups, size}, groupName) {
  let lastStepIntents;

  while (true) {
    const stepIntents = buildFallIndentsForGroup(scene, groups[groupName], size.width);
    forbidOutOfBoundsIntents(stepIntents, size);
    collideSameValueIntents(stepIntents, scene, size.width);
    const isEveryPermitted = stepIntents.every(({isPermitted}) => isPermitted);
    // we know all the intents belong to the same group
    if (isEveryPermitted) {
      ( {scene, groups} = applyIntents(stepIntents, scene, groups, size.width) );
      lastStepIntents = stepIntents;
    } else {
      const [sampleMemberIndex] = groups[groupName];
      const cellValue = scene[sampleMemberIndex];
      groups[cellValue].push(...groups[groupName]);
      groups[groupName] = [];
      break;
    }
  }

  return {scene, groups, lastStepIntents};
}
