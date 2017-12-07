import 'antd/dist/antd.css';

import React from 'react';
// import PropTypes from 'prop-types';

import { Layout, Menu, Collapse, List } from 'antd';

import style from './pv-explorer.mcss';
import icons from './icons';

const { Header, Sider, Content } = Layout;
const Panel = Collapse.Panel;

const layouts = [
  'Layout2D',
  'Layout3D',
  'LayoutSplit',
  'LayoutQuad',
];

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: 'Layout2D',
      overlayOpacity: 100,
      collapsed: false,
      scene: [
        { name: 'Volume 1', active: true },
        { name: 'Volume 2' },
        { name: 'Annotation' },
      ],
    };

    // Closure for callback
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onToggleControl = this.onToggleControl.bind(this);
    this.onOverlayOpacityChange = this.onOverlayOpacityChange.bind(this);
    this.updateActive = this.updateActive.bind(this);
  }

  onLayoutChange(e) {
    let el = e.target;
    while (!el.dataset.name) {
      el = el.parentNode;
    }
    const layout = el.dataset.name;
    console.log(layout, e.target);
    this.setState({ layout });
  }

  onToggleControl() {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  }

  onOverlayOpacityChange(e) {
    const overlayOpacity = e.target.value;
    this.setState({ overlayOpacity });
  }

  updateActive(e) {
    console.log(this);
    console.log('onClick', e);
  }

  render() {
    return (
      <Layout>
        <Header className={style.toolbar}>
          <div className={style.logo} onClick={this.onToggleControl}>
            <img
              alt="logo"
              src={icons.Logo}
            />
          </div>

          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['Layout2D']}
            className={style.toolbar}
          >
            {layouts.map(name => (
              <Menu.Item
                key={name}
                data-name={name}
              >
                <img alt={name} className={style.toolbarIcon} src={icons[name]} />
              </Menu.Item>
            ))}
          </Menu>
        </Header>
        <Layout>
          <Sider
            className={style.sideBar}
            width={250}
            collapsedWidth={0}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className={style.padding}>
              <Collapse bordered={false} defaultActiveKey={['scene']} className={style.collapseList}>
                <Panel header="Scene" key="scene">
                  <List
                    className={style.sceneListing}
                    size="small"
                    bordered
                    dataSource={this.state.scene}
                    renderItem={item => (
                      <List.Item
                        style={{ background: item.active ? '#1890ff' : 'white' }}
                        onClick={this.updateActive}
                      >{item.name}</List.Item>
                    )}
                  />
                </Panel>
                <Panel header="Edit" key="edit">
                  <p>b</p>
                </Panel>
              </Collapse>
            </div>
          </Sider>
          <Layout className={style.content}>
            <Content>
              Content
            </Content>
          </Layout>
        </Layout>
      </Layout>);
  }
}


MainView.propTypes = {
};

MainView.defaultProps = {
};

/*
 <img
            alt="action-load"
            height="30"
            src={icons.ActionLoad}
            className={style.button}
          />

          <input
            type="range"
            min="0"
            max="100"
            value={this.state.overlayOpacity}
            onChange={this.onOverlayOpacityChange}
          />
          <img
            alt="ActionResetWindowLevel"
            height="30"
            src={icons.ActionResetWindowLevel}
            className={style.button}
          />
          <img
            alt="ActionResetCamera"
            height="30"
            src={icons.ActionResetCamera}
            className={style.button}
          />
          */
