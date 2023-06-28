"use strict";

const Matrix = require('./Matrix.js');

const setMatrixElement = (matrix, row, column, value) => {
  const newMatrix = new Matrix(matrix);
  newMatrix.data[column + row * newMatrix.columns] = value;
  return newMatrix;
};

module.exports = setMatrixElement;