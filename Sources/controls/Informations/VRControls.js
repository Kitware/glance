import React from 'react';
import PropTypes from 'prop-types';

import UI from '../../ui';
import style from './Informations.mcss';

const { Button } = UI;

const SETTINGS = [
  {
    label: 'Laptop',
    options: { vrResolution: [100, 100], hideInVR: false },
  },
  {
    label: 'Quarter Headset',
    options: { vrResolution: [540, 300], hideInVR: false },
  },
  {
    label: 'Half Headset',
    options: { vrResolution: [1080, 600], hideInVR: true },
  },
  {
    label: 'Full Headset',
    options: { vrResolution: [2160, 1200], hideInVR: true },
  },
];

export default class VRControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVREnabled: false,
      activeIndex: 0,
    };

    this.updateActiveView = this.updateActiveView.bind(this);
    this.toggleVR = this.toggleVR.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.increaseSize = this.increaseSize.bind(this);
    this.decreaseSize = this.decreaseSize.bind(this);

    this.subscriptions = [];
    this.subscriptions.push(
      props.proxyManager.onActiveViewChange(this.updateActiveView)
    );
  }

  componentDidMount() {
    this.updateActiveView();
  }

  componentWillUnmount() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubcribe();
    }
  }

  updateActiveView() {
    this.view = this.props.proxyManager.getActiveView();
  }

  toggleVR() {
    if (this.view) {
      const isVREnabled = !this.state.isVREnabled;
      this.setState({ isVREnabled });
      if (isVREnabled) {
        SETTINGS[0].options.vrResolution = this.view
          .getOpenglRenderWindow()
          .getSize();
        console.log('enable VR');
        this.view
          .getOpenglRenderWindow()
          .set(SETTINGS[this.state.activeIndex].options);
        this.view.getOpenglRenderWindow().startVR();
      } else {
        console.log('disable VR');
        this.view.getOpenglRenderWindow().stopVR();
        this.view.getInteractorStyle2D().resetCurrentManipulator();
        this.view.getInteractorStyle3D().resetCurrentManipulator();
        this.view.resetCamera();
      }
    } else {
      this.setState({ isVREnabled: false });
    }
  }

  updateSettings(e) {
    const activeIndex = Number(e.target.value);
    this.setState({ activeIndex });
  }

  increaseSize() {
    if (this.view) {
      this.view
        .getCamera()
        .setPhysicalScale(this.view.getCamera().getPhysicalScale() * 2);
    }
  }

  decreaseSize() {
    if (this.view) {
      this.view
        .getCamera()
        .setPhysicalScale(this.view.getCamera().getPhysicalScale() / 2);
    }
  }

  render() {
    if (!navigator.getVRDisplays) {
      return null;
    }
    return (
      <div className={style.vrControls}>
        <Button
          shape="circle"
          size="small"
          icon="plus"
          onClick={this.increaseSize}
        />
        <Button
          shape="circle"
          size="small"
          icon="minus"
          onClick={this.decreaseSize}
        />
        <select value={this.state.activeIndex} onChange={this.updateSettings}>
          {SETTINGS.map((e, idx) => (
            <option key={e.label} value={idx}>
              {e.label}
            </option>
          ))}
        </select>
        <Button
          type={this.state.isVREnabled ? 'primary' : ''}
          shape="circle"
          size="small"
          icon={this.state.isVREnabled ? 'poweroff' : 'login'}
          onClick={this.toggleVR}
        />
      </div>
    );
  }
}

VRControl.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};

VRControl.defaultProps = {};
