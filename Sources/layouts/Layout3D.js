import React from 'react';
import PropTypes from 'prop-types';

import UI from '../ui';
import style from './vtk-layout.mcss';

const { Button, FaIcon } = UI;

export default class Layout3D extends React.Component {
  constructor(props) {
    super(props);

    // Setup vtk.js objects
    this.view = props.proxyManager.createProxy('Views', 'View3D');
    this.view.updateOrientation(props.axis, props.orientation, props.viewUp);
    this.subscription = this.props.proxyManager.onActiveViewChange(() =>
      this.forceUpdate()
    );

    this.toggleOrientationMarker = this.toggleOrientationMarker.bind(this);
    this.activateView = this.activateView.bind(this);
  }

  componentDidMount() {
    this.view.setContainer(this.container);

    this.view.resetCamera();
    this.view.resize();
    window.addEventListener('resize', this.view.resize);

    this.view.resetCamera();

    setTimeout(this.view.resize, 500);

    if (this.props.activateOnMount) {
      this.activateView();
    }

    // set mousedown capture on container after view.setContainer.
    this.container.addEventListener('mousedown', this.activateView, true);
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    window.removeEventListener('resize', this.view.resize);
    this.view.setContainer(null);
    this.props.proxyManager.deleteProxy(this.view);
  }

  toggleOrientationMarker() {
    const orientationAxes = !this.view.getOrientationAxes();
    this.view.setOrientationAxes(orientationAxes);
    this.view.renderLater();
  }

  activateView() {
    this.props.proxyManager.setActiveView(this.view);
  }

  resize() {
    this.view.resize();
  }

  render() {
    return (
      <div
        className={
          this.props.proxyManager.getActiveView() === this.view
            ? style.activeRenderWindowContainer
            : style.renderWindowContainer
        }
        onClick={this.activateView}
      >
        <div className={style.renderWindowToolbar}>
          <Button
            className={style.rwToolbarButton}
            onClick={this.view.openCaptureImage}
          >
            <FaIcon type="camera" />
          </Button>
          <label className={style.renderWindowTitle}>{this.props.title}</label>
          <section className={style.renderWindowActions}>
            <Button
              className={style.rwToolbarButton}
              onClick={this.toggleOrientationMarker}
            >
              <FaIcon type="globe" />
            </Button>
            <Button
              className={style.rwToolbarButton}
              onClick={this.view.resetCamera}
            >
              <FaIcon type="expand" />
            </Button>
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

Layout3D.propTypes = {
  title: PropTypes.string,
  proxyManager: PropTypes.object,
  className: PropTypes.string,
  activateOnMount: PropTypes.bool,
  axis: PropTypes.number,
  orientation: PropTypes.number,
  viewUp: PropTypes.array,
};

Layout3D.defaultProps = {
  title: 'View 3D',
  proxyManager: null,
  className: '',
  activateOnMount: false,
  axis: 2,
  orientation: 1,
  viewUp: [0, -1, 0],
};
