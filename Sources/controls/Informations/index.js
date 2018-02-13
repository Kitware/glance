import React from 'react';
import PropTypes from 'prop-types';

import ImageData from './ImageData';
import PolyData from './PolyData';
import FieldData from './FieldData';
import FPSMonitor from './FPSMonitor';
import VRControls from './VRControls';

import style from './Informations.mcss';

const hasVR = !!navigator.getVRDisplays;

export default function Informations(props) {
  const output = [
    <label className={style.title} key="title-perf">
      Performance monitor
    </label>,
    <FPSMonitor key="fps" proxyManager={props.proxyManager} />,
  ];
  const source = props.proxyManager.getActiveSource();
  const dataset = source ? source.getDataset() : null;

  if (hasVR) {
    output.push(
      <label className={style.title} key="title-vr">
        Virtual Reality Controls
      </label>
    );
    output.push(<VRControls key="vr" proxyManager={props.proxyManager} />);
  }

  if (source) {
    output.push(
      <label className={style.title} key="title">
        {source.getName()}
      </label>
    );
  }

  if (dataset && dataset.isA && dataset.isA('vtkDataSet')) {
    if (dataset.isA('vtkImageData')) {
      output.push(<ImageData key="ds" dataset={dataset} />);
    }

    if (dataset.isA('vtkPolyData')) {
      output.push(<PolyData key="ds" dataset={dataset} />);
    }

    if (dataset.getPointData) {
      output.push(
        <FieldData key="pd" field={dataset.getPointData()} name="Point Data" />
      );
    }

    if (dataset.getCellData) {
      output.push(
        <FieldData key="cd" field={dataset.getCellData()} name="Cell Data" />
      );
    }
  }

  return <div className={style.informationTab}>{output}</div>;
}

Informations.propTypes = {
  proxyManager: PropTypes.object,
};

Informations.defaultProps = {
  proxyManager: null,
};
