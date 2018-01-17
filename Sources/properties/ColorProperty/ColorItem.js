import React from 'react';
import PropTypes from 'prop-types';

export default function ColorItem(props) {
  const background =
    props.color.length === 3
      ? `rgb(${Math.floor(props.color[0] * 255)}, ${Math.floor(
          props.color[1] * 255
        )}, ${Math.floor(props.color[2] * 255)})`
      : `rgba(${Math.floor(props.color[0] * 255)}, ${Math.floor(
          props.color[1] * 255
        )}, ${Math.floor(props.color[2] * 255)}, ${Math.floor(
          props.color[3]
        )})`;
  const text = props.color.length === 4 ? 'X' : '';
  return (
    <div
      data-color={props.color.join(',')}
      style={Object.assign({ background }, props.style)}
      onClick={props.onClick}
    >
      {text}
    </div>
  );
}

ColorItem.propTypes = {
  color: PropTypes.array,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

ColorItem.defaultProps = {
  color: [0.5, 0.5, 0.5],
  onClick: () => {},
  style: {
    margin: '4px',
    width: '20px',
    height: '20px',
    border: 'solid 1px black',
    flex: 'none',
    textAlign: 'center',
    lineHeight: '20px',
    borderRadius: '50%',
  },
};
