import React from 'react';
import PropTypes from 'prop-types';

import UI from '../../ui';
import vtkAnnotationManager from './AnnotationManager';
import LengthRenderer from './LengthRenderer';
import ArrowRenderer from './ArrowRenderer';
import EllipticalRenderer from './EllipticalRenderer';
import TextEditor from './TextEditor';
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

function bStyle(activeTool, toolName) {
  if (activeTool === toolName) {
    return Object.assign({ background: '#ccc' }, BUTTON_STYLE);
  }
  return BUTTON_STYLE;
}

/* eslint-disable react/no-array-index-key */

export default class AnnotationControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      toolsEnabled: true,
      newTool: 'edit',
      editText: false,
    };

    this.annotationManager = vtkAnnotationManager;
    this.proxyManager = props.proxyManager;
    this.updateTab = props.updateTab;

    // Closure for callback
    this.addAngle = this.addAngle.bind(this);
    this.addLength = this.addLength.bind(this);
    this.addEllipticalRoi = this.addEllipticalRoi.bind(this);
    this.addArrow = this.addArrow.bind(this);
    this.editMode = this.editMode.bind(this);

    this.activate = this.activate.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleTools = this.toggleTools.bind(this);
    this.enableActiveView = this.enableActiveView.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);

    this.updateText = this.updateText.bind(this);
    this.pushText = this.pushText.bind(this);

    this.subscriptions = [
      this.proxyManager.onActiveViewChange(this.enableActiveView),
      this.annotationManager.onImageRendered(() => this.forceUpdate()),
      this.annotationManager.onAnnotationAdded(() => {
        this.switchToEdit = true;
      }),
      this.annotationManager.onAnnotationRemoved(this.editMode),
      this.annotationManager.onEditFinished(() => {
        if (this.switchToEdit) {
          this.editMode();
        }
      }),
      this.annotationManager.onEditText((txt) => {
        this.setState({ editText: true, textValue: txt || '' });
      }),
    ];
    this.enableActiveView();
  }

  componentWillUnmount() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
    this.annotationManager.disable();
  }

  enableActiveView() {
    if (this.state.ready) {
      this.editMode();
    }
    const activeView = this.proxyManager.getActiveView();
    const parentElem = activeView ? activeView.getContainer() : null;
    if (activeView) {
      if (parentElem) {
        this.toolStateManager = this.annotationManager.enable(
          parentElem.parentNode
        );
        this.setState({ ready: true }, this.annotationManager.render());
      } else {
        console.log('try again');
        setTimeout(this.enableActiveView, 100);
      }
    }
  }

  addAngle() {
    this.annotationManager.deactivateAllTools(1);
    this.annotationManager.activateAngle(1);
    this.annotationManager.render();
    this.setState({ newTool: 'angle' });
  }

  addLength() {
    this.annotationManager.deactivateAllTools(1);
    this.annotationManager.activateLength(1);
    this.annotationManager.render();
    this.setState({ newTool: 'length' });
  }

  addEllipticalRoi() {
    this.annotationManager.deactivateAllTools(1);
    this.annotationManager.activateEllipticalRoi(1);
    this.annotationManager.render();
    this.setState({ newTool: 'ellipticalRoi' });
  }

  addArrow() {
    this.annotationManager.deactivateAllTools(1);
    this.annotationManager.activateArrowAnnotate(1);
    this.annotationManager.render();
    this.setState({ newTool: 'arrow' });
  }

  editMode() {
    this.switchToEdit = false;
    this.annotationManager.deactivateAllTools(1);
    this.annotationManager.render();
    this.setState({ newTool: 'edit' });
  }

  toggleTools() {
    const { toolsEnabled } = this.state;
    if (toolsEnabled) {
      this.annotationManager.disableAllTools();
    } else {
      this.annotationManager.enableAllTools();
    }
    this.annotationManager.render();
    this.setState({ toolsEnabled: !toolsEnabled });
  }

  activate(item) {
    this.annotationManager.deactivateAllTools();
    this.annotationManager.activateTool(item);
  }

  delete(item) {
    this.annotationManager.deleteTool(item);
  }

  extractState() {
    if (
      this.toolStateManager &&
      this.toolStateManager.toolState &&
      this.toolStateManager.toolState.default
    ) {
      return this.toolStateManager.toolState.default;
    }

    return {};
  }

  updateText(e) {
    this.setState({ textValue: e.target.value });
  }

  pushText() {
    this.annotationManager.setTextValue(this.state.textValue);
    this.setState({ editText: false, textValue: '' });
  }

  render() {
    const {
      length: lengthAnnotations,
      arrowAnnotate: arrowAnnotations,
      ellipticalRoi: ellipticalAnnotations,
    } = this.extractState();
    return (
      <div className={style.container}>
        <Button
          className="fa fa-map-signs"
          style={bStyle(this.state.newTool, 'arrow')}
          onClick={this.addArrow}
        />
        <Button
          className="fa fa-text-width"
          style={bStyle(this.state.newTool, 'length')}
          onClick={this.addLength}
        />
        <Button
          className="fa fa-comment"
          style={bStyle(this.state.newTool, 'ellipticalRoi')}
          onClick={this.addEllipticalRoi}
        />
        <Button
          className="fa fa-angle-left"
          style={bStyle(this.state.newTool, 'angle')}
          onClick={this.addAngle}
        />
        <Button
          className="fa fa-edit"
          style={bStyle(this.state.newTool, 'edit')}
          onClick={this.editMode}
        />

        {this.state.editText ? (
          <TextEditor
            value={this.state.textValue}
            onChange={this.updateText}
            onBlur={this.pushText}
          />
        ) : null}

        <div className={style.annotationContainer}>
          {lengthAnnotations &&
            lengthAnnotations.data.map((item, idx) => (
              <LengthRenderer
                key={`length-${idx}`}
                item={item}
                activate={this.activate}
                delete={this.delete}
              />
            ))}
          {arrowAnnotations &&
            arrowAnnotations.data.map((item, idx) => (
              <ArrowRenderer
                key={`arrow-${idx}`}
                item={item}
                activate={this.activate}
                delete={this.delete}
              />
            ))}
          {ellipticalAnnotations &&
            ellipticalAnnotations.data.map((item, idx) => (
              <EllipticalRenderer
                key={`arrow-${idx}`}
                item={item}
                activate={this.activate}
                delete={this.delete}
              />
            ))}
        </div>
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
