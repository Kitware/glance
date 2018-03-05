import 'normalize.css/normalize.css';

import React from 'react';
import PropTypes from 'prop-types';

import 'rc-progress/assets/index.css';
import { Circle as Progress } from 'rc-progress';

import UI from './ui';
import Layouts from './layouts';
import LayoutConfig from './config/glanceLayoutConfig';
import style from './pv-explorer.mcss';
import icons from './icons';

import Controls from './controls';

const { Menu } = UI;
const { LayoutGrid } = Layouts;

const layouts = ['2D', '3D', 'Split', 'Quad'];

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: '3D',
      overlayOpacity: 100,
      collapsed: false,
      tab: 'files',
      showProgress: false,
      progressPercent: 0,
    };

    // Closure for callback
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onToggleControl = this.onToggleControl.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
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
    let progress = null;

    if (this.state.showProgress) {
      progress = (
        <div>
          <Progress
            strokeWidth={6}
            strokeLinecap="round"
            width={50}
            percent={this.state.progressPercent}
          />
          <span className={style.progressText}>
            {this.state.progressPercent}%
          </span>
        </div>
      );
    }

    return (
      <div className={style.vertContainer}>
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
          <div className={style.progressContainer}>{progress}</div>
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
                initialConfig={LayoutConfig}
                layout={this.state.layout}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MainView.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};

MainView.defaultProps = {};
