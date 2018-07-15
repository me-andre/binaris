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
  findGroupCenters,
  rotateCW,
  rotateCCW,
} = require('../rotation');

const {prettyPrintScene} = require('../util');

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
      const [center] = findGroupCenters(groups[0], size.width);
      expect(center).to.eql({x: 1, y: 1});
    }
    {
      const [center] = findGroupCenters([3, 4, 5, 7], size.width);
      expect(center).to.eql({x: 1, y: 1});
    }
  });

  it('rotates a figure clockwise', () => {
    const [center] = findGroupCenters(groups[0], size.width);
    const intents = rotateCW(groups[0], center, size.width);
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
    const [center] = findGroupCenters(groups[0], size.width);
    const intents = rotateCCW(groups[0], center, size.width);
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

  it('rotates a figure which center is between the cells', () => {
    const scene = [
      _, _, _, _, _,
      _, _, x, _, _,
      _, _, x, _, _,
      _, _, x, _, _,
      _, _, x, _, _,
      _, _, _, _, _,
    ];

    const size = {
      width: 5,
      height: 6,
    };

    const groups = [
      [7, 12, 17, 22],
      // [1],
    ];

    const centers = findGroupCenters(groups[0], size.width);
    const center = centers.find(({y}) => y === 2);
    const intents = rotateCW(groups[0], center, size.width);
    forbidOutOfBoundsIntents(intents, size);
    forbidGroupIntents(intents, groups);
    collideSameValueIntents(intents, scene, size.width);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, size.width);

    expect(newScene).to.eql([
      _, _, _, _, _,
      _, _, _, _, _,
      x, x, x, x, _,
      _, _, _, _, _,
      _, _, _, _, _,
      _, _, _, _, _,
    ]);
  });

  it("tries different centers if rotation doesn't succeed", () => {
    const scene = [
      _, x, _, _,
      _, x, _, _,
      _, x, _, _,
      _, x, _, _,
    ];

    const size = {
      width: 4,
      height: 4,
    };

    const groups = [
      [1, 5, 9, 13],
      // [1],
    ];

    const centers = findGroupCenters(groups[0], size.width);

    let center;
    let newScene;

    for (center of centers) {
      const intents = rotateCW(groups[0], center, size.width);
      forbidOutOfBoundsIntents(intents, size);
      forbidGroupIntents(intents, groups);
      collideSameValueIntents(intents, scene, size.width);
      newScene = applyIntents(intents, scene, size.width).scene;
      if (intents.every(({isPermitted}) => isPermitted)) {
        break;
      }
    }

    expect(center).to.eql({x: 1, y: 2});

    expect(newScene).to.eql([
      _, _, _, _,
      _, _, _, _,
      x, x, x, x,
      _, _, _, _,
    ]);
  });
});
