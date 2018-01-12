import React from 'react';
import PropTypes from 'prop-types';

import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';
import vtkPiecewiseGaussianWidget from 'vtk.js/Sources/Interaction/Widgets/PiecewiseGaussianWidget';

import { Menu, Dropdown } from 'antd';

import style from './ColorBy.mcss';

const EMPTY_ARRAY_STATE = {
  arrays: [],
  selectedArray: { name: '', location: '' },
  colorMap: null,
};

const WORKING_CANVAS = document.createElement('canvas');
WORKING_CANVAS.setAttribute('width', 300);
WORKING_CANVAS.setAttribute('height', 1);

function getLookupTableImage(lut, min, max, width) {
  WORKING_CANVAS.setAttribute('width', width);
  const ctx = WORKING_CANVAS.getContext('2d');
  const rawData = lut.getUint8Table(min, max, width, true);
  const pixelsArea = ctx.getImageData(0, 0, width, 1);
  pixelsArea.data.set(rawData);
  ctx.putImageData(pixelsArea, 0, 0);
  return WORKING_CANVAS.toDataURL('image/jpg');
}

function PresetMenu(props) {
  return (
    <Menu
      onClick={props.onClick}
      selectedKeys={[props.selected]}
      style={{
        overflowY: 'auto',
        maxHeight: '170px',
        marginLeft: '2px',
        borderRadius: '5px',
        width: '296px',
      }}
    >
      {vtkColorMaps.rgbPresetNames.map((name) => (
        <Menu.Item key={name}>{name}</Menu.Item>
      ))}
    </Menu>
  );
}

PresetMenu.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.string,
};
PresetMenu.defaultProps = {
  onClick: () => {},
  selected: '',
};

export default class ColorBy extends React.Component {
  constructor(props) {
    super(props);

    this.state = EMPTY_ARRAY_STATE;

    this.piecewiseWidget = vtkPiecewiseGaussianWidget.newInstance({
      numberOfBins: 256,
      size: [300, 150],
    });

    this.piecewiseWidget.updateStyle({
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      histogramColor: 'rgba(100, 100, 100, 0.5)',
      strokeColor: 'rgb(0, 0, 0)',
      activeColor: 'rgb(255, 255, 255)',
      handleColor: 'rgb(50, 150, 50)',
      buttonDisableFillColor: 'rgba(255, 255, 255, 0.5)',
      buttonDisableStrokeColor: 'rgba(0, 0, 0, 0.5)',
      buttonStrokeColor: 'rgba(0, 0, 0, 1)',
      buttonFillColor: 'rgba(255, 255, 255, 1)',
      strokeWidth: 2,
      activeStrokeWidth: 3,
      buttonStrokeWidth: 1.5,
      handleWidth: 3,
      iconSize: 0,
      padding: 10,
    });

    this.subscriptions = [];

    // Closure for callback
    this.onDataArrayChange = this.onDataArrayChange.bind(this);
    this.onOpacityChange = this.onOpacityChange.bind(this);
    this.onPresetChange = this.onPresetChange.bind(this);
    this.onRepresentationChange = this.onRepresentationChange.bind(this);
    this.updateColorMap = this.updateColorMap.bind(this);
  }

  componentDidMount() {
    this.piecewiseWidget.setContainer(this.widgetContainer);
    this.piecewiseWidget.bindMouseListeners();

    if (this.props.pipelineManager.getActiveRepresentation()) {
      this.onRepresentationChange();
    }

    this.activeSourceSubscription = this.props.pipelineManager.onActiveSourceChange(
      this.onRepresentationChange
    );

    // this.piecewiseWidget.onAnimation((start) => {
    //   if (start) {
    //     renderWindow.getInteractor().requestAnimation(widget);
    //   } else {
    //     renderWindow.getInteractor().cancelAnimation(widget);
    //   }
    // });
  }

  componentDidUpdate() {
    this.piecewiseWidget.render();
  }

  componentWillUnmount() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
    if (this.activeSourceSubscription) {
      this.activeSourceSubscription.unsubscribe();
      this.activeSourceSubscription = null;
    }

    this.piecewiseWidget.unbindMouseListeners();
    this.piecewiseWidget.setContainer(null);
  }

  onRepresentationChange() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }

    this.activeRepresentation = this.props.pipelineManager.getActiveRepresentation();

    // Update state
    if (this.activeRepresentation) {
      this.setState({
        arrays: this.activeRepresentation.listDataArrays(),
        selectedArray: this.activeRepresentation.getSelectedDataArray(),
      });
    }

    if (
      this.activeRepresentation &&
      this.activeRepresentation.getSelectedDataArray()
    ) {
      const selectedArray = this.activeRepresentation.getSelectedDataArray();
      if (!selectedArray.array) {
        this.piecewiseWidget.setDataArray([]);
        this.setState({ colorMap: null });
        return;
      }
      this.piecewiseWidget.setDataArray(selectedArray.array.getData());
      const piecewiseData = this.props.pipelineManager.getPiecewiseData(
        selectedArray.name
      );
      this.piecewiseFunction = piecewiseData.piecewiseFunction;
      this.piecewiseWidget.applyOpacity(this.piecewiseFunction);
      const lutData = this.props.pipelineManager.getLookupTableData(
        selectedArray.name
      );
      this.lookupTable = lutData.lookupTable;
      this.piecewiseWidget.setColorTransferFunction(this.lookupTable);
      this.subscriptions.push(
        this.lookupTable.onModified(() => {
          this.piecewiseWidget.render();
          this.props.pipelineManager.renderLaterViews();
        })
      );
      this.setState({ presetName: lutData.presetName });

      // Update Widget
      this.piecewiseWidget.setGaussians(piecewiseData.gaussians);
      this.onOpacityChange();

      this.subscriptions.push(
        this.piecewiseWidget.onOpacityChange(this.onOpacityChange)
      );
      this.piecewiseWidget.render();
      this.updateColorMap();
    }
  }

  onDataArrayChange(e) {
    if (this.activeRepresentation) {
      this.activeRepresentation.setSelectedDataArray(
        ...e.target.value.split(':')
      );
      this.onRepresentationChange();
    } else {
      this.forceUpdate();
    }
    this.props.pipelineManager.renderLaterViews();
  }

  onOpacityChange() {
    if (this.piecewiseFunction) {
      this.piecewiseWidget.applyOpacity(this.piecewiseFunction);
      this.props.pipelineManager.renderLaterViews(); // FIXME should not do this...

      // Save gaussian definitions...
      if (this.activeRepresentation) {
        this.props.pipelineManager.setGaussians(
          this.activeRepresentation.getSelectedDataArray().name,
          this.piecewiseWidget.getReferenceByName('gaussians')
        );
      }
    }
  }

  onPresetChange({ key: presetName }) {
    this.setState({ presetName });
    if (this.state.selectedArray.name) {
      this.props.pipelineManager.applyPreset(
        presetName,
        this.state.selectedArray.name
      );
      this.updateColorMap();
    }
  }

  updateColorMap() {
    if (this.lookupTable) {
      const range = this.lookupTable.getMappingRange();
      const colorMap = getLookupTableImage(
        this.lookupTable,
        range[0],
        range[1],
        300
      );
      this.setState({ colorMap });
    } else {
      this.setState({ colorMap: null });
    }
  }

  render() {
    const arrayRange = this.lookupTable
      ? this.lookupTable.getMappingRange()
      : [0, 1];
    const menu = (
      <PresetMenu
        onClick={this.onPresetChange}
        selected={this.state.presetName}
      />
    );
    return (
      <div
        className={this.activeRepresentation ? style.container : style.hidden}
      >
        <section
          className={this.state.arrays.length > 1 ? style.row : style.hidden}
        >
          <label className={style.label}>Color By</label>
          <select
            className={style.colorBy}
            value={`${this.state.selectedArray.location}:${
              this.state.selectedArray.name
            }`}
            onChange={this.onDataArrayChange}
          >
            <option value=":">Solid Color</option>
            {this.state.arrays.map((array) => (
              <option
                key={`${array.location}:${array.name}`}
                value={`${array.location}:${array.name}`}
              >
                {array.name}
              </option>
            ))}
          </select>
        </section>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
          <img
            alt="Color Legend"
            src={this.state.colorMap}
            className={this.state.colorMap ? style.colorMap : style.hidden}
          />
        </Dropdown>
        <section
          className={this.state.colorMap ? style.colorMapRange : style.hidden}
        >
          <label className={style.minRange}>{arrayRange[0]}</label>
          <span className={style.spacer} />
          <label className={style.maxRange}>{arrayRange[1]}</label>
        </section>
        <section
          className={this.state.colorMap ? style.row : style.hidden}
          ref={(c) => {
            this.widgetContainer = c;
          }}
        />
      </div>
    );
  }
}

ColorBy.propTypes = {
  pipelineManager: PropTypes.object,
};

ColorBy.defaultProps = {
  pipelineManager: null,
};
