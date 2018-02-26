import React from 'react';
import PropTypes from 'prop-types';

import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

import { Dropdown } from 'antd';

import style from 'paraviewweb/style/ReactProperties/CellProperty.mcss';
import localStyle from './LookupTableProperty.mcss';

import UI from '../../ui';

const { Menu } = UI;

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
      onSelect={props.onClick}
      selectedKey={props.selected}
      style={{
        overflowY: 'auto',
        maxHeight: '170px',
        marginLeft: '2px',
        borderRadius: '5px',
        width: '280px',
        background: 'white',
      }}
      className={localStyle.presetMenu}
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

/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-prop-types */
export default class LookupTableProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      helpOpen: false,
      ui: props.ui,
      colorMap: null,
    };

    this.onPresetChange = this.onPresetChange.bind(this);
    this.updateColorMap = this.updateColorMap.bind(this);
  }

  componentWillMount() {
    const newState = {};
    if (this.props.ui.default && !this.props.data.value) {
      newState.data = this.state.data;
      newState.data.value = this.props.ui.default;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState, this.updateColorMap);
    } else {
      this.updateColorMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;

    if (this.state.data !== data) {
      this.setState(
        {
          data,
        },
        this.updateColorMap
      );
    }
  }

  onPresetChange(presetName) {
    const lookupTableProxy = this.props.data.value[0];
    if (lookupTableProxy) {
      lookupTableProxy.setPresetName(presetName);
      this.updateColorMap();
      lookupTableProxy.getProxyManager().renderAllViews();
    }
  }

  updateColorMap() {
    const lookupTableProxy = this.props.data.value[0];
    if (lookupTableProxy) {
      const range = lookupTableProxy.getDataRange();
      const colorMap = getLookupTableImage(
        lookupTableProxy.getLookupTable(),
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
    const lutProxy = this.props.data.value[0];
    if (!lutProxy || !this.state.colorMap) {
      return null;
    }
    const menu = (
      <PresetMenu
        onClick={this.onPresetChange}
        selected={lutProxy.getPresetName()}
      />
    );
    return (
      <div
        className={
          this.props.show(this.props.viewData) ? style.container : style.hidden
        }
      >
        <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
          <img
            alt="Color Legend"
            src={this.state.colorMap}
            className={this.state.colorMap ? localStyle.colorMap : style.hidden}
          />
        </Dropdown>
        <section
          className={
            this.state.colorMap ? localStyle.colorMapRange : style.hidden
          }
        >
          <label className={localStyle.minRange}>
            {lutProxy.getDataRange()[0]}
          </label>
          <span className={localStyle.spacer} />
          <label className={localStyle.maxRange}>
            {lutProxy.getDataRange()[1]}
          </label>
        </section>
      </div>
    );
  }
}

LookupTableProperty.propTypes = {
  data: PropTypes.object.isRequired,
  help: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  show: PropTypes.func,
  ui: PropTypes.object.isRequired,
  viewData: PropTypes.object,
};

LookupTableProperty.defaultProps = {
  name: '',
  help: '',
  onChange: () => {},
  show: () => true,
  viewData: {},
};
