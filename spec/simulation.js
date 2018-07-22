const {expect} = require('chai');
const {at, range, difference} = require('lodash');

const {Game} = require('./game');

const {prettyPrintScene} = require('../util');

const x = 1;
const _ = 0;

const size = {
  width: 10,
  height: 28,
  // offsetY: 4,
};

describe('the game', () => {
  it('should work as expected', () => {
    const start = [
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, x, x, _, _, _, _, //
      _, _, _, _, x, x, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, _, x, x, x, x, //
      x, x, x, x, _, _, x, x, x, x, //
      x, x, x, x, x, _, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ];

    expect(start).to.have.length(size.width * size.height);

    const groups = {
      cube: [24, 25, 34, 35],
      thing: [245, 254, 255, 265],
    };

    groups[x] = difference(range(0, 140), groups.cube);
    groups[_] = difference(range(140, 280), groups.thing);

    expect(at(start, groups.cube).every((v) => v === x)).to.be.true;
    expect(at(start, groups.thing).every((v) => v === _)).to.be.true;

    expect(groups[x]).to.have.length(140 - 4);
    expect(groups[_]).to.have.length(140 - 4);

    let result = new Game({
      scene: start,
      size,
      groups,
    }).tick();

    expect(result.game.scene).to.eql([
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, x, x, _, _, _, _, //
      _, _, _, _, x, x, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, _, x, x, x, x,
      x, x, x, x, _, _, x, x, x, x, //
      x, x, x, x, x, _, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ]);

    result = result.game.rotateCW('thing')
      .game.rotateCW('thing')
      .game.tick();

    expect(result.game.scene).to.eql([
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, x, x, _, _, _, _,
      _, _, _, _, x, x, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, _, x, x, x, x,
      x, x, x, x, x, _, _, x, x, x,
      x, x, x, x, x, _, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ]);

    result = result.game.rotateCCW('thing')
      .game.rotateCCW('thing')
      .game.rotateCCW('thing')
      .game.tick();

    expect(result.type).to.eql('success');

    expect(result.game.scene).to.eql([
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, x, x, _, _, _, _,
      _, _, _, _, x, x, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, _, _, _, x, x, x,
      x, x, x, x, x, _, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ]);

    result = result.game.moveLeft('cube')
      .game.drop('thing')
      .game.moveRight('cube')
      .game.drop('cube');

    // prettyPrintScene(result.game.scene, size);

    expect(result.game.scene).to.eql([
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, x, x, _, _, _, _,
      x, x, x, x, x, x, _, x, x, x,
      x, x, x, x, x, _, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ]);

  });
});
