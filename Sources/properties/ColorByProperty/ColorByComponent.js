import React from 'react';
import PropTypes from 'prop-types';

import style from 'paraviewweb/style/ReactProperties/CellProperty.mcss';

export default function ColorByComponent(props) {
  const selectedArray = props.arrays.find(
    (a) => a.name === props.value[0] && a.location === props.value[1]
  );
  if (
    !selectedArray ||
    (selectedArray && selectedArray.numberOfComponents < 2)
  ) {
    return null;
  }
  const options = [
    <option key="mag" value="-1">
      Magnitude
    </option>,
  ];
  for (let i = 0; i < selectedArray.numberOfComponents; i++) {
    options.push(
      <option key={`comp-${i}`} value={i}>
        Component {i}
      </option>
    );
  }

  return (
    <select
      className={style.inputBlock}
      value={props.value[2]}
      onChange={props.onChange}
      style={props.style}
    >
      {options}
    </select>
  );
}

ColorByComponent.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  arrays: PropTypes.array,
  style: PropTypes.object,
};

ColorByComponent.defaultProps = {
  value: ['Solid Color'],
  onChange: () => {},
  arrays: [],
  style: {},
};
