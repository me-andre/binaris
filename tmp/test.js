const {
  getCellCoordsFromIndex,
  buildFallIndents,
  forbidOutOfBoundsIntents,
  forbidGroupIntents,
  collideSameValueIntents,
  applyIntents,
} = require('..');

  const x = 1;
  const _ = 0;

  const scene = [
    _, x,
    _, x,
    _, _,
    _, _,
  ];

  const size = {
    width: 2,
    height: 4,
  };

const groups = [
  [0, 2, 4, 5, 6, 7],
  // [1],
];

console.log(getCellCoordsFromIndex(1, size.width));
console.log(getCellCoordsFromIndex(2, size.width));

console.dir(buildFallIndents(scene, size.width));

const result = [
  {
    sourceIndex: 0,
    targetCoords: {
      x: 0, y: -1,
    },
  },
  {
    sourceIndex: 1,
    targetCoords: {
      x: 1, y: 1,
    },
  },
  {
    sourceIndex: 2,
    targetCoords: {
      x: 0, y: 0,
    },
  },
  {
    sourceIndex: 3,
    targetCoords: {
      x: 1, y: 0,
    },
  },
];

{
  const intents = buildFallIndents(scene, size.width);
  forbidOutOfBoundsIntents(intents, size);
  console.log('forbidOutOfBoundsIntents');
  console.dir(intents.filter(({isPermitted}) => !isPermitted));
}

{
  const intents = buildFallIndents(scene, size.width);
  forbidOutOfBoundsIntents(intents, size);
  forbidGroupIntents(intents, groups);
  console.log('forbidGroupIntents');
  console.dir(intents.filter(({isPermitted}) => !isPermitted));
}

{
  const intents = buildFallIndents(scene, size.width);
  // forbidOutOfBoundsIntents(intents, size);
  // forbidGroupIntents(intents, groups);
  collideSameValueIntents(intents, scene, size.width);
  console.log('collideSameValueIntents');
  console.dir(intents.filter(({isPermitted}) => !isPermitted));
}

{
  const intents = buildFallIndents(scene, size.width);
  forbidOutOfBoundsIntents(intents, size);
  forbidGroupIntents(intents, groups);
  collideSameValueIntents(intents, scene, size.width);
  const {
    scene: newScene,
    conflicts,
  } = applyIntents(intents, scene, size.width);
  console.log('applyIntents');
  console.dir(conflicts, {depth: 3});
  prettyPrintScene(newScene, size);
}

function prettyPrintScene(scene, size) {
  for (let y = 0; y < size.height; y++) {
    const rowStartIndex = y * size.width;
    console.log(...scene.slice(rowStartIndex, rowStartIndex + size.width));
  }
}
