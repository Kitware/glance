import React from 'react';
import PropTypes from 'prop-types';

import CollapsibleWidget from 'paraviewweb/src/React/Widgets/CollapsibleWidget';

import style from './Informations.mcss';

export default class FieldData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArray: 0,
    };

    // Closure for callback
    this.updateSetectedArray = this.updateSetectedArray.bind(this);
  }

  updateSetectedArray(e) {
    const selectedArray = Number(e.target.value);
    this.setState({ selectedArray });
  }

  render() {
    if (this.props.field.getArrays().length < 1) {
      return null;
    }
    const selectedArray =
      this.props.field.getArrays()[this.state.selectedArray] ||
      this.props.field.getArrays()[0];
    return (
      <CollapsibleWidget title={this.props.name}>
        <select
          className={style.arraySelector}
          value={this.state.selectedArray}
          onChange={this.updateSetectedArray}
        >
          {this.props.field.getArrays().map((array, index) => (
            <option key={array.getName()} value={index}>
              {array.getName()} - {array.getDataType()}
            </option>
          ))}
        </select>
        <section className={style.section}>
          <label className={style.label}>Range</label>
        </section>
        <section className={style.section}>
          <label className={style.shortLabel}>min</label>
          <span className={style.singleValue}>
            {selectedArray.getRange()[0]}
          </span>
        </section>
        <section className={style.section}>
          <label className={style.shortLabel}>max</label>
          <span className={style.singleValue}>
            {selectedArray.getRange()[1]}
          </span>
        </section>
        <section className={style.section}>
          <label className={style.label}>Number&nbsp;of&nbsp;components</label>
          <span className={style.singleValue}>
            {selectedArray.getNumberOfComponents()}
          </span>
        </section>
      </CollapsibleWidget>
    );
  }
}

FieldData.propTypes = {
  field: PropTypes.object,
  name: PropTypes.string,
};

FieldData.defaultProps = {
  field: null,
  name: 'No name',
};
