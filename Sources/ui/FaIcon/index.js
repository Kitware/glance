import React from 'react';
import PropTypes from 'prop-types';

export default function FaIcon(props) {
  const classes = ['fa', `fa-${props.type}`];
  return <i className={classes.join(' ')} {...props} />;
}

FaIcon.propTypes = {
  type: PropTypes.string.isRequired,
};
