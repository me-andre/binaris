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
} = require('../gravity');

const {
  findGroupCenters,
  rotateCW,
  rotateCCW,
} = require('../rotation');

const {
  moveLeft,
  moveRight,
} = require('../moving-aside');

const {
  fallStep,
} = require('../fall-step');

const {
  drop,
} = require('../drop');

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

describe('physics', () => {
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
    collideSameValueIntents(intents, scene, size.width);
    forbidGroupIntents(intents, groups);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, groups, size.width);

    expect(newScene).to.eql([
      _, _,
      _, x,
      _, x,
      _, _,
    ])
  });

  it('reassigns cells to new groups', () => {
    const scene = [
      _, x, x,
      _, x, _,
      _, x, _,
      _, _, _,
    ];

    const groups = {
      figure1: [1, 2, 4, 7],
      [_]: [0, 3, 5, 6, 8, 9, 10, 11],
    };

    const size = {
      width: 3,
      height: 4,
    };

    const intents = buildFallIndents(scene, size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    forbidGroupIntents(intents, groups);
    const {
      scene: newScene,
      groups: newGroups,
    } = applyIntents(intents, scene, groups, size.width);

    for (const groupName in newGroups) {
      newGroups[groupName].sort((lIndex, rIndex) => lIndex - rIndex);
    }

    // prettyPrintScene()

    expect(newScene).to.eql([
      _, _, _,
      _, x, x,
      _, x, _,
      _, x, _,
    ]);

    expect(newGroups).to.eql({
      figure1: [4, 5, 7, 10],
      [_]: [0, 1, 2, 3, 6, 8, 9, 11],
    })
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
    collideSameValueIntents(intents, scene, size.width);
    forbidGroupIntents(intents, groups);
    const {
      conflicts,
    } = applyIntents(intents, scene, groups, size.width);

    expect(conflicts).to.eql([3, 5]);
  });
});

describe('gravity', () => {
  it('lands figures on the background 1', () => {
    const scene = [
      _, _, _, _,
      _, x, x, _,
      _, x, x, _,
      _, _, _, _,
      x, x, x, _,
      x, x, _, _,
      x, x, x, _,
      x, x, x, x,
    ];

    const size = {
      width: 4,
      height: 8,
    };

    const groups = {
      figure1: [5, 6, 9, 10],
      figure0: [19, 22, 23, 27],
      [x]: [16, 17, 18, 20, 21, 24, 25, 26, 28, 29, 30, 31],
      [_]: [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15],
    };

    const {
      scene: newScene,
      groups: newGroups,
    } = fallStep({scene, groups, size});

    expect(newScene).to.eql([
      _, _, _, _,
      _, _, _, _,
      _, x, x, _,
      _, x, x, _,
      x, x, x, _,
      x, x, _, _,
      x, x, x, _,
      x, x, x, x,
    ]);

    for (const name in newGroups) {
      newGroups[name].sort((lIndex, rIndex) => lIndex - rIndex);
    }

    expect(newGroups).to.eql({
      figure1: [9, 10, 13, 14],
      figure0: [],
      [x]: [16, 17, 18, 20, 21, 24, 25, 26, 28, 29, 30, 31],
      [_]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 15, 19, 22, 23, 27],
    });
  });

  it('lands figures on the background 2', () => {
    const scene = [
      _, _, _, _,
      _, _, _, _,
      _, x, x, _,
      _, x, x, _,
      x, x, x, _,
      x, x, _, _,
      x, x, x, _,
      x, x, x, x,
    ];

    const size = {
      width: 4,
      height: 8,
    };

    const groups = {
      figure1: [9, 10, 13, 14],
      figure0: [],
      [x]: [16, 17, 18, 20, 21, 24, 25, 26, 28, 29, 30, 31],
      [_]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 15, 19, 22, 23, 27],
    };

    const {
      scene: newScene,
      groups: newGroups,
    } = fallStep({scene, groups, size});

    expect(newScene).to.eql([
      _, _, _, _,
      _, _, _, _,
      _, x, x, _,
      _, x, x, _,
      x, x, x, _,
      x, x, _, _,
      x, x, x, _,
      x, x, x, x,
    ]);

    for (const name in newGroups) {
      newGroups[name].sort((lIndex, rIndex) => lIndex - rIndex);
    }

    expect(newGroups).to.eql({
      figure1: [],
      figure0: [],
      [x]: [9, 10, 13, 14, 16, 17, 18, 20, 21, 24, 25, 26, 28, 29, 30, 31],
      [_]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 15, 19, 22, 23, 27],
    });
  });

  it('swaps "black" filled rows', () => {
    let scene = [
      _, _, _,
      _, x, x,
      x, x, x,
      x, x, x,
    ];

    const size = {
      width: 3,
      height: 4,
    };

    const groups = {
      figure1: [4, 5, 7, 8],
      [_]: [0, 1, 2, 3],
      [x]: [6, 9, 10, 11],
    };

    ( {scene} = fallStep({scene, groups, size}) );

    expect(scene).to.eql([
      _, _, _,
      _, _, _,
      _, x, x,
      x, x, x,
    ]);
  });

  it('swaps "white" filled rows', () => {
    let scene = [
      _, x, _,
      _, _, _,
      x, x, _,
      x, x, x,
    ];

    const size = {
      width: 3,
      height: 4,
    };

    const groups = {
      figure0: [2, 4, 5, 8],
      [_]: [0, 3],
      [x]: [1, 6, 7, 9, 10, 11],
    };

    ( {scene} = fallStep({scene, groups, size}) );

    expect(scene).to.eql([
      _, x, _,
      x, x, _,
      x, x, x,
      x, x, x,
    ]);
  });

  it('handles groups after a swap', () => {
    const scene = [
      _, x, _,
      _, _, _,
      x, x, _,
      x, x, x,
    ];

    const size = {
      width: 3,
      height: 4,
    };

    let groups = {
      figure0: [2, 4, 5, 8],
      [_]: [0, 3],
      [x]: [1, 6, 7, 9, 10, 11],
    };

    ( {groups} = fallStep({scene, groups, size}) );

    for (const name in groups) {
      groups[name].sort((lIndex, rIndex) => lIndex - rIndex);
    }

    expect(groups).to.eql({
      figure0: [],
      [_]: [0, 2, 5],
      [x]: [1, 3, 4, 6, 7, 8, 9, 10, 11],
    });
  });

  it('swaps equal count of rows filled of both values', () => {
    let scene = [
      _, _, _, _,
      _, _, _, _,
      x, _, _, x,
      _, _, _, x,
      _, x, x, x,
      _, x, x, x,
      _, x, x, _,
      x, x, x, x,
    ];

    const size = {
      width: 4,
      height: 8,
    };

    let groups = {
      figure1: [11, 15, 19, 23],
      figure0: [12, 16, 20, 24],
      [_]: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 13, 14, 27],
      [x]: [8, 17, 18, 21, 22, 25, 26, 28, 29, 30, 31],
    };

    ( {scene, groups} = fallStep({scene, groups, size}) );
    ( {scene, groups} = fallStep({scene, groups, size}) );

    expect(scene).to.eql([
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, x,
      _, x, x, x,
      _, x, x, x,
      x, x, x, x,
      x, x, x, x,
    ]);
  });

  it('swaps unequal count of rows filled with both values', () => {
    let scene = [
      _, _, _, _,
      _, _, _, _,
      x, _, _, x,
      _, _, _, x,
      _, x, x, x,
      _, _, x, x,
      x, x, x, _,
      x, x, x, x,
    ];

    const size = {
      width: 4,
      height: 8,
    };

    let groups = {
      figure1: [11, 15, 19, 23],
      figure0: [12, 16, 20, 21],
      [_]: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 13, 14, 27],
      [x]: [8, 17, 18, 22, 24, 25, 26, 28, 29, 30, 31],
    };

    ( {scene, groups} = fallStep({scene, groups, size}) );
    ( {scene, groups} = fallStep({scene, groups, size}) );

    expect(scene).to.eql([
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, x,
      _, _, x, x,
      x, x, x, x,
      x, x, x, x,
    ]);
  });
});

describe('falling', () => {
  it('is when a figure goes down until it hits the ground', () => {
    let scene = [
      _, x, x,
      _, x, x,
      _, _, _,
      _, _, _,
      _, _, _,
    ];

    const size = {
      width: 3,
      height: 5,
    };

    const groups = {
      figure1: [1, 2, 4, 5],
      [_]: [0, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      [x]: [],
    };

    ( {scene} = drop({scene, groups, size}, 'figure1') );

    expect(scene).to.eql([
      _, _, _,
      _, _, _,
      _, _, _,
      _, x, x,
      _, x, x,
    ]);
  });

  it('is when a figure goes down until it hits an obstacle', () => {
    let scene = [
      _, x, x,
      _, x, x,
      _, _, _,
      _, _, _,
      x, x, x,
    ];

    const size = {
      width: 3,
      height: 5,
    };

    const groups = {
      figure1: [1, 2, 4, 5],
      [_]: [0, 3, 6, 7, 8, 9, 10, 11],
      [x]: [12, 13, 14],
    };

    ( {scene} = drop({scene, groups, size}, 'figure1') );

    expect(scene).to.eql([
      _, _, _,
      _, _, _,
      _, x, x,
      _, x, x,
      x, x, x,
    ]);
  });

  it('lands the figure on the background', () => {
    const scene = [
      _, x, x,
      _, x, x,
      _, _, _,
      _, _, _,
      x, x, x,
    ];

    const size = {
      width: 3,
      height: 5,
    };

    let groups = {
      figure1: [1, 2, 4, 5],
      [_]: [0, 3, 6, 7, 8, 9, 10, 11],
      [x]: [12, 13, 14],
    };

    ( {groups} = drop({scene, groups, size}, 'figure1') );

    for (const name in groups) {
      groups[name].sort((lIndex, rIndex) => lIndex - rIndex);
    }

    expect(groups).to.eql({
      figure1: [],
      [_]: [0, 1, 2, 3, 4, 5, 6, 9],
      [x]: [7, 8, 10, 11, 12, 13, 14],
    });
  });

  it('swaps "black" filled rows', () => {
    let scene = [
      _, x, x,
      _, x, x,
      _, _, _,
      x, _, _,
      x, x, x,
    ];

    const size = {
      width: 3,
      height: 5,
    };

    const groups = {
      figure1: [1, 2, 4, 5],
      [_]: [0, 3, 6, 7, 8, 10, 11],
      [x]: [9, 12, 13, 14],
    };

    ( {scene} = drop({scene, groups, size}, 'figure1') );

    expect(scene).to.eql([
      _, _, _,
      _, _, _,
      _, _, _,
      _, x, x,
      x, x, x,
    ])
  });

  it('swaps "white" filled rows', () => {
    let scene = [
      _, x, x,
      _, x, x,
      x, x, _,
      x, _, _,
      x, x, _,
    ];

    const size = {
      width: 3,
      height: 5,
    };

    const groups = {
      figure0: [8, 10, 11, 14],
      [_]: [0, 3],
      [x]: [1, 2, 4, 5, 6, 7, 9, 12, 13],
    };

    ( {scene} = drop({scene, groups, size}, 'figure0') );

    expect(scene).to.eql([
      _, x, _,
      x, x, _,
      x, x, x,
      x, x, x,
      x, x, x,
    ])
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
    collideSameValueIntents(intents, scene, size.width);
    forbidGroupIntents(intents, groups);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, groups, size.width);

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
    collideSameValueIntents(intents, scene, size.width);
    forbidGroupIntents(intents, groups);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, groups, size.width);

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
    ];

    const centers = findGroupCenters(groups[0], size.width);
    const center = centers.find(({y}) => y === 2);
    const intents = rotateCW(groups[0], center, size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    forbidGroupIntents(intents, groups);
    const {
      scene: newScene,
    } = applyIntents(intents, scene, groups, size.width);

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
    ];

    const centers = findGroupCenters(groups[0], size.width);

    let center;
    let newScene;

    for (center of centers) {
      const intents = rotateCW(groups[0], center, size.width);
      forbidOutOfBoundsIntents(intents, size);
      collideSameValueIntents(intents, scene, size.width);
      forbidGroupIntents(intents, groups);
      newScene = applyIntents(intents, scene, groups, size.width).scene;
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

describe('moving aside', () => {
  it('moves left', () => {
    const scene = [
      _, x, _, _,
      _, x, x, _,
      _, x, _, _,
      _, _, _, _,
    ];

    const size = {
      width: 4,
      height: 4,
    };

    const groups = [
      [1, 5, 6, 9],
    ];

    const intents = moveLeft(groups[0], size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    const isEveryPermitted = intents.every(({isPermitted}) => isPermitted);
    if (!isEveryPermitted) {
      throw new Error(`can't move!`);
    }
    const {
      scene: newScene,
    } = applyIntents(intents, scene, groups, size.width);

    expect(newScene).to.eql([
      x, _, _, _,
      x, x, _, _,
      x, _, _, _,
      _, _, _, _,
    ]);
  });

  it('moves right', () => {
    const scene = [
      _, x, _, _,
      _, x, x, _,
      _, x, _, _,
      _, _, _, _,
    ];

    const size = {
      width: 4,
      height: 4,
    };

    const groups = [
      [1, 5, 6, 9],
    ];

    const intents = moveRight(groups[0], size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    const isEveryPermitted = intents.every(({isPermitted}) => isPermitted);
    if (!isEveryPermitted) {
      throw new Error(`can't move!`);
    }
    const {
      scene: newScene,
    } = applyIntents(intents, scene, groups, size.width);

    expect(newScene).to.eql([
      _, _, x, _,
      _, _, x, x,
      _, _, x, _,
      _, _, _, _,
    ]);
  });

  it('detects collisions of same-value cells', () => {
    const scene = [
      _, x, _, _,
      _, x, x, _,
      x, x, _, _,
      x, _, _, _,
    ];

    const size = {
      width: 4,
      height: 4,
    };

    const groups = [
      [1, 5, 6, 9],
    ];

    const intents = moveLeft(groups[0], size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    const isEveryPermitted = intents.every(({isPermitted}) => isPermitted);
    expect(isEveryPermitted).to.be.false;
  });

  it('detects collisions with the stage bounds', () => {
    const scene = [
      _, _, x, _,
      _, _, x, x,
      _, _, x, _,
      _, _, _, _,
    ];

    const size = {
      width: 4,
      height: 4,
    };

    const groups = [
      [2, 6, 7, 10],
    ];

    const intents = moveRight(groups[0], size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    const isEveryPermitted = intents.every(({isPermitted}) => isPermitted);
    expect(isEveryPermitted).to.be.false;
  });
});
