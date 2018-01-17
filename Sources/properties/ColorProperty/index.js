import React from 'react';
import PropTypes from 'prop-types';

import vtkMath from 'vtk.js/Sources/Common/Core/Math';
import ToggleIconButton from 'paraviewweb/src/React/Widgets/ToggleIconButtonWidget';
import style from 'paraviewweb/style/ReactProperties/CellProperty.mcss';

import ColorItem from './ColorItem';
import Palettes from '../../Palettes';

/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-prop-types */
export default class ColorProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      helpOpen: false,
      ui: props.ui,
    };

    // Callback binding
    this.helpToggled = this.helpToggled.bind(this);
    this.onColorClick = this.onColorClick.bind(this);
  }

  componentWillMount() {
    const newState = {};
    if (this.props.ui.default && !this.props.data.value) {
      newState.data = this.state.data;
      newState.data.value = this.props.ui.default;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;

    if (this.state.data !== data) {
      this.setState({
        data,
      });
    }
  }

  onColorClick(e) {
    const newColor = e.target.dataset.color
      .split(',')
      .map((str) => Number(str));
    const newData = this.state.data;
    newData.value = newColor;
    this.setState({
      data: newData,
    });
    if (this.props.onChange) {
      this.props.onChange(newData);
    }
  }

  helpToggled(open) {
    this.setState({
      helpOpen: open,
    });
  }

  render() {
    const palette = (this.props.ui.domain.palette || Palettes.extended).map(
      (hex) => vtkMath.hex2float(hex)
    );
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
        <div
          className={style.inputBlock}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {palette.map((c, i) => (
            <ColorItem key={btoa(i)} color={c} onClick={this.onColorClick} />
          ))}
        </div>
        <div
          className={this.state.helpOpen ? style.helpBox : style.hidden}
          dangerouslySetInnerHTML={{ __html: this.props.ui.help }}
        />
      </div>
    );
  }
}

ColorProperty.propTypes = {
  data: PropTypes.object.isRequired,
  help: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  show: PropTypes.func,
  ui: PropTypes.object.isRequired,
  viewData: PropTypes.object,
};

ColorProperty.defaultProps = {
  name: '',
  help: '',
  onChange: () => {},
  show: () => true,
  viewData: {},
};
