import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Icon } from 'antd';

import FileLoader from './FileLoader';
import Informations from './Informations';
import PipelineEditor from './PipelineEditor';

import style from '../pv-explorer.mcss';

const { TabPane } = Tabs;

// ----------------------------------------------------------------------------
// Module configuration
// ----------------------------------------------------------------------------

const PANEL_TABS = {};

export function registerControlTab(
  name,
  reactClass,
  priority,
  icon,
  active = false
) {
  PANEL_TABS[name] = { reactClass, priority, icon, active };
}

export function unregisterControlTab(name) {
  delete PANEL_TABS[name];
}

export function listControlTabs() {
  const namePriorityList = Object.keys(PANEL_TABS).map((name) => [
    name,
    PANEL_TABS[name].priority,
  ]);
  namePriorityList.sort((a, b) => b[1] - a[1]);
  return namePriorityList.map((list) => list[0]);
}

export function getDefaultActiveTab() {
  return (
    Object.keys(PANEL_TABS).find((name) => PANEL_TABS[name].active) ||
    listControlTabs()[0]
  );
}

// ----------------------------------------------------------------------------
// Fill with default setup
// ----------------------------------------------------------------------------

registerControlTab('pipeline', PipelineEditor, 10, 'share-alt');
registerControlTab('files', FileLoader, 5, 'file-text', true); // Default active one
registerControlTab('informations', Informations, 0, 'info');

// ----------------------------------------------------------------------------
// Tab control panel
// ----------------------------------------------------------------------------

export default class ContolPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: getDefaultActiveTab(),
    };

    // Closure for callback
    this.changeTabTo = this.changeTabTo.bind(this);
  }

  changeTabTo(tab) {
    this.setState({ tab });
  }

  render() {
    return (
      <Tabs
        activeKey={this.state.tab}
        size="small"
        className={style.compactTabs}
        onChange={this.changeTabTo}
      >
        {listControlTabs().map((controlName) => {
          const panel = PANEL_TABS[controlName];
          const Renderer = panel.reactClass;
          return (
            <TabPane
              tab={<Icon type={panel.icon} style={{ marginRight: '0' }} />}
              key={controlName}
              forceRender
            >
              <Renderer
                proxyManager={this.props.proxyManager}
                updateTab={this.changeTabTo}
              />
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

ContolPanel.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};

ContolPanel.defaultProps = {};
