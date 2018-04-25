import React from 'react';

import icons from '../../icons';

import style from './Overlay.mcss';

const DEFAULT_WIDTH = 700; // px

function Overlay(props) {
  return (
    <div className={style.overlay}>
      <div className={style.centered}>
        <img className={style.glance} src={icons.Logo} alt="ParaView Glance" />
        <p>
          This application is not yet optimized for mobile. Please use a
          desktop.
        </p>
        <p>
          For interactive 3D samples on mobile, check out&nbsp;
          <a href="https://kitware.github.io/vtk-js/examples/">vtk.js</a>.
        </p>
        <div className={style.kitware}>
          <a href="https://kitware.com/">
            <img src={icons.KitwareLogo} alt="Kitware" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MobileOverlay(Component, width = DEFAULT_WIDTH) {
  // right now this is not dynamic; only applies on first run
  const isMobile = window.innerWidth <= DEFAULT_WIDTH;

  return function WrappedComponent(props) {
    if (isMobile) {
      return <Overlay />;
    }
    return <Component {...props} />;
  };
}
