import React from 'react';
import PropTypes from 'prop-types';

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
          <div className={style.view} style={{ background: 'red' }} />
          <div className={style.view}>
            <Layout3D scene={this.props.scene} />
          </div>
        </div>
        <div className={style.splitRow}>
          <div className={style.view} style={{ background: 'blue' }} />
          <div className={style.view} style={{ background: 'orange' }} />
        </div>
      </div>);
  }
}

LayoutQuad.propTypes = {
  scene: PropTypes.array,
  className: PropTypes.string,
};

LayoutQuad.defaultProps = {
  scene: [],
  className: '',
};
