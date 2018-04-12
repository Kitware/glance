import React from 'react';
import PropTypes from 'prop-types';

import { EVENTS } from 'cornerstone-tools';

import vtkCornerstoneToolManager from '../CornerstoneToolManager';
import toolConfiguration from '../toolsConfig';

import UI from '../../../ui';
import { ToolTypes, MouseButtons } from '../Constants';
import valueFromMeasurement from './valueFromMeasurement';

import style from './CornerstoneToolControl.mcss';

const { Table, Button, FaIcon } = UI;

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
    this.onMeasurementChanged = this.onMeasurementChanged.bind(this);
    this.setMeasurementVisible = this.setMeasurementVisible.bind(this);
    this.deleteMeasurement = this.deleteMeasurement.bind(this);

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
      this.toolManager.onMeasurementAdded(this.onMeasurementChanged),
      this.toolManager.onMeasurementRemoved(this.onMeasurementChanged),
      this.toolManager.onMeasurementModified(this.onMeasurementChanged),
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

  onMeasurementChanged(ev) {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    if (!view || !view.getContainer() || ev.target !== view.getContainer()) {
      return;
    }

    const element = view.getContainer();

    const rendered = () => {
      element.removeEventListener(EVENTS.IMAGE_RENDERED, rendered);
      // rendered state is external in cornerstone
      this.forceUpdate();
    };
    element.addEventListener(EVENTS.IMAGE_RENDERED, rendered);
  }

  setMeasurementVisible(toolName, measurementIndex, visible) {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    if (!view || !view.getContainer()) {
      return;
    }

    const element = view.getContainer();

    this.toolManager.setMeasurementData(element, toolName, measurementIndex, {
      visible,
    });

    view.getRenderer().render();
    this.forceUpdate();
  }

  deleteMeasurement(toolName, measurementIndex) {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    if (!view || !view.getContainer()) {
      return;
    }

    const element = view.getContainer();

    this.toolManager.deleteMeasurement(element, toolName, measurementIndex);

    view.getRenderer().render();
    this.forceUpdate();
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

    const measurements = [];
    if (view && view.getContainer()) {
      const element = view.getContainer();
      const toolMeasurements = this.toolManager.getMeasurements(element);

      Object.keys(toolMeasurements).forEach((toolName) => {
        toolMeasurements[toolName].forEach((measurement, index) => {
          measurements.push({
            key: `${toolName}::${index}`,
            index,
            type: toolName,
            visible: measurement.visible,
            icon: this.toolManager.getTool(toolName).config.icon,
            value: valueFromMeasurement(toolName, measurement),
          });
        });
      });
    }

    const tableColumns = [
      {
        key: 'type',
        label: <FaIcon type="wrench" />,
        dataKey: 'icon',
        render: (icon) => (
          <div>
            <FaIcon type={icon} />
          </div>
        ),
        columnClass: style.iconColumn,
      },
      {
        key: 'value',
        label: 'Value',
        dataKey: 'value',
        resizable: true,
      },
      {
        key: 'eye',
        label: <FaIcon type="eye" />,
        dataKey: 'visible',
        render: (visible, row) => (
          <input
            className={style.centeredControl}
            type="checkbox"
            checked={visible}
            onChange={(ev) =>
              this.setMeasurementVisible(row.type, row.index, ev.target.checked)
            }
          />
        ),
        columnClass: style.iconColumn,
      },
      {
        key: 'trash',
        dataKey: 'trash',
        label: <FaIcon type="trash" />,
        render: (_, row) => (
          <button
            className={style.centeredControl}
            onClick={() => this.deleteMeasurement(row.type, row.index)}
          >
            <FaIcon type="trash" />
          </button>
        ),
        columnClass: style.iconColumn,
      },
    ];

    return (
      <div className={style.container}>
        <div className={style.toolButtons}>{toolButtons}</div>
        <Table
          className={style.toolTable}
          columns={tableColumns}
          data={measurements}
        />
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
