const {difference} = require('lodash');

const {legend} = require('./figures');

const {
  getCellIndexFromCoords,
  getCellCoordsFromIndex,
} = require('./shared');

const counterValues = require('./counter-values');

module.exports = {
  importFigure,
  placeFigure,
};

function importFigure(drawing) {
  const {shape, width} = drawing;
  const indices = [];
  for (let i = 0; i < shape.length; i++) {
    if (shape[i] === legend.block) {
      indices.push(i);
    }
  }
  const topLeftCellIndex = Math.min(...indices);
  const bottomRightCellIndex = Math.max(...indices);
  const height = Math.floor(bottomRightCellIndex / width) - Math.floor(topLeftCellIndex / width) + 1;
  return {
    indices,
    width,
    height,
  };
}

function placeFigure({figure, cellValue, groupName, scene, groups, sceneSize, sceneOffsetY}) {
  const {
    indices,
    width,
    height,
  } = figure;

  const figureCenterX = width / 2;
  const sceneCenterX = sceneSize.width / 2;

  let figureOffsetX = sceneCenterX - figureCenterX;

  if (figureOffsetX % 1 !== 0) {
    // todo consider smarter logic
    figureOffsetX = Math.floor(figureOffsetX);
  }

  const figureOffsetY = sceneOffsetY - height;

  const group = indices.map((cellIndex) => {
    let {x, y} = getCellCoordsFromIndex(cellIndex, width);
    x += figureOffsetX;
    y += figureOffsetY;
    if (cellValue === 0) {
      x = sceneSize.width - x - 1;
      y = sceneSize.height - y - 1;
    }
    return getCellIndexFromCoords({x, y}, sceneSize.width);
  });

  scene = [...scene];

  for (const cellIndex of group) {
    scene[cellIndex] = cellValue;
  }

  const backgroundValue = counterValues[cellValue];

  let background = groups[backgroundValue];

  background = difference(background, group);

  groups = {
    ...groups,
    [groupName]: group,
    [backgroundValue]: background,
  };

  return {
    scene,
    groups,
  };
}
