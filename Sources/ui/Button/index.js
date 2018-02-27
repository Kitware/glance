import React from 'react';
import PropTypes from 'prop-types';

import style from './Button.mcss';

function Button(props) {
  const classes = [style.button, props.className];

  const otherProps = Object.assign({}, props);
  delete otherProps.className;
  delete otherProps.children;

  return (
    <button className={classes.join(' ')} {...otherProps}>
      {props.children}
    </button>
  );
}

Button.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.any,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  style: {},
  className: '',
  children: [],
  onClick: () => {},
};

export default Button;
