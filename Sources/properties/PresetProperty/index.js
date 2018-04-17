import React from 'react';
import PropTypes from 'prop-types';

import PiecewiseFunctionProxyConstants from 'vtk.js/Sources/Proxy/Core/PiecewiseFunctionProxy/Constants';

import Slider from 'paraviewweb/src/React/Properties/SliderProperty/Slider';
import ToggleIconButton from 'paraviewweb/src/React/Widgets/ToggleIconButtonWidget';
import style from 'paraviewweb/style/ReactProperties/CellProperty.mcss';

import PresetTree from './PresetTree';

const { Mode } = PiecewiseFunctionProxyConstants;

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

function computeDataRange(points) {
  let min = Infinity;
  let max = -Infinity;
  points.forEach((x) => {
    min = Math.min(min, x);
    max = Math.max(max, x);
  });

  return [min, max];
}

function normalize(points, range) {
  const width = range[1] - range[0];
  return points.map(([x, y]) => [(x - range[0]) / width, y]);
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

    const shift = this.getShift();
    if (shift !== 0) {
      newState.shift = shift;
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

    const points = [];
    for (let i = 0; i < preset.OpacityPoints.length; i += 2) {
      points.push([preset.OpacityPoints[i], preset.OpacityPoints[i + 1]]);
    }

    lutProxy.setPresetName(presetName);

    const dataRange = computeDataRange(points.map(([x, y]) => x));
    pwfProxy.setPoints(normalize(points, dataRange));
    pwfProxy.setDataRange(...dataRange);

    this.update();
    lutProxy.getProxyManager().renderAllViews();
  }

  onShiftChange(idx, valStr) {
    const val = Number(valStr);

    const pwfProxy = this.props.data.value[0];
    if (pwfProxy && this.state.preset) {
      const preset = this.presetMap[this.state.preset];

      const points = [];
      for (let i = 0; i < preset.OpacityPoints.length; i += 2) {
        points.push([preset.OpacityPoints[i], preset.OpacityPoints[i + 1]]);
      }

      const dataRange = computeDataRange(points.map(([x, y]) => x));
      const shiftedPoints = points.map(([x, y]) => [
        Math.max(dataRange[0], Math.min(dataRange[1], x + val)),
        y,
      ]);

      pwfProxy.setPoints(normalize(shiftedPoints, dataRange));

      this.setState({ shift: val });
      pwfProxy.getProxyManager().renderAllViews();
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

    const points = [];
    for (let i = 0; i < preset.OpacityPoints.length; i += 2) {
      points.push(preset.OpacityPoints[i]);
    }

    const last = points.length - 1;
    points.sort((a, b) => a - b);

    // get current pwf
    const dataRange = pwfProxy.getDataRange();
    const dataWidth = dataRange[1] - dataRange[0];
    const shiftedPoints = pwfProxy
      .getPoints()
      .map(([x, y]) => x * dataWidth + dataRange[0]);

    if (shiftedPoints.length !== points.length) {
      return 0;
    }

    // compute current shift
    let shift = 0;
    if (points[last - 1] > shiftedPoints[last - 1]) {
      shift = shiftedPoints[last - 1] - points[last - 1];
    } else if (points[1] < shiftedPoints[1]) {
      shift = shiftedPoints[1] - points[1];
    }

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
        pwfProxy.setMode(Mode.Points);

        if (this.state.preset !== lutProxy.getPresetName()) {
          this.setState({
            preset: lutProxy.getPresetName(),
            // reset shift whenever preset changes
            shift: 0,
          });
        }
      } else {
        pwfProxy.setMode(Mode.Gaussians);
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
      // compute shift range
      const points = [];
      for (let i = 0; i < preset.OpacityPoints.length; i += 2) {
        points.push(preset.OpacityPoints[i]);
      }
      [shiftMin, shiftMax] = computeDataRange(points);
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
