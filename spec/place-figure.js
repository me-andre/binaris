const {expect} = require('chai');

const {
  range,
  mapValues,
  difference,
} = require('lodash');

const {
  importFigure,
  placeFigure,
} = require('../place-figure');

const {figures: drawings} = require('../figures');

const {prettyPrintScene} = require('../util');

const x = 1;
const _ = 0;

const figures = mapValues(drawings, importFigure);

describe('placing a black figure', () => {
  it('places T figure on the background', () => {
    let scene = [
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
    ];

    const sceneSize = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [x]: [],
      [_]: range(0, sceneSize.width * sceneSize.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.T,
        cellValue: x,
        groupName: 'figure1',
        scene,
        groups,
        sceneSize,
        sceneOffsetY,
      })
    );

    expect(scene).to.eql([
      _, _, _, _,
      _, _, _, _,
      x, x, x, _,
      _, x, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
    ]);

  });

  it('places L figure on the background', () => {
    let scene = [
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
    ];

    const sceneSize = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [x]: [],
      [_]: range(0, sceneSize.width * sceneSize.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.L,
        cellValue: x,
        groupName: 'figure1',
        scene,
        groups,
        sceneSize,
        sceneOffsetY,
      })
    );

    expect(scene).to.eql([
      _, _, _, _,
      _, x, _, _,
      _, x, _, _,
      _, x, x, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
    ]);

  });

  it('cuts occupied cells from the background', () => {
    let scene = [
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, _, _,
    ];

    const sceneSize = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [x]: [],
      [_]: range(0, sceneSize.width * sceneSize.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.I,
        cellValue: x,
        groupName: 'figure1',
        scene,
        groups,
        sceneSize,
        sceneOffsetY,
      })
    );

    expect(groups.figure1).to.eql([12, 13, 14, 15]);
    expect(difference(groups[_], groups.figure1)).to.eql(groups[_]);

  });
});

describe('placing a white figure', () => {
  it('places T figure on the background', () => {
    let scene = [
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
    ];

    const sceneSize = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [_]: [],
      [x]: range(0, sceneSize.width * sceneSize.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.T,
        cellValue: _,
        groupName: 'figure0',
        scene,
        groups,
        sceneSize,
        sceneOffsetY,
      })
    );

    expect(scene).to.eql([
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, _, x,
      x, _, _, _,
      x, x, x, x,
      x, x, x, x,
    ]);

  });

  it('places Z figure on the background', () => {
    let scene = [
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
    ];

    const sceneSize = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [_]: [],
      [x]: range(0, sceneSize.width * sceneSize.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.Z,
        cellValue: _,
        groupName: 'figure0',
        scene,
        groups,
        sceneSize,
        sceneOffsetY,
      })
    );

    expect(scene).to.eql([
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, _, _, x,
      x, x, _, _,
      x, x, x, x,
      x, x, x, x,
    ]);

  });

  it('cuts occupied cells from the background', () => {
    let scene = [
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
      x, x, x, x,
    ];

    const sceneSize = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [_]: [],
      [x]: range(0, sceneSize.width * sceneSize.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.I,
        cellValue: _,
        groupName: 'figure0',
        scene,
        groups,
        sceneSize,
        sceneOffsetY,
      })
    );

    for (const name in groups) {
      groups[name].sort((lIndex, rIndex) => lIndex - rIndex);
    }

    expect(groups.figure0).to.eql([16, 17, 18, 19]);
    expect(difference(groups[x], groups.figure0)).to.eql(groups[x]);

  });
});
