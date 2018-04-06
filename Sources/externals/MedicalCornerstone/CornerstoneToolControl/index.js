import React from 'react';
import PropTypes from 'prop-types';

import vtkCornerstoneToolManager from '../CornerstoneToolManager';
import toolConfiguration from '../toolsConfig';

export default class CornerstoneToolControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.views = [];

    this.toolManager = vtkCornerstoneToolManager.newInstance({
      toolConfiguration,
    });
  }

  componentDidMount() {
    this.views = this.props.proxyManager
      .getViews()
      .filter((view) => view.getClassName() === 'vtkCornerstoneViewProxy');

    this.views.forEach((view) => {
      view.setToolManager(this.toolManager);
    });
  }

  render() {
    return <div>CornerstoneToolControl</div>;
  }
}

CornerstoneToolControl.propTypes = {
  proxyManager: PropTypes.object,
};

CornerstoneToolControl.defaultProps = {
  proxyManager: null,
};
