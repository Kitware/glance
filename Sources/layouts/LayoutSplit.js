import React from 'react';
import PropTypes from 'prop-types';

import Layout2D from './Layout2D';
import Layout3D from './Layout3D';
import style from './vtk-layout.mcss';

export default function LayoutSplit(props) {
  return (
    <div className={`${style.quadRoot} ${props.className}`}>
      <div className={`${style.splitRow} ${props.className}`}>
        <div className={style.view}>
          <Layout2D proxyManager={props.proxyManager} />
        </div>
        <div className={style.view}>
          <Layout3D proxyManager={props.proxyManager} />
        </div>
      </div>
    </div>
  );
}

LayoutSplit.propTypes = {
  proxyManager: PropTypes.object,
  className: PropTypes.string,
};

LayoutSplit.defaultProps = {
  proxyManager: null,
  className: '',
};
