const {expect} = require('chai');

const {
  getCellCoordsFromIndex,
  forbidOutOfBoundsIntents,
  forbidGroupIntents,
  collideSameValueIntents,
  applyIntents,
} = require('../shared');

const {
  buildFallIndents,
} = require('../falling');

const {
  findGroupCenter,
  rotateCW,
  rotateCCW,
} = require('../rotation');

// const {prettyPrintScene} = require('../util');

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

describe('falling', () => {
  it('can find {x, y} coordinates of a cell by its index', () => {
    expect(getCellCoordsFromIndex(1, size.width)).to.eql({x: 1, y: 0});
    expect(getCellCoordsFromIndex(2, size.width)).to.eql({x: 0, y: 1});
  });

  it('can build a "fall" intent for each cell', () => {
    expect(buildFallIndents(scene, size.width)).to.eql([
      {
        sourceIndex: 0,
        targetCoords: {
          x: 0, y: -1,
        },
        isPermitted: true,
      },
      {
        sourceIndex: 1,
        targetCoords: {
          x: 1, y: 1,
        },
        isPermitted: true,
      },
      {
        sourceIndex: 2,
        targetCoords: {
          x: 0, y: 0,
        },
        isPermitted: true,
      },
      {
        sourceIndex: 3,
        targetCoords: {
          x: 1, y: 2,
        },
        isPermitted: true,
      },
      {
        sourceIndex: 4,
        targetCoords: {
          x: 0, y: 1,
        },
        isPermitted: true,
      },
      {
        sourceIndex: 5,
        targetCoords: {
          x: 1, y: 1,
        },
        isPermitted: true,
      },
      {
        sourceIndex: 6,
        targetCoords: {
          x: 0, y: 2,
        },
        isPermitted: true,
      },
      {
        sourceIndex: 7,
        targetCoords: {
          x: 1, y: 2,
        },
        isPermitted: true,
      },
    ]);
  });

  it("if the group has a cell that can't move, no other cell of that group can", () => {
    const intents = buildFallIndents(scene, size.width);
    forbidOutOfBoundsIntents(intents, size);
    forbidGroupIntents(intents, groups);
    const forbidden = intents.filter(({isPermitted}) => !isPermitted);
    expect(forbidden.map(({sourceIndex}) => sourceIndex)).to.eql([0, 2, 4, 5, 6, 7]);
  });

  it('forbids a cell from falling into another cell of same value', () => {
    const intents = buildFallIndents(scene, size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    const forbidden = intents.filter(({isPermitted}) => !isPermitted);
    expect(forbidden.map(({sourceIndex}) => sourceIndex)).to.eql([0, 2, 4, 6]);
  });

  it('applies intents to a scene', () => {
    const intents = buildFallIndents(scene, size.width);
    forbidOutOfBoundsIntents(intents, size);
    forbidGroupIntents(intents, groups);
    collideSameValueIntents(intents, scene, size.width);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, size.width);

    expect(newScene).to.eql([
      _, _,
      _, x,
      _, x,
      _, _,
    ])
  });

  it('detects conflicting intents', () => {
    const scene = [
      _, x,
      _, x,
      _, _,
      _, _,
    ];

    const groups = [
      [0, 2, 4, 6],
      // [1],
    ];

    const intents = buildFallIndents(scene, size.width);
    forbidOutOfBoundsIntents(intents, size);
    forbidGroupIntents(intents, groups);
    collideSameValueIntents(intents, scene, size.width);
    const {
      conflicts,
    } = applyIntents(intents, scene, size.width);

    expect(conflicts).to.eql([3, 5]);
  });
});

describe('rotation', () => {
  const scene = [
    _, x, _,
    _, x, x,
    _, x, _,
    _, _, _,
  ];

  const size = {
    width: 3,
    height: 4,
  };

  const groups = [
    [1, 4, 5, 7],
    // [1],
  ];

  it('finds the center of a figure', () => {
    {
      const center = findGroupCenter(groups[0], size.width);
      expect(center).to.eql({x: 1, y: 1});
    }
    {
      const center = findGroupCenter([3, 4, 5, 7], size.width);
      expect(center).to.eql({x: 1, y: 1});
    }
  });

  it('rotates a figure clockwise', () => {
    const intents = rotateCW(groups[0], size.width);
    forbidOutOfBoundsIntents(intents, size);
    forbidGroupIntents(intents, groups);
    collideSameValueIntents(intents, scene, size.width);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, size.width);

    expect(newScene).to.eql([
      _, _, _,
      x, x, x,
      _, x, _,
      _, _, _,
    ]);
  });

  it('rotates a figure counter-clockwise', () => {
    const intents = rotateCCW(groups[0], size.width);
    forbidOutOfBoundsIntents(intents, size);
    forbidGroupIntents(intents, groups);
    collideSameValueIntents(intents, scene, size.width);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, size.width);

    expect(newScene).to.eql([
      _, x, _,
      x, x, x,
      _, _, _,
      _, _, _,
    ]);
  });
});
