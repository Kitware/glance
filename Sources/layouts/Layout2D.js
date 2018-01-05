import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'antd';

import vtk2DView from '../pipeline/View2D';
import style from './vtk-layout.mcss';

export default class Layout2D extends React.Component {
  constructor(props) {
    super(props);

    // Setup vtk.js objects
    this.view = vtk2DView.newInstance();
    this.view.updateOrientation(props.axis, props.orientation, props.viewUp);
    this.subscription = this.view.getInteractor().onAnimation(() => {
      this.props.pipelineManager.setActiveViewId(this.view.getProxyId());
    });

    // Bind callbacks
    this.updateOrientation = this.updateOrientation.bind(this);
    this.rotate = this.rotate.bind(this);
  }

  componentDidMount() {
    this.view.setContainer(this.container);

    this.view.resetCamera();
    this.view.resize();
    window.addEventListener('resize', this.view.resize);
    this.props.pipelineManager.registerView(this.view);
    this.view.resetCamera();
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

  updateOrientation(e) {
    const state = this.props.orientations[Number(e.target.dataset.index)];
    this.view.updateOrientation(state.axis, state.orientation, state.viewUp);
    this.props.pipelineManager.addSourcesToView(this.view);
    this.props.pipelineManager.modified();
    this.view.resetCamera();
    this.view.renderLater();
  }

  rotate() {
    this.view.rotate(90);
  }

  render() {
    return (
      <div
        className={
          this.props.pipelineManager.getActiveViewId() ===
          this.view.getProxyId()
            ? style.activeRenderWindowContainer
            : style.renderWindowContainer
        }
      >
        <div className={style.renderWindowToolbar}>
          <label className={style.renderWindowTitle}>{this.props.title}</label>
          <section className={style.renderWindowActions}>
            {this.props.orientations.map((o, i) => (
              <div
                key={o.label}
                className={style.button}
                data-index={i}
                onClick={this.updateOrientation}
              >
                {o.label}
              </div>
            ))}
            <Button
              size="small"
              icon="compass"
              onClick={this.rotate}
              style={{ marginRight: '5px' }}
            />
            <Button size="small" icon="scan" onClick={this.view.resetCamera} />
          </section>
        </div>
        <div
          className={`${style.renderWindow} ${this.props.className}`}
          ref={(c) => {
            this.container = c;
          }}
        />
      </div>
    );
  }
}

Layout2D.propTypes = {
  pipelineManager: PropTypes.object,
  title: PropTypes.string,
  className: PropTypes.string,
  axis: PropTypes.number,
  orientation: PropTypes.number,
  viewUp: PropTypes.array,
  orientations: PropTypes.array,
};

Layout2D.defaultProps = {
  title: 'View 2D',
  pipelineManager: null,
  className: '',
  axis: 2,
  orientation: 1,
  viewUp: [0, 1, 0],
  orientations: [
    { label: 'X', axis: 0, orientation: 1, viewUp: [0, 1, 0] },
    { label: 'Y', axis: 1, orientation: 1, viewUp: [1, 0, 0] },
    { label: 'Z', axis: 2, orientation: 1, viewUp: [0, 1, 0] },
  ],
};
