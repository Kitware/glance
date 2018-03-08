import React from 'react';
import PropTypes from 'prop-types';

import UI from '../../ui';
import AnnotationManager from './AnnotationManager';
import style from './AnnotationControl.mcss';

const { Button } = UI;

const BUTTON_STYLE = {
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  marginLeft: '5px',
  marginTop: '10px',
  marginBottom: '20px',
};

export default class AnnotationControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.annotationManager = AnnotationManager;
    this.proxyManager = props.proxyManager;
    this.updateTab = props.updateTab;

    // Closure for callback
    this.addAngle = this.addAngle.bind(this);
    this.addLength = this.addLength.bind(this);
    this.addEllipticalRoi = this.addEllipticalRoi.bind(this);
    this.enableActiveView = this.enableActiveView.bind(this);

    this.subscription = this.proxyManager.onActiveViewChange(
      this.enableActiveView
    );
    this.enableActiveView();
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
    this.annotationManager.disable();
    this.annotationManager.setWorkspace(null);
  }

  enableActiveView() {
    const activeView = this.proxyManager.getActiveView();
    const parentElem = activeView ? activeView.getContainer() : null;
    if (activeView) {
      if (parentElem) {
        const canvas = parentElem.querySelector('canvas');
        console.log('enable', canvas);
        this.annotationManager.enable(parentElem.parentNode);
      } else {
        console.log('try again');
        setTimeout(this.enableActiveView, 100);
      }
    }
  }

  addAngle() {
    this.annotationManager.deactivateAllTools();
    this.annotationManager.activateAngle(1);
  }

  addLength() {
    this.annotationManager.deactivateAllTools();
    this.annotationManager.activateLength(1);
  }

  addEllipticalRoi() {
    this.annotationManager.deactivateAllTools();
    this.annotationManager.activateEllipticalRoi(1);
  }

  render() {
    return (
      <div className={style.container}>
        <Button
          className="fa fa-font"
          style={BUTTON_STYLE}
          onClick={this.addAngle}
        />
        <Button
          className="fa fa-comment"
          style={BUTTON_STYLE}
          onClick={this.addLength}
        />
        <Button
          className="fa fa-angle-left"
          style={BUTTON_STYLE}
          onClick={this.addEllipticalRoi}
        />
        <div
          className={style.canvas}
          ref={(c) => {
            this.container = c;
          }}
        />
      </div>
    );
  }
}

AnnotationControl.propTypes = {
  proxyManager: PropTypes.object,
  updateTab: PropTypes.func,
};

AnnotationControl.defaultProps = {
  proxyManager: null,
  updateTab: () => {},
};
