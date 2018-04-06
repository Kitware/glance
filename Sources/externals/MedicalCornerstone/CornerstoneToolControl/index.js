import React from 'react';
import PropTypes from 'prop-types';

export default class CornerstoneToolControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.views = [];
  }

  componentDidMount() {
    this.views = this.props.proxyManager
      .getViews()
      .filter((view) => view.getClassName() === 'vtkCornerstoneViewProxy');
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
