const {expect} = require('chai');

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
