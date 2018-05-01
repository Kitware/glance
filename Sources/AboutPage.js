import React from 'react';

import Icons from './icons';

const linkStyle = {
  width: '50%',
  display: 'inline-block',
  textAlign: 'center',
};

function AboutPage(props) {
  // prettier-ignore
  return (
    <div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://kitware.github.io/pv-web-viewer/"
      >
        <img src={Icons.Logo} alt="ParaView Glance" style={{ width: '100%' }} />
      </a>
      &nbsp;
      <div>
        <a href="https://kitware.github.io/pv-web-viewer/">ParaView Glance</a> is a
        general purpose web application useful for visualizing many data types,
        as well as a framework for building custom web-based visualization applications.
      </div>
      &nbsp;
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.kitware.com/"
          style={linkStyle}
        >
          <img src={Icons.KitwareLogo} alt="Kitware" style={{ width: '80%' }} />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://kitware.github.io/vtk-js/"
          style={linkStyle}
        >
          <img src={Icons.VtkJsLogo} alt="vtk.js" style={{ width: '80%' }} />
        </a>
      </div>
    </div>
  );
}

export default AboutPage;
