import React from 'react';
import PropTypes from 'prop-types';

import Layout2D from './Layout2D';
import Layout3D from './Layout3D';
import style from './vtk-layout.mcss';

export default class LayoutQuad extends React.Component {
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
      <div className={`${style.quadRoot} ${this.props.className}`}>
        <div className={style.splitRow}>
          <div className={style.view}>
            <Layout2D title="-Z+X" orientations={[]} axis={1} orientation={1} viewUp={[1, 0, 0]} pipelineManager={this.props.pipelineManager} />
          </div>
          <div className={style.view}>
            <Layout3D pipelineManager={this.props.pipelineManager} />
          </div>
        </div>
        <div className={style.splitRow}>
          <Layout2D title="-Z+Y" orientations={[]} axis={0} orientation={1} viewUp={[0, 1, 0]} pipelineManager={this.props.pipelineManager} />
          <Layout2D title="+X+Y" orientations={[]} axis={2} orientation={1} viewUp={[0, 1, 0]} pipelineManager={this.props.pipelineManager} />
        </div>
      </div>);
  }
}

LayoutQuad.propTypes = {
  pipelineManager: PropTypes.object,
  className: PropTypes.string,
};

LayoutQuad.defaultProps = {
  pipelineManager: null,
  className: '',
};
