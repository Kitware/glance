import React from 'react';
import PropTypes from 'prop-types';

import ImageData from './ImageData';
import PolyData from './PolyData';
import FieldData from './FieldData';

import style from './Informations.mcss';

export default function Informations(props) {
  const output = [];
  const source = props.proxyManager.getActiveSource();
  const dataset = source ? source.getDataset() : null;

  if (source) {
    output.push(
      <label className={style.title} key="title">
        {source.getName()}
      </label>
    );
  }

  if (dataset) {
    if (dataset.isA('vtkImageData')) {
      output.push(<ImageData key="ds" dataset={dataset} />);
    }

    if (dataset.isA('vtkPolyData')) {
      output.push(<PolyData key="ds" dataset={dataset} />);
    }

    output.push(
      <FieldData key="pd" field={dataset.getPointData()} name="Point Data" />
    );
    output.push(
      <FieldData key="cd" field={dataset.getCellData()} name="Cell Data" />
    );
  }

  return output;
}

Informations.propTypes = {
  proxyManager: PropTypes.object,
};

Informations.defaultProps = {
  proxyManager: null,
};
