import 'antd/dist/antd.css';

import React from 'react';
// import PropTypes from 'prop-types';

import { Layout, Menu, Collapse, List } from 'antd';

import FileLoader from './io/FileLoader';
import Layouts from './layouts';
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
      scene: [],
    };

    // Closure for callback
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onToggleControl = this.onToggleControl.bind(this);
    this.onOverlayOpacityChange = this.onOverlayOpacityChange.bind(this);
    this.updateActive = this.updateActive.bind(this);
    this.loadFile = this.loadFile.bind(this);
  }

  onLayoutChange({ item, key, selectedKeys }) {
    this.setState({ layout: key });
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

  loadFile() {
    FileLoader.openFile(['vti', 'vtp'], (file) => {
      FileLoader.loadFile(file)
        .then((source) => {
          const id = this.state.scene.length + 1;
          const scene = this.state.scene.concat({
            id,
            name: file.name,
            source,
          });
          this.setState({ scene });
        });
    });
  }

  render() {
    const Renderer = Layouts[this.state.layout];
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
            defaultSelectedKeys={[this.state.layout]}
            onSelect={this.onLayoutChange}
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

          <img
            onClick={this.loadFile}
            alt="action-load"
            className={style.toolbarIcon}
            src={icons.ActionLoad}
          />
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
          <Layout>
            <Content>
              <Renderer scene={this.state.scene} className={style.content} />
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
