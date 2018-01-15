import 'antd/dist/antd.css';

import React from 'react';
// import PropTypes from 'prop-types';

import { Layout, Menu, Tabs, Icon } from 'antd';

import Layouts from './layouts';
import style from './pv-explorer.mcss';
import icons from './icons';
import vtkPipelineManager from './pipeline/PipelineManager';

import PipelineEditor from './controls/PipelineEditor';
import FileLoader from './controls/FileLoader';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

const layouts = ['Layout2D', 'Layout3D', 'LayoutSplit', 'LayoutQuad'];

const WIDTH = 300;

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: 'Layout3D',
      overlayOpacity: 100,
      collapsed: false,
      tab: 'files',
    };

    this.pipelineManager = vtkPipelineManager.newInstance();
    this.pipelineManager.onModified(() => {
      setTimeout(this.forceUpdate, 0);
    });

    // Closure for callback
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onToggleControl = this.onToggleControl.bind(this);
    this.onTabChange = this.onTabChange.bind(this);

    this.onGitChange = this.onGitChange.bind(this);
    this.onApply = this.onApply.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentDidUpdate() {
    this.pipelineManager.resizeViews();
  }

  onTabChange(tab) {
    this.setState({ tab });
  }

  onLayoutChange({ item, key, selectedKeys }) {
    this.setState({ layout: key }, this.forceUpdate);
  }

  onToggleControl() {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed }, this.pipelineManager.resizeViews);
    setTimeout(this.pipelineManager.resizeViews, 500);
    setTimeout(this.forceUpdate, 500);
  }

  onGitChange(e) {
    if (e.type === 'visibility') {
      const { id, visible } = e.changeSet[0];
      const view = this.pipelineManager.getActiveView();
      const rep = this.pipelineManager.getRepresentation(id, view);
      rep.setVisibility(visible);
    } else if (e.type === 'delete') {
      const sourceId = e.changeSet[0].id;
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

  render() {
    const Renderer = Layouts[this.state.layout];
    const actives = this.pipelineManager.getActiveSourceId()
      ? [`${this.pipelineManager.getActiveSourceId()}`]
      : [];
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
                  src={icons[name]}
                />
              </Menu.Item>
            ))}
          </Menu>

          <div />
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
            <Tabs
              activeKey={this.state.tab}
              size="small"
              className={style.compactTabs}
              onChange={this.onTabChange}
            >
              <TabPane
                tab={<Icon type="share-alt" style={{ marginRight: '0' }} />}
                key="pipeline"
                forceRender
              >
                <PipelineEditor
                  pipelineManager={this.pipelineManager}
                  actives={actives}
                  onGitChange={this.onGitChange}
                  onApply={this.onApply}
                />
              </TabPane>
              <TabPane
                tab={<Icon type="edit" style={{ marginRight: '0' }} />}
                key="annotations"
              >
                Annotations
              </TabPane>
              <TabPane
                tab={<Icon type="file-text" style={{ marginRight: '0' }} />}
                key="files"
              >
                <FileLoader
                  pipelineManager={this.pipelineManager}
                  updateTab={this.onTabChange}
                />
              </TabPane>
              <TabPane
                tab={<Icon type="info" style={{ marginRight: '0' }} />}
                key="informations"
              >
                Informations
              </TabPane>
            </Tabs>
          </Sider>
          <Layout>
            <Content className={style.workspace}>
              <Renderer
                pipelineManager={this.pipelineManager}
                className={style.content}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

MainView.propTypes = {};

MainView.defaultProps = {};
