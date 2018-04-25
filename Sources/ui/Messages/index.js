import React from 'react';
import PropTypes from 'prop-types';

import style from './Messages.mcss';

function Link(props) {
  return (
    <a rel="noopener noreferrer" target="_blank" {...props}>
      {props.children}
    </a>
  );
}

Link.propTypes = {
  children: PropTypes.node,
};

Link.defaultProps = {
  children: null,
};

export const LoadFailure = (
  <div>
    <p className={style.errorLine}>Failed to load image.</p>
    <p className={style.errorLine}>
      <Link
        className={style.errorLink}
        href="https://github.com/Kitware/pv-web-viewer/issues/62"
      >
        Perhaps AdBlock is enabled?
      </Link>
    </p>
    <p className={style.errorLine}>
      Or your image is not yet supported.&nbsp;
      <Link
        className={style.errorLink}
        href="https://github.com/Kitware/pv-web-viewer/issues"
      >
        Tell us!
      </Link>
    </p>
  </div>
);

export default {
  LoadFailure,
};
