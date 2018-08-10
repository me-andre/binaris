const {
  mapValues,
  range,
} = require('lodash');

const {
  forbidOutOfBoundsIntents,
  forbidGroupIntents,
  collideSameValueIntents,
  applyIntents,
} = require('../shared');

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

const {
  importFigure,
  placeFigure,
} = require('../place-figure');

const {figures: drawings} = require('../figures');

const figures = mapValues(drawings, importFigure);

module.exports = {
  Game,
  createGame,
};

function createGame(size) {
  const length = size.width * size.height;

  const groups = {
    0: range(0, length / 2),
    1: range(length / 2, length),
  };

  const scene = new Array(length);

  for (const i of groups[0]) {
    scene[i] = 0;
  }

  for (const i of groups[1]) {
    scene[i] = 1;
  }

  return new Game({scene, size, groups});
}

function Game({scene, size, groups}) {
  this.scene = scene;
  this.size = size;
  this.groups = groups;
  this.sceneOffsetY = 4;
}

const g = Game.prototype;

g.tick = function () {
  const {scene, size, groups} = this;

  const {
    scene: newScene,
    conflicts,
    groups: newGroups,
  } = fallStep({scene, groups, size});

  if (conflicts.length > 0) {
    return {
      type: 'conflict',
      conflicts,
      game: this,
    };
  } else {
    const game = new Game({
      scene: newScene,
      groups: newGroups,
      size,
    });
    return {
      type: 'success',
      conflicts,
      game,
    };
  }
};

g.rotateCW = function (groupName) {
  return rotate.call(this, groupName, rotateCW);
};

g.rotateCCW = function (groupName) {
  return rotate.call(this, groupName, rotateCCW);
};

function rotate(groupName, rotationFunction) {
  const {scene, size, groups} = this;

  const group = groups[groupName];

  const centers = findGroupCenters(group, size.width);

  let center;
  let newScene, newGroups;
  let isSuccessful = false;

  for (center of centers) {
    const intents = rotationFunction(group, center, size.width);
    forbidOutOfBoundsIntents(intents, size);
    collideSameValueIntents(intents, scene, size.width);
    forbidGroupIntents(intents, groups);
    (
      {
        scene: newScene,
        groups: newGroups,
      } = applyIntents(intents, scene, groups, size.width)
    );
    if (intents.every(({isPermitted}) => isPermitted)) {
      isSuccessful = true;
      break;
    }
  }

  if (isSuccessful) {
    const game = new Game({
      scene: newScene,
      groups: newGroups,
      size,
    });
    return {
      type: 'success',
      game,
    };
  } else {
    return {
      type: 'collision',
      game: this,
    };
  }
}

g.moveLeft = function (groupName) {
  return moveAside.call(this, groupName, moveLeft);
};

g.moveRight = function (groupName) {
  return moveAside.call(this, groupName, moveRight);
};

function moveAside(groupName, moveFunction) {
  const {scene, size, groups} = this;
  const intents = moveFunction(groups[groupName], size.width);
  forbidOutOfBoundsIntents(intents, size);
  collideSameValueIntents(intents, scene, size.width);
  const isEveryPermitted = intents.every(({isPermitted}) => isPermitted);
  if (isEveryPermitted) {
    const {
      scene: newScene,
      groups: newGroups,
    } = applyIntents(intents, scene, groups, size.width);
    const game = new Game({
      scene: newScene,
      groups: newGroups,
      size,
    });
    return {
      type: 'success',
      game,
    };
  } else {
    return {
      type: 'collision',
      game: this,
    };
  }
}

g.drop = function (groupName) {
  const {
    scene,
    groups,
  } = drop(this, groupName);

  const {size} = this;

  const game = new Game({scene, groups, size});

  return {
    game,
  };
};

g.placeFigure = function (figureName, cellValue) {
  const figure = figures[figureName];
  const {scene, groups, size, sceneOffsetY} = this;
  const groupName = 'figure' + cellValue;
  const {
    scene: newScene,
    groups: newGroups,
  } = placeFigure({
    figure,
    cellValue,
    groupName,
    scene,
    groups,
    sceneSize: size,
    sceneOffsetY,
  });
  const game = new Game({
    scene: newScene,
    groups: newGroups,
    size,
  });
  return {
    game
  };
};
