const figures = {};

const legend = {
  block: 1,
  hole: 0,
};

module.exports = {
  figures,
  legend,
};

const {
  block: x,
  hole: _,
} = legend;

figures.I = {
  shape: [x, x, x, x],
  width: 4,
};

figures.L = {
  shape: [
    x, _,
    x, _,
    x, x,
  ],
  width: 2,
};

figures.T = {
  shape: [
    x, x, x,
    _, x, _,
  ],
  width: 3,
};
