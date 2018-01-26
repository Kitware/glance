import 'antd/dist/antd.css';

import React from 'react';
import PropTypes from 'prop-types';

import { Layout, Menu, Tabs, Icon } from 'antd';

import Layouts from './layouts';
import style from './pv-explorer.mcss';
import icons from './icons';

import FileLoader from './controls/FileLoader';
import Informations from './controls/Informations';
import PipelineEditor from './controls/PipelineEditor';

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

    this.props.proxyManager.onModified(() => {
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
    this.props.proxyManager.resizeAllViews();
  }

  onTabChange(tab) {
    this.setState({ tab });
  }

  onLayoutChange({ item, key, selectedKeys }) {
    this.setState({ layout: key }, () => {
      this.forceUpdate();
      this.props.proxyManager.createRepresentationInAllViews();
    });
  }

  onToggleControl() {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed }, this.props.proxyManager.resizeAllViews);
    setTimeout(this.props.proxyManager.resizeAllViews, 500);
    setTimeout(this.forceUpdate, 500);
  }

  onGitChange(e) {
    const { id } = e.changeSet[0];
    const source = this.props.proxyManager.getProxyById(id);
    if (e.type === 'visibility') {
      const { visible } = e.changeSet[0];
      const view = this.props.proxyManager.getActiveView();
      const rep = this.props.proxyManager.getRepresentation(source, view);
      rep.setVisibility(visible);
    } else if (e.type === 'delete') {
      this.props.proxyManager.deleteProxy(source);
    } else if (e.type === 'active') {
      this.props.proxyManager.setActiveSource(source);
    }
    this.props.proxyManager.renderAllViews();
    this.forceUpdate();
  }

  onApply(e) {
    this.props.proxyManager.applyChanges(e);
  }

  render() {
    const Renderer = Layouts[this.state.layout];
    const activeSource = this.props.proxyManager.getActiveSource();
    const actives = activeSource ? [activeSource.getProxyId()] : [];
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
                  proxyManager={this.props.proxyManager}
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
                  proxyManager={this.props.proxyManager}
                  updateTab={this.onTabChange}
                />
              </TabPane>
              <TabPane
                tab={<Icon type="info" style={{ marginRight: '0' }} />}
                key="informations"
              >
                <Informations proxyManager={this.props.proxyManager} />
              </TabPane>
            </Tabs>
          </Sider>
          <Layout>
            <Content className={style.workspace}>
              <Renderer
                proxyManager={this.props.proxyManager}
                className={style.content}
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
