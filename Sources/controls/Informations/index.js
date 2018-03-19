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
  const output = [<br key="space-head" />];
  const source = props.proxyManager.getActiveSource();
  const view = props.proxyManager.getActiveView();
  const dataset = source ? source.getDataset() : null;

  // GPU data
  if (view) {
    const rw = view.getOpenglRenderWindow();
    const allInfo = rw.getGLInformations();
    const { UNMASKED_RENDERER, UNMASKED_VENDOR, WEBGL_VERSION } = allInfo;

    output.push(
      <label className={style.title} key="gpu">
        {UNMASKED_VENDOR.value}
      </label>
    );
    output.push(
      <div className={style.textContent} key="webgl">
        {UNMASKED_RENDERER.value}
        <br />WebGL {WEBGL_VERSION.value}
      </div>
    );
  }

  // Perf monitor
  output.push(
    <label className={style.title} key="title-perf">
      Performance monitor
    </label>
  );
  output.push(<FPSMonitor key="fps" proxyManager={props.proxyManager} />);

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
