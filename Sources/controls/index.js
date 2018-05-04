import React from 'react';
import PropTypes from 'prop-types';

import 'rc-tabs/assets/index.css';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';

import UI from '../ui';
import FileLoader from './FileLoader';
import Filters from './Filters';
import Informations from './Informations';
import PipelineEditor from './PipelineEditor';

import style from '../pv-explorer.mcss';

const { FaIcon } = UI;

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
registerControlTab('files', FileLoader, 5, 'file-alt', true); // Default active one
registerControlTab('filters', Filters, 6, 'filter');
registerControlTab('informations', Informations, 0, 'info');

// ----------------------------------------------------------------------------
// Tab control panel
// ----------------------------------------------------------------------------

export default class ControlPanel extends React.Component {
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
        className={style.compactTabs}
        onChange={this.changeTabTo}
        renderTabBar={() => <ScrollableInkTabBar />}
        renderTabContent={() => <TabContent />}
      >
        {listControlTabs().map((controlName) => {
          const panel = PANEL_TABS[controlName];
          const Renderer = panel.reactClass;
          return (
            <TabPane
              className={style.tabPane}
              tab={<FaIcon type={panel.icon} style={{ marginRight: '0' }} />}
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

ControlPanel.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};

ControlPanel.defaultProps = {};
