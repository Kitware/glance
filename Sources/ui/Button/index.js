import React from 'react';
import PropTypes from 'prop-types';

import style from './Button.mcss';

function Button(props) {
  const classes = [
    style.button,
    props.checked ? style.checked : '',
    props.className,
  ];

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
  className: PropTypes.string,
  children: PropTypes.any,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  className: '',
  children: [],
  checked: false,
  onClick: () => {},
};

export default Button;
