import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'antd';

import vtk3DView from '../pipeline/View3D';
import style from './vtk-layout.mcss';

export default class Layout3D extends React.Component {
  constructor(props) {
    super(props);

    // Setup vtk.js objects
    this.view = vtk3DView.newInstance();
    this.subscription = this.view.getInteractor().onAnimation(() => {
      this.props.pipelineManager.setActiveViewId(this.view.getId());
    });
  }

  componentDidMount() {
    this.view.setContainer(this.container);

    this.view.resetCamera();
    this.view.resize();
    window.addEventListener('resize', this.view.resize);
    this.props.pipelineManager.registerView(this.view);
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    window.removeEventListener('resize', this.view.resize);
    this.view.setContainer(null);
    this.props.pipelineManager.unregisterView(this.view);
  }

  render() {
    return (
      <div className={this.props.pipelineManager.getActiveViewId() === this.view.getId() ? style.activeRenderWindowContainer : style.renderWindowContainer}>
        <div className={style.renderWindowToolbar}>
          <label className={style.renderWindowTitle}>
            {this.props.title}
          </label>
          <section className={style.renderWindowActions}>
            <Button size="small" icon="scan" onClick={this.view.resetCamera} />
          </section>
        </div>
        <div
          className={`${style.renderWindow} ${this.props.className}`}
          ref={((c) => { this.container = c; })}
        />
      </div>);
  }
}

Layout3D.propTypes = {
  title: PropTypes.string,
  pipelineManager: PropTypes.object,
  className: PropTypes.string,
};

Layout3D.defaultProps = {
  title: 'View 3D',
  pipelineManager: null,
  className: '',
};
