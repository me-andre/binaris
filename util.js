module.exports = {
  prettyPrintScene,
};

function prettyPrintScene(scene, size) {
  for (let y = 0; y < size.height; y++) {
    const rowStartIndex = y * size.width;
    console.log(...scene.slice(rowStartIndex, rowStartIndex + size.width));
  }
}
