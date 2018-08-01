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
      figure1: [24, 25, 34, 35],
      figure0: [245, 254, 255, 265],
    };

    groups[_] = difference(range(0, 140), groups.figure1);
    groups[x] = difference(range(140, 280), groups.figure0);

    expect(at(start, groups.figure1).every((v) => v === x)).to.be.true;
    expect(at(start, groups.figure0).every((v) => v === _)).to.be.true;

    expect(at(start, groups[x]).every((v) => v === x)).to.be.true;
    expect(at(start, groups[_]).every((v) => v === _)).to.be.true;

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

    expect(at(result.game.scene, result.game.groups.figure1).every((v) => v === x)).to.be.true;
    expect(at(result.game.scene, result.game.groups.figure0).every((v) => v === _)).to.be.true;

    expect(at(result.game.scene, result.game.groups[x]).every((v) => v === x)).to.be.true;
    expect(at(result.game.scene, result.game.groups[_]).every((v) => v === _)).to.be.true;

    result = result.game.rotateCW('figure0')
      .game.rotateCW('figure0')
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

    result = result.game.rotateCCW('figure0')
      .game.rotateCCW('figure0')
      .game.rotateCCW('figure0')
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

    result = result.game.moveLeft('figure1')
      .game.drop('figure0')
      .game.moveRight('figure1')
      .game.drop('figure1');

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

    result = result
      .game.placeFigure('T', 1)
      .game.placeFigure('I', 0)
      .game.tick();

    // prettyPrintScene(result.game.scene, size);

    expect(result.game.scene).to.eql([
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, x, x, x, _, _, _, _, //
      _, _, _, _, x, _, _, _, _, _,
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
      x, x, x, _, _, _, _, x, x, x,
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ]);

    result = result
      .game.rotateCCW('figure1')
      .game.moveRight('figure1')
      .game.moveRight('figure1')
      .game.rotateCW('figure0')

    {
      let i = 10;
      while (i --> 0) {
        result = result.game.tick();
      }
    }

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
      _, _, _, _, _, _, x, _, _, _,
      _, _, _, _, _, x, x, x, _, _,
      x, x, x, x, _, x, x, x, x, x,
      x, x, x, x, _, _, x, x, x, x,
      x, x, x, x, _, x, x, x, x, x,
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

    expect(result.game.groups.figure0).to.be.empty;

    result = result
      .game.placeFigure('L', 0)
      .game.tick();

    expect(result.game.groups.figure1).to.be.empty;

    result = result
      .game.placeFigure('I', 1)
      .game.tick();

    expect(result.game.scene).to.eql([
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, x, x, x, x, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, x, _, _, _,
      _, _, _, _, _, x, x, x, _, _,
      x, x, x, x, _, x, x, x, x, x,
      x, x, x, x, _, _, x, x, x, x,
      x, x, x, x, _, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, _, _, x, x, x, x,
      x, x, x, x, x, _, x, x, x, x,
      x, x, x, x, x, _, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ]);

    result = result
      .game.rotateCW('figure1')
      .game.rotateCW('figure0')
      .game.rotateCW('figure0')
      .game.tick()
      .game.moveRight('figure0')
      .game.tick();

    expect(result.game.scene).to.eql([
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _, //
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, x, _, _, _, _, _,
      _, _, _, _, x, _, _, _, _, _,
      _, _, _, _, x, _, _, _, _, _,
      _, _, _, _, x, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, x, _, _, _,
      _, _, _, _, _, x, x, x, _, _,
      x, x, x, x, _, x, x, x, x, x,
      x, x, x, x, _, _, x, x, x, x,
      x, x, x, x, _, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, _, x, x, x,
      x, x, x, x, x, x, _, x, x, x,
      x, x, x, x, x, x, _, _, x, x,
      x, x, x, x, x, x, x, x, x, x,
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
      x, x, x, x, x, x, x, x, x, x, //
    ]);

    {
      let i = 8;
      while (i --> 0) {
        result = result.game.tick();
      }
    }

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
      _, _, _, _, x, x, _, x, _, _,
      x, x, x, x, x, x, _, _, x, x,
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

    result = result.game.tick();

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
      _, _, _, _, x, x, _, x, _, _,
      x, x, x, x, x, x, _, _, x, x,
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
