import React from 'react';
import PropTypes from 'prop-types';

import vtkCornerstoneToolManager from '../CornerstoneToolManager';
import toolConfiguration from '../toolsConfig';

import UI from '../../../ui';
import { ToolTypes, MouseButtons } from '../Constants';

import style from './CornerstoneToolControl.mcss';

const { Button, FaIcon } = UI;

export default class CornerstoneToolControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewProxyId: -1,
      // active left mouse button tool
      activeTool: '',
    };

    this.views = [];
    this.unsubscribes = [];

    this.toolManager = vtkCornerstoneToolManager.newInstance({
      toolConfiguration,
    });

    this.onViewChanged = this.onViewChanged.bind(this);

    // set active tool to whatever is default for left mouse button
    if (
      toolConfiguration.defaults &&
      toolConfiguration.defaults[ToolTypes.Mouse]
    ) {
      this.state.activeTool =
        toolConfiguration.defaults[ToolTypes.Mouse][MouseButtons.Left] || '';
    }
  }

  componentDidMount() {
    this.views = this.props.proxyManager
      .getViews()
      .filter((view) => view.getClassName() === 'vtkCornerstoneViewProxy');

    this.views.forEach((view) => {
      view.setToolManager(this.toolManager);
    });

    this.unsubscribes = [
      this.props.proxyManager.onActiveViewChange(this.onViewChanged),
    ];

    this.onViewChanged(this.props.proxyManager.getActiveView());
  }

  onViewChanged(view) {
    if (this.views.indexOf(view) !== -1) {
      this.setState({ viewProxyId: view.getProxyId() });
    } else {
      this.setState({ viewProxyId: -1 });
    }
  }

  toggleTool(name) {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    if (!view || !view.getContainer()) {
      return;
    }

    if (this.state.activeTool) {
      // only unbind left button binding
      this.toolManager.deactivateTool(this.state.activeTool, {
        binding: MouseButtons.Left,
      });
    }

    if (this.state.activeTool !== name) {
      // only bind to left mouse button
      this.toolManager.activateTool(name, {
        binding: MouseButtons.Left,
      });
      this.setState({ activeTool: name });
    } else {
      this.setState({ activeTool: '' });
    }
  }

  render() {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    const forceDisable =
      !view || !view.getContainer() || !view.getRenderer().getRepresentation();

    const tools = this.toolManager.getTools() || {};
    const toolButtons = Object.keys(tools)
      // only display buttons that are left mouse button only
      .filter((name) => tools[name].config.binding === MouseButtons.Left)
      .map((name) => {
        const config = tools[name].config;
        const checked = this.state.activeTool === name && !forceDisable;
        return (
          <div className={style.toolButton} key={name}>
            <Button
              checked={checked}
              disabled={forceDisable}
              onClick={() => this.toggleTool(name)}
            >
              <FaIcon type={config.icon} />
            </Button>
          </div>
        );
      });

    return (
      <div>
        <div className={style.toolButtons}>{toolButtons}</div>
      </div>
    );
  }
}

CornerstoneToolControl.propTypes = {
  proxyManager: PropTypes.object,
};

CornerstoneToolControl.defaultProps = {
  proxyManager: null,
};
