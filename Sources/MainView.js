import 'normalize.css/normalize.css';

import React from 'react';
import PropTypes from 'prop-types';

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Configs from './config';
import UI from './ui';
import Layouts from './layouts';
import style from './pv-explorer.mcss';
import icons from './icons';

import AboutPage from './AboutPage';
import Controls from './controls';

const { Progress, Menu, FaIcon, TitleModal } = UI;
const { LayoutGrid } = Layouts;

const layouts = ['2D', '3D', 'Split', 'Quad'];
const { ProgressContainer } = Progress;

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: '3D',
      collapsed: false,
      showAboutPage: false,
    };

    // Closure for callback
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onToggleControl = this.onToggleControl.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    const { remoteControl } = this.props;
    remoteControl.addTrigger('toggleControl', this.onToggleControl);
    remoteControl.addTrigger('changeTabTo', this.controls.changeTabTo);
  }

  componentWillUnmount() {
    const { remoteControl } = this.props;
    remoteControl.delTrigger('toggleControl');
    remoteControl.delTrigger('changeTabTo');
  }

  onLayoutChange(key) {
    this.setState({ layout: key });
  }

  onToggleControl() {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed }, this.props.proxyManager.resizeAllViews);
    setTimeout(this.props.proxyManager.resizeAllViews, 500);
    setTimeout(this.forceUpdate, 500);
  }

  render() {
    return (
      <div className={[style.vertContainer, 'paraview-glance-root'].join(' ')}>
        <ProgressContainer color="#997fef" minPercent={5} />
        <div className={style.toolbar}>
          <div className={style.logo} onClick={this.onToggleControl}>
            <img alt="logo" src={icons.Logo} />
          </div>
          <Menu
            horizontal
            selectedKey={this.state.layout}
            onSelect={this.onLayoutChange}
          >
            {layouts.map((name) => (
              <Menu.Item key={name} data-name={name}>
                <img
                  alt={name}
                  className={style.toolbarIcon}
                  src={icons[`Layout${name}`]}
                />
              </Menu.Item>
            ))}
          </Menu>
          <div className={style.toolbarButtons}>
            <button
              className={style.toolbarButton}
              title="About"
              onClick={() => this.setState({ showAboutPage: true })}
            >
              <FaIcon type="question-circle" />
            </button>
          </div>
        </div>
        <div className={style.horizContainer}>
          <div
            className={[
              style.appSideBar,
              style.sideBar,
              this.state.collapsed
                ? style.appSideBarCollapsed
                : style.appSideBarVisible,
            ].join(' ')}
          >
            <Controls
              ref={(c) => {
                this.controls = c;
              }}
              proxyManager={this.props.proxyManager}
            />
          </div>
          <div className={[style.vertContainer, style.noOverflow].join(' ')}>
            <div className={style.workspace}>
              <LayoutGrid
                proxyManager={this.props.proxyManager}
                className={style.content}
                initialConfig={Configs[this.props.mode].Layout}
                layout={this.state.layout}
              />
            </div>
          </div>
        </div>
        <TitleModal
          title="About Glance"
          isOpen={this.state.showAboutPage}
          onRequestClose={() => this.setState({ showAboutPage: false })}
          shouldCloseOnOverlayClick
        >
          <AboutPage />
        </TitleModal>
        <ToastContainer
          position="top-right"
          autoClose={8000}
          transition={Slide}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable={false}
        />
      </div>
    );
  }
}

MainView.propTypes = {
  mode: PropTypes.string.isRequired,
  remoteControl: PropTypes.object.isRequired,
  proxyManager: PropTypes.object.isRequired,
};

MainView.defaultProps = {};
