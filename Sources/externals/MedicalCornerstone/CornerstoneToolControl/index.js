import React from 'react';
import PropTypes from 'prop-types';

import * as cornerstoneTools from 'cornerstone-tools';

import vtkCornerstoneToolManager from '../CornerstoneToolManager';
import toolConfiguration from '../toolsConfig';
import valueFromMeasurement from './valueFromMeasurement';
import vtkCornerstoneImageLoader from '../CornerstoneImageLoader';
import { ToolTypes, MouseButtons } from '../Constants';

import UI from '../../../ui';

import style from './CornerstoneToolControl.mcss';

const { EVENTS } = cornerstoneTools;
const { parseImageId } = vtkCornerstoneImageLoader;
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
    this.gotoSlice = this.gotoSlice.bind(this);

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
    const { element } = ev.detail;

    const rendered = () => {
      element.removeEventListener(EVENTS.IMAGE_RENDERED, rendered);
      this.forceUpdate();
    };
    // defer update until after a render, since some tools
    // compute their measurement data in their render method
    element.addEventListener(EVENTS.IMAGE_RENDERED, rendered);
  }

  setMeasurementVisible(measurement, visible) {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    if (!view || !view.getContainer()) {
      return;
    }

    const element = view.getContainer();

    // use this to trigger a measurement modified event
    this.toolManager.setMeasurementData(
      element,
      measurement.type,
      measurement.data,
      {
        visible,
      }
    );

    view.getRenderer().render();
  }

  deleteMeasurement(measurement) {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    if (!view || !view.getContainer()) {
      return;
    }

    const element = view.getContainer();

    this.toolManager.deleteMeasurement(
      element,
      measurement.type,
      measurement.data
    );

    view.getRenderer().render();
  }

  gotoSlice(sliceIndex) {
    const view = this.props.proxyManager.getProxyById(this.state.viewProxyId);
    if (view) {
      view
        .getRenderer()
        .getRepresentation()
        .setSlice(sliceIndex);
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

    const measurements = [];
    if (view && view.getContainer()) {
      const element = view.getContainer();
      const stateManager = cornerstoneTools.getElementToolStateManager(element);

      if (
        stateManager !== cornerstoneTools.globalImageIdSpecificToolStateManager
      ) {
        const getSliceIndex = (imageId) => {
          const { params } = parseImageId(imageId);
          return params.slice;
        };

        const toolState = stateManager.getToolState();
        Object.values(toolState).forEach((states) => {
          Object.keys(states).forEach((toolType) => {
            states[toolType].data.forEach((item) =>
              measurements.push({
                key: item.metadata.measurementId,
                type: item.metadata.toolType,
                sliceIndex: getSliceIndex(item.metadata.imageId),
                icon: this.toolManager.getTool(item.metadata.toolType).config
                  .icon,
                value: valueFromMeasurement(item.metadata.toolType, item),
                visible: item.visible,
                data: item,
              })
            );
          });
        });
      }

      measurements.sort(
        (a, b) => a.data.metadata.measurementId > b.data.metadata.measurementId
      );
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
        key: 'gotoSlice',
        label: <FaIcon type="external-link-alt" title="Goto slice" />,
        dataKey: 'gotoSlice',
        render: (_, row) => (
          <button
            className={style.centeredControl}
            title="Goto slice"
            onClick={() => this.gotoSlice(row.sliceIndex)}
          >
            <FaIcon type="external-link-alt" />
          </button>
        ),
        columnClass: style.iconColumn,
      },
      {
        key: 'eye',
        label: <FaIcon type="eye" title="Visibility" />,
        dataKey: 'visible',
        render: (visible, row) => (
          <input
            className={style.centeredControl}
            type="checkbox"
            checked={visible}
            title="Visbility"
            onChange={(ev) =>
              this.setMeasurementVisible(row, ev.target.checked)
            }
          />
        ),
        columnClass: style.iconColumn,
      },
      {
        key: 'trash',
        dataKey: 'trash',
        label: <FaIcon type="trash" title="Delete" />,
        render: (_, row) => (
          <button
            className={style.centeredControl}
            title="Delete"
            onClick={() => this.deleteMeasurement(row)}
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
