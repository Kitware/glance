import React from 'react';
import PropTypes from 'prop-types';

import Layout2D from './Layout2D';
import Layout3D from './Layout3D';
import style from './vtk-layout.mcss';

export default class LayoutSplit extends React.Component {
  constructor(props) {
    super(props);

    // Closure for callback
    this.resetCamera = this.resetCamera.bind(this);
    this.resize = this.resize.bind(this);
  }

  resize() {
    console.log(this);
  }

  resetCamera() {
    console.log(this);
  }

  render() {
    return (
      <div className={`${style.splitRow} ${this.props.className}`}>
        <div className={style.view}>
          <Layout2D pipelineManager={this.props.pipelineManager} />
        </div>
        <div className={style.view}>
          <Layout3D pipelineManager={this.props.pipelineManager} />
        </div>
      </div>
    );
  }
}

LayoutSplit.propTypes = {
  pipelineManager: PropTypes.object,
  className: PropTypes.string,
};

LayoutSplit.defaultProps = {
  pipelineManager: null,
  className: '',
};
