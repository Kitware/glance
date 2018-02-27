import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'antd';

import vtkSlider from 'vtk.js/Sources/Interaction/UI/Slider';

import style from './vtk-layout.mcss';

const COLOR_BY_AXIS = ['yellow', 'red', 'green'];

export default class Layout2D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliceSliderVisible: false,
    };

    // Setup vtk.js objects
    this.activeRepresentation = null;
    this.view = props.proxyManager.createProxy('Views', props.viewType);
    this.view.updateOrientation(props.axis, props.orientation, props.viewUp);
    this.subscriptions = [];

    // Slider
    this.slider = vtkSlider.newInstance();
    this.slider.onValueChange((sliceValue) => {
      if (this.activeRepresentation) {
        this.activeRepresentation.setSlice(Number(sliceValue));
        this.props.proxyManager.modified();
        this.props.proxyManager.renderAllViews();
      }
    });

    // Bind callbacks
    this.onActiveSourceChange = this.onActiveSourceChange.bind(this);
    this.rotate = this.rotate.bind(this);
    this.toggleOrientationMarker = this.toggleOrientationMarker.bind(this);
    this.updateOrientation = this.updateOrientation.bind(this);
    this.activateView = this.activateView.bind(this);
    this.flush = () => this.forceUpdate();

    // Subscribe bind function
    this.subscriptions = [
      this.props.proxyManager.onActiveSourceChange(this.onActiveSourceChange),
      this.props.proxyManager.onActiveViewChange(this.flush),
    ];
  }

  componentDidMount() {
    this.onActiveSourceChange();

    this.view.setContainer(this.container);
    this.slider.setContainer(this.sliderContainer);

    this.view.resetCamera();
    this.view.resize();
    window.addEventListener('resize', this.view.resize);
    this.view.resetCamera();

    setTimeout(this.view.resize, 500);

    if (this.props.activateOnMount) {
      this.activateView();
    }

    // set mousedown capture on containers after view.setContainer.
    this.container.addEventListener('mousedown', this.activateView, true);
    this.sliderContainer.addEventListener('mousedown', this.activateView, true);
  }

  componentWillUnmount() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
    if (this.repSubscription) {
      this.repSubscription.unsubscribe();
      this.repSubscription = null;
    }
    window.removeEventListener('resize', this.view.resize);
    this.view.setContainer(null);
    this.props.proxyManager.deleteProxy(this.view);
  }

  onActiveSourceChange() {
    const activeSource = this.props.proxyManager.getActiveSource();
    const newRep = this.props.proxyManager.getRepresentation(
      activeSource,
      this.view
    );
    if (
      this.repSubscription &&
      this.activeRepresentation &&
      this.activeRepresentation !== newRep
    ) {
      this.repSubscription.unsubscribe();
      this.repSubscription = null;
    }
    if (newRep) {
      this.activeRepresentation = newRep;
      this.repSubscription = newRep.onModified(() => {
        if (this.activeRepresentation && this.activeRepresentation.getSlice) {
          this.slider.setValue(Number(this.activeRepresentation.getSlice()));
          this.view.updateCornerAnnotation({
            slice: Number(this.activeRepresentation.getSlice()).toFixed(2),
          });
        }
        if (
          this.activeRepresentation &&
          this.activeRepresentation.getColorWindow
        ) {
          this.view.updateCornerAnnotation({
            colorWindow: Math.round(this.activeRepresentation.getColorWindow()),
            colorLevel: Math.round(this.activeRepresentation.getColorLevel()),
          });
        }
      });
    }

    if (this.activeRepresentation && this.activeRepresentation.getColorWindow) {
      this.view.updateCornerAnnotation({
        colorWindow: Math.round(this.activeRepresentation.getColorWindow()),
        colorLevel: Math.round(this.activeRepresentation.getColorLevel()),
      });
    }
    this.updateSlider();

    // update slider visibility based on current active source/representation
    this.setState({
      sliceSliderVisible: newRep && newRep.getSlice,
    });
  }

  updateSlider() {
    if (this.activeRepresentation && this.activeRepresentation.getSlice) {
      const {
        min,
        max,
        step,
      } = this.activeRepresentation.getPropertyDomainByName('slice');
      this.slider.generateValues(min, max, 1 + (max - min) / step);
      this.slider.setValue(Number(this.activeRepresentation.getSlice()));
      this.view.updateCornerAnnotation({
        slice: Number(this.activeRepresentation.getSlice()).toFixed(2),
      });
    }
  }

  updateOrientation(e) {
    const state = this.props.orientations[Number(e.target.dataset.index)];
    this.view.updateOrientation(state.axis, state.orientation, state.viewUp);
    const reps = this.view.getRepresentations();
    for (let i = 0; i < reps.length; i++) {
      if (reps[i].setSlicingMode) {
        reps[i].setSlicingMode('XYZ'[state.axis]);
      }
    }
    this.onActiveSourceChange();
    this.props.proxyManager.modified();
    this.view.resetCamera();
    this.view.renderLater();
    this.onActiveSourceChange();
    this.updateSlider();

    // Update control panel
    this.props.proxyManager.modified();

    // Update slider
    this.forceUpdate();
  }

  rotate() {
    this.view.rotate(90);
  }

  toggleOrientationMarker() {
    const orientationAxes = !this.view.getOrientationAxes();
    this.view.setOrientationAxes(orientationAxes);
    this.view.renderLater();
  }

  activateView() {
    this.view.activate();
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
            size="small"
            icon="camera-o"
            onClick={this.view.openCaptureImage}
          />
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
              icon="global"
              onClick={this.toggleOrientationMarker}
            />
            <Button
              size="small"
              icon="compass"
              onClick={this.rotate}
              style={{ marginRight: '5px' }}
            />
            <Button size="small" icon="scan" onClick={this.view.resetCamera} />
          </section>
        </div>
        <div className={style.splitRow}>
          <div
            className={style.sideBar}
            style={{
              background: COLOR_BY_AXIS[this.view.getAxis()],
              visibility: this.state.sliceSliderVisible ? 'visible' : 'hidden',
            }}
            ref={(c) => {
              this.sliderContainer = c;
            }}
          />
          <div
            className={`${style.renderWindow} ${this.props.className}`}
            ref={(c) => {
              this.container = c;
            }}
          />
        </div>
      </div>
    );
  }
}

Layout2D.propTypes = {
  proxyManager: PropTypes.object,
  title: PropTypes.string,
  className: PropTypes.string,
  axis: PropTypes.number,
  orientation: PropTypes.number,
  viewUp: PropTypes.array,
  orientations: PropTypes.array,
  activateOnMount: PropTypes.bool,
  viewType: PropTypes.string,
};

Layout2D.defaultProps = {
  viewType: 'View2D',
  title: 'View 2D',
  proxyManager: null,
  className: '',
  axis: 2,
  orientation: 1,
  viewUp: [0, -1, 0],
  orientations: [
    { label: 'X', axis: 0, orientation: 1, viewUp: [0, -1, 0] },
    { label: 'Y', axis: 1, orientation: 1, viewUp: [0, 0, 1] },
    { label: 'Z', axis: 2, orientation: 1, viewUp: [0, -1, 0] },
  ],
  activateOnMount: false,
};
