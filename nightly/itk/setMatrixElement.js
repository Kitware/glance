var Matrix = require('./Matrix.js');

var setMatrixElement = function setMatrixElement(matrix, row, column, value) {
  var newMatrix = new Matrix(matrix);
  newMatrix.data[column + row * newMatrix.columns] = value;
  return newMatrix;
};

module.exports = setMatrixElement;