import React from 'react';
import PropTypes from 'prop-types';

import PiecewiseFunctionProxyConstants from 'vtk.js/Sources/Proxy/Core/PiecewiseFunctionProxy/Constants';

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
  points.forEach(([x, y]) => {
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
      this.setState(newState, this.updatePiecewiseFunction);
    }
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;

    if (this.state.data !== data) {
      this.setState({ data }, this.updatePiecewiseFunction);
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

    const dataRange = computeDataRange(points);
    pwfProxy.setPoints(normalize(points, dataRange));
    pwfProxy.setDataRange(...dataRange);

    this.updatePiecewiseFunction();

    lutProxy.getProxyManager().renderAllViews();
  }

  updatePiecewiseFunction() {
    const pwfProxy = this.props.data.value[0];
    if (!pwfProxy) {
      return;
    }

    const lutProxy = pwfProxy.getLookupTableProxy();
    if (lutProxy) {
      if (lutProxy.getPresetName() in this.presetMap) {
        pwfProxy.setMode(Mode.Points);
        this.setState({ preset: lutProxy.getPresetName() });
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
