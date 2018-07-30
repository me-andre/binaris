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

describe('placing a figure', () => {
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

    const size = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [x]: [],
      [_]: range(0, size.width * size.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.T,
        cellValue: x,
        groupName: 'figure1',
        scene,
        groups,
        sceneWidth: size.width,
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

    const size = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [x]: [],
      [_]: range(0, size.width * size.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.L,
        cellValue: x,
        groupName: 'figure1',
        scene,
        groups,
        sceneWidth: size.width,
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

    const size = {
      width: 4,
      height: 8,
    };

    const sceneOffsetY = 4;

    let groups = {
      [x]: [],
      [_]: range(0, size.width * size.height),
    };

    (
      {groups, scene} = placeFigure({
        figure: figures.I,
        cellValue: x,
        groupName: 'figure1',
        scene,
        groups,
        sceneWidth: size.width,
        sceneOffsetY,
      })
    );

    expect(groups.figure1).to.eql([12, 13, 14, 15]);
    expect(difference(groups[_], groups.figure1)).to.eql(groups[_]);

  });
});
