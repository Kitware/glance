import React from 'react';
import PropTypes from 'prop-types';

import vtkFPSMonitor from 'vtk.js/Sources/Interaction/UI/FPSMonitor';

import style from './Informations.mcss';

export default class FPSMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.monitor = vtkFPSMonitor.newInstance({ bufferSize: 278 });
    this.updateActiveView = this.updateActiveView.bind(this);

    this.subscriptions = [];
    this.subscriptions.push(props.proxyManager.onModified(this.monitor.update));
    this.subscriptions.push(
      props.proxyManager.onActiveViewChange(this.updateActiveView)
    );

    this.monitor.getFpsMonitorContainer().style.flexDirection = 'column';
  }

  componentDidMount() {
    this.monitor.setContainer(this.container);
    this.updateActiveView();
  }

  componentWillUnmount() {
    if (this.monitor) {
      this.monitor.delete();
      this.monitor = null;
    }
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
  }

  updateActiveView() {
    const view = this.props.proxyManager.getActiveView();
    const rw = view ? view.getRenderWindow() : null;
    this.monitor.setRenderWindow(rw);
  }

  render() {
    return (
      <div
        className={style.fpsMonitor}
        ref={(c) => {
          this.container = c;
        }}
      />
    );
  }
}

FPSMonitor.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};

FPSMonitor.defaultProps = {};
