var getMatrixElement = function getMatrixElement(matrix, row, column) {
  return matrix.data[column + row * matrix.columns];
};

module.exports = getMatrixElement;