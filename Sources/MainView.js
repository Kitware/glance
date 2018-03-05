import 'antd/dist/antd.css';

import React from 'react';
import PropTypes from 'prop-types';

import { Layout, Menu, Progress } from 'antd';

import Layouts from './layouts';
import LayoutConfig from './config/glanceLayoutConfig';
import style from './pv-explorer.mcss';
import icons from './icons';

import Controls from './controls';

const { Header, Sider, Content } = Layout;

const { LayoutGrid } = Layouts;

const layouts = ['2D', '3D', 'Split', 'Quad'];

const WIDTH = 300;

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

  onLayoutChange({ item, key, selectedKeys }) {
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
        <Progress
          type="circle"
          width={50}
          percent={this.state.progressPercent}
        />
      );
    }

    return (
      <Layout>
        <Header className={style.toolbar}>
          <div className={style.logo} onClick={this.onToggleControl}>
            <img alt="logo" src={icons.Logo} />
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[this.state.layout]}
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
        </Header>
        <Layout>
          <Sider
            className={style.sideBar}
            width={WIDTH}
            collapsedWidth={0}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <Controls
              ref={(c) => {
                this.controls = c;
              }}
              proxyManager={this.props.proxyManager}
            />
          </Sider>
          <Layout>
            <Content className={style.workspace}>
              <LayoutGrid
                proxyManager={this.props.proxyManager}
                className={style.content}
                initialConfig={LayoutConfig}
                layout={this.state.layout}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

MainView.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};

MainView.defaultProps = {};
