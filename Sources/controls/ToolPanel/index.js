import React from 'react';
import PropTypes from 'prop-types';

import UI from '../../ui';
import Tools from './Tools';

import style from './Tools.mcss';

const { Button, FaIcon } = UI;

export default class ToolPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabledTools: [],
    };

    this.tools = {};
    Tools.forEach((tool) => {
      this.tools[tool.name] = {
        config: tool,
        instance: null,
      };
    });
  }

  toggleTool(tool) {
    if (!(tool in this.tools)) {
      return;
    }

    const idx = this.state.enabledTools.indexOf(tool);
    const newState = idx === -1;
    const newEnabledTools = this.state.enabledTools.slice();

    if (newState) {
      const instance = this.tools[tool].config.class.newInstance({
        proxyManager: this.props.proxyManager,
      });
      if (instance.init()) {
        this.tools[tool].instance = instance;
        newEnabledTools.push(tool);
      }
    } else {
      this.tools[tool].instance.delete();
      this.tools[tool].instance = null;
      newEnabledTools.splice(idx, 1);
    }

    if (newEnabledTools.length !== this.state.enabledTools) {
      this.setState({ enabledTools: newEnabledTools });
    }
  }

  render() {
    const disabled = !this.props.proxyManager.getActiveSource();

    const toolButtons = Tools.map((tool) => (
      <div key={tool.name} className={style.toolButton}>
        <Button
          disabled={disabled}
          checked={this.state.enabledTools.indexOf(tool.name) > -1}
          onClick={() => this.toggleTool(tool.name)}
        >
          <FaIcon type={tool.icon} />
        </Button>
      </div>
    ));
    return (
      <div>
        <div>Tools</div>
        <div>{toolButtons}</div>
      </div>
    );
  }
}

ToolPanel.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};
