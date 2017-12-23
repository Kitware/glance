import 'antd/dist/antd.css';

import React from 'react';
// import PropTypes from 'prop-types';

import GitTreeWidget from 'paraviewweb/src/React/Widgets/GitTreeWidget';
import ProxyEditorWidget from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';

import { Layout, Menu } from 'antd';

import FileLoader from './io/FileLoader';
import Layouts from './layouts';
import style from './pv-explorer.mcss';
import icons from './icons';
import vtkPipelineManager from './pipeline/PipelineManager';
import vtkSource from './pipeline/Source';

const { Header, Sider, Content } = Layout;

const layouts = [
  'Layout2D',
  'Layout3D',
  'LayoutSplit',
  'LayoutQuad',
];

const WIDTH = 300;

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: 'Layout3D',
      overlayOpacity: 100,
      collapsed: false,
    };

    this.pipelineManager = vtkPipelineManager.newInstance();
    this.pipelineManager.onModified(() => {
      setTimeout(this.forceUpdate, 0);
    });

    // Closure for callback
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onToggleControl = this.onToggleControl.bind(this);
    this.onOverlayOpacityChange = this.onOverlayOpacityChange.bind(this);
    this.loadFile = this.loadFile.bind(this);

    this.onGitChange = this.onGitChange.bind(this);
    this.onApply = this.onApply.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
  }

  onLayoutChange({ item, key, selectedKeys }) {
    this.setState({ layout: key }, this.forceUpdate);
  }

  onToggleControl() {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
    setTimeout(this.pipelineManager.resizeViews, 0);
    setTimeout(this.pipelineManager.resizeViews, 500);
  }

  onOverlayOpacityChange(e) {
    const overlayOpacity = e.target.value;
    this.setState({ overlayOpacity });
  }

  onGitChange(e) {
    if (e.type === 'visibility') {
      const { id, visible } = e.changeSet[0];
      const view = this.pipelineManager.getActiveView();
      const rep = this.pipelineManager.getRepresentation(id, view);
      rep.setVisibility(visible);
    } else if (e.type === 'delete') {
      const sourceId = (e.changeSet[0].id);
      this.pipelineManager.removeSource(sourceId);
    } else if (e.type === 'active') {
      this.pipelineManager.setActiveSourceId(e.changeSet[0].id);
    }
    this.pipelineManager.renderLaterViews();
    this.forceUpdate();
  }

  onApply(e) {
    this.pipelineManager.applyChanges(e);
  }

  loadFile() {
    FileLoader.openFile(['vti', 'vtp'], (file) => {
      FileLoader.loadFile(file)
        .then((reader) => {
          const source = vtkSource.newInstance();
          source.setInput(reader);
          source.setName(file.name);
          this.pipelineManager.addSource(source);
          this.pipelineManager.addSourceToViews(source.getProxyId());

          if (this.pipelineManager.getNumberOfSources() === 1) {
            this.pipelineManager.resetCameraViews();
          }

          this.forceUpdate();
        });
    });
  }

  render() {
    const Renderer = Layouts[this.state.layout];
    const actives = this.pipelineManager.getActiveSourceId() ? [`${this.pipelineManager.getActiveSourceId()}`] : [];
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
            width={WIDTH}
            collapsedWidth={0}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className={style.pipeline}>
              <GitTreeWidget
                nodes={this.pipelineManager.listSources()}
                actives={actives}
                onChange={this.onGitChange}
                width={WIDTH}
                enableDelete
              />
            </div>
            <ProxyEditorWidget
              sections={this.pipelineManager.getSections()}
              onCollapseChange={this.pipelineManager.updateCollapseState}
              onApply={this.onApply}
            />
          </Sider>
          <Layout>
            <Content>
              <Renderer pipelineManager={this.pipelineManager} className={style.content} />
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
