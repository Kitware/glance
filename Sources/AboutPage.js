import React from 'react';

import Icons from './icons';

const imageStyle = {
  width: '50%',
  display: 'inline-block',
  textAlign: 'center',
};

function AboutPage(props) {
  // prettier-ignore
  return (
    <div>
      <a href="https://kitware.github.io/pv-web-viewer/">
        <img src={Icons.Logo} alt="ParaView Glance" />
      </a>
      <div>
        <a href="https://kitware.github.io/pv-web-viewer/">ParaView Glance</a> is a
        general purpose web application useful for visualizing many data types,
        as well as a framework for building custom web-based visualization applications.
      </div>
      &nbsp;
      <div>
        <a href="https://www.kitware.com/" style={imageStyle}>
          <img src={Icons.KitwareLogo} alt="Kitware" />
        </a>
        <a href="https://www.kitware.com/" style={imageStyle}>
          <img src={Icons.VtkJsLogo} alt="Kitware" style={{ height: '130px' }} />
        </a>
      </div>
    </div>
  );
}

export default AboutPage;
