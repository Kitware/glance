import React from 'react';
import PropTypes from 'prop-types';

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
        <div className={style.view} style={{ background: 'red' }} />
        <div className={style.view}>
          <Layout3D scene={this.props.scene} />
        </div>
      </div>);
  }
}

LayoutSplit.propTypes = {
  scene: PropTypes.array,
  className: PropTypes.string,
};

LayoutSplit.defaultProps = {
  scene: [],
  className: '',
};
