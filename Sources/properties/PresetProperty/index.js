import React from 'react';
import PropTypes from 'prop-types';

import PiecewiseFunctionProxyConstants from 'vtk.js/Sources/Proxy/Core/PiecewiseFunctionProxy/Constants';

import Slider from 'paraviewweb/src/React/Properties/SliderProperty/Slider';
import ToggleIconButton from 'paraviewweb/src/React/Widgets/ToggleIconButtonWidget';
import style from 'paraviewweb/style/ReactProperties/CellProperty.mcss';

import PresetTree from './PresetTree';

const { Mode: PwfMode } = PiecewiseFunctionProxyConstants;

function createPresetMap(tree) {
  const map = {};
  for (let i = 0; i < tree.length; ++i) {
    if (tree[i].Category) {
      Object.assign(map, createPresetMap(tree[i].Children));
    } else {
      map[tree[i].Name] = tree[i];
    }
  }
  return map;
}

function setOpacityPoints(pwfProxy, preset, shift = 0) {
  const rawPoints = preset.OpacityPoints;
  const points = [];
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < rawPoints.length; i += 2) {
    points.push([rawPoints[i], rawPoints[i + 1]]);
    min = Math.min(min, rawPoints[i]);
    max = Math.max(max, rawPoints[i]);
  }

  const width = max - min;
  const normPoints = points.map(([x, y]) => [(x - min) / width, y]);
  pwfProxy.setPoints(normPoints);

  min += shift;
  max += shift;
  pwfProxy.setDataRange(min, max);
}

function setColormap(lutProxy, colormap, shift = 0) {
  lutProxy.setPresetName(colormap.Name);

  const rawPoints = colormap.RGBPoints;
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < rawPoints.length; i += 4) {
    min = Math.min(min, rawPoints[i]);
    max = Math.max(max, rawPoints[i]);
  }

  min += shift;
  max += shift;
  lutProxy.setDataRange(min, max);
}

/* eslint-disable react/no-unused-prop-types */
export default class PresetProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      helpOpen: false,
      ui: props.ui,
      preset: '',
      shift: 0,
    };

    this.presetMap = {};

    // bindings
    this.onPresetChange = this.onPresetChange.bind(this);
    this.onShiftChange = this.onShiftChange.bind(this);
  }

  componentWillMount() {
    const newState = {};
    if (this.props.ui.default && !this.props.data.value) {
      newState.data = this.state.data;
      newState.data.value = this.props.ui.default;
    }

    if (this.props.ui.domain && this.props.ui.domain.presets) {
      this.presetMap = createPresetMap(this.props.ui.domain.presets);
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState, this.update);
    } else {
      this.update();
    }
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;

    if (this.state.data !== data) {
      this.setState({ data }, this.update);
    }
  }

  onPresetChange(presetName) {
    const pwfProxy = this.props.data.value[0];
    if (!pwfProxy) {
      return;
    }

    const lutProxy = pwfProxy.getLookupTableProxy();
    if (!lutProxy) {
      return;
    }

    const preset = this.presetMap[presetName];
    if (!preset) {
      return;
    }

    setColormap(lutProxy, preset);
    setOpacityPoints(pwfProxy, preset);

    this.update();
    lutProxy.getProxyManager().renderAllViews();
  }

  onShiftChange(idx, valStr) {
    const val = Number(valStr);

    const pwfProxy = this.props.data.value[0];
    if (pwfProxy) {
      const lutProxy = pwfProxy.getLookupTableProxy();
      if (lutProxy && this.state.preset) {
        const preset = this.presetMap[this.state.preset];

        setOpacityPoints(pwfProxy, preset, val);
        setColormap(lutProxy, preset, val);

        this.setState({ shift: val });
        pwfProxy.getProxyManager().renderAllViews();
      }
    }
  }

  getShift() {
    const pwfProxy = this.props.data.value[0];
    if (!pwfProxy) {
      return 0;
    }

    const lutProxy = pwfProxy.getLookupTableProxy();
    if (!lutProxy) {
      return 0;
    }

    const preset = this.presetMap[lutProxy.getPresetName()];

    if (!preset) {
      return 0;
    }

    // Compute shift based on range of colormap points
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < preset.RGBPoints.length; i += 4) {
      min = Math.min(min, preset.RGBPoints[i]);
      max = Math.max(max, preset.RGBPoints[i]);
    }

    const shiftedRange = lutProxy.getDataRange();

    // compute current shift
    let shift = shiftedRange[0] - min;

    shift = Math.round(shift);
    return shift;
  }

  update() {
    const pwfProxy = this.props.data.value[0];
    if (!pwfProxy) {
      return;
    }

    const lutProxy = pwfProxy.getLookupTableProxy();
    if (lutProxy) {
      if (lutProxy.getPresetName() in this.presetMap) {
        pwfProxy.setMode(PwfMode.Points);

        if (this.state.preset !== lutProxy.getPresetName()) {
          this.setState({
            preset: lutProxy.getPresetName(),
            shift: this.getShift(),
          });
        }
      } else {
        pwfProxy.setMode(PwfMode.Gaussians);
      }
    }
  }

  render() {
    const pwfProxy = this.props.data.value[0];
    if (!pwfProxy) {
      return null;
    }

    const lutProxy = pwfProxy.getLookupTableProxy();
    if (!lutProxy) {
      return null;
    }

    let shiftMin = 0;
    let shiftMax = 0;

    const preset = this.presetMap[this.state.preset];
    if (preset) {
      // shift range is original rgb/opacity range centered around 0
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < preset.RGBPoints.length; i += 4) {
        min = Math.min(min, preset.RGBPoints[i]);
        max = Math.max(max, preset.RGBPoints[i]);
      }

      const center = (max - min) / 2 + min;
      shiftMin = Math.round(min - center);
      shiftMax = Math.round(max - center);
    }

    return (
      <div
        className={
          this.props.show(this.props.viewData) ? style.container : style.hidden
        }
      >
        <div className={style.header}>
          <strong>{this.props.ui.label}</strong>
          <span>
            <ToggleIconButton
              icon={style.helpIcon}
              value={this.state.helpOpen}
              toggle={!!this.props.ui.help}
              onChange={this.helpToggled}
            />
          </span>
        </div>
        <PresetTree
          presets={this.props.ui.domain.presets || {}}
          value={this.state.preset}
          onSelect={this.onPresetChange}
        />
        <div className={style.header}>
          <strong>Shift</strong>
        </div>
        <div className={style.inputBlock}>
          <Slider
            value={this.state.shift}
            min={shiftMin}
            max={shiftMax}
            step={1}
            onChange={this.onShiftChange}
          />
        </div>
      </div>
    );
  }
}

PresetProperty.propTypes = {
  data: PropTypes.object.isRequired,
  help: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  show: PropTypes.func,
  ui: PropTypes.object.isRequired,
  viewData: PropTypes.object,
};

PresetProperty.defaultProps = {
  name: '',
  help: '',
  onChange: () => {},
  show: () => true,
  viewData: {},
};
