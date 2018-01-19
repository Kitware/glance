import React from 'react';
import PropTypes from 'prop-types';

import vtkMath from 'vtk.js/Sources/Common/Core/Math';

import ToggleIconButton from 'paraviewweb/src/React/Widgets/ToggleIconButtonWidget';
import style from 'paraviewweb/style/ReactProperties/CellProperty.mcss';

import ColorByComponent from './ColorByComponent';
import ColorItem from '../ColorProperty/ColorItem';
import Palettes from '../../Palettes';

/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-prop-types */
export default class ColorByProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      helpOpen: false,
      ui: props.ui,
    };

    // Callback binding
    this.helpToggled = this.helpToggled.bind(this);
    this.onArrayChange = this.onArrayChange.bind(this);
    this.onComponentChange = this.onComponentChange.bind(this);
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

  onArrayChange(e) {
    const value = e.target.value.split(':');
    const newData = this.state.data;
    newData.value = [].concat(value, newData.value[2]);

    this.setState({
      data: newData,
    });
    if (this.props.onChange) {
      this.props.onChange(newData);
    }
  }

  onComponentChange(e) {
    const componentIndex = Number(e.target.value);
    const newData = this.state.data;
    newData.value[2] = componentIndex;

    this.setState({
      data: newData,
    });
    if (this.props.onChange) {
      this.props.onChange(newData);
    }
  }

  onColorClick(e) {
    const value = e.target.dataset.color.split(',').map((str) => Number(str));
    const changeSet = {
      id: `${this.state.data.id.split(':')[0]}:color`,
      size: 3,
      value,
    };
    if (this.props.onChange) {
      this.props.onChange(changeSet);
    }
  }

  helpToggled(open) {
    this.setState({
      helpOpen: open,
    });
  }

  render() {
    const solidColors = [];
    if (this.props.data.value.length === 0) {
      const palette = (this.props.ui.domain.palette || Palettes.extended).map(
        (hex) => vtkMath.hex2float(hex)
      );
      palette.forEach((c, i) => {
        solidColors.push(
          <ColorItem key={btoa(i)} color={c} onClick={this.onColorClick} />
        );
      });
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
        <select
          className={style.inputBlock}
          value={`${this.props.data.value[0]}:${this.props.data.value[1]}`}
          onChange={this.onArrayChange}
        >
          {this.props.ui.domain.solidColor ? (
            <option value=":">Solid Color</option>
          ) : null}
          {this.props.ui.domain.arrays.map((array) => (
            <option
              key={`${array.name}:${array.location}`}
              value={`${array.name}:${array.location}`}
            >
              {array.name}
            </option>
          ))}
        </select>
        <ColorByComponent
          style={{ marginTop: '5px' }}
          onChange={this.onComponentChange}
          value={this.props.data.value}
          arrays={this.props.ui.domain.arrays}
        />
        <div
          className={style.inputBlock}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {solidColors}
        </div>
        <div
          className={this.state.helpOpen ? style.helpBox : style.hidden}
          dangerouslySetInnerHTML={{ __html: this.props.ui.help }}
        />
      </div>
    );
  }
}

ColorByProperty.propTypes = {
  data: PropTypes.object.isRequired,
  help: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  show: PropTypes.func,
  ui: PropTypes.object.isRequired,
  viewData: PropTypes.object,
};

ColorByProperty.defaultProps = {
  name: '',
  help: '',
  onChange: () => {},
  show: () => true,
  viewData: {},
};
