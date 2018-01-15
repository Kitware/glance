import React from 'react';
import PropTypes from 'prop-types';

import Layout2D from './Layout2D';
import Layout3D from './Layout3D';
import style from './vtk-layout.mcss';

export default function LayoutSplit(props) {
  return (
    <div className={`${style.splitRow} ${props.className}`}>
      <div className={style.view}>
        <Layout2D pipelineManager={props.pipelineManager} />
      </div>
      <div className={style.view}>
        <Layout3D pipelineManager={props.pipelineManager} />
      </div>
    </div>
  );
}

LayoutSplit.propTypes = {
  pipelineManager: PropTypes.object,
  className: PropTypes.string,
};

LayoutSplit.defaultProps = {
  pipelineManager: null,
  className: '',
};
