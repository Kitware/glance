import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import style from './DragAndDrop.mcss';

export default class DragAndDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.target = null;
    this.container = document.createElement('div');
    // timer id for dragleave
    this.dragTimeout = null;

    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    this.target = document.querySelector(this.props.target);
    if (this.target) {
      this.target.appendChild(this.container);
      this.target.addEventListener('dragover', this.onDragOver);
      this.target.addEventListener('dragleave', this.onDragLeave);
      this.target.addEventListener('drop', this.onDrop);
    }
  }

  componentWillUnmount() {
    if (this.target) {
      this.target.removeEventListener('dragover', this.onDragOver);
      this.target.removeEventListener('dragleave', this.onDragLeave);
      this.target.removeEventListener('drop', this.onDrop);
    }
  }

  onDragOver(ev) {
    const types = ev.dataTransfer.types;
    if (
      types && types instanceof Array
        ? types.indexOf('Files') !== -1
        : 'Files' in types
    ) {
      this.setState({ visible: true });
      if (this.dragTimeout !== null) {
        window.clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
      }
      ev.preventDefault();
    }
  }

  onDragLeave(ev) {
    this.dragTimeout = window.setTimeout(() => {
      this.setState({ visible: false });
      this.dragTimeout = null;
    }, 50);
  }

  onDrop(ev) {
    this.props.onDrop(Array.from(ev.dataTransfer.files));
    this.setState({ visible: false });
    ev.preventDefault();
  }

  render() {
    const overlayClasses = [style.overlay];
    if (this.state.visible) {
      overlayClasses.push(style.overlayVisible);
    }

    return ReactDOM.createPortal(
      <div className={overlayClasses.join(' ')}>
        <span className={style.overlayText}>Drop files to open</span>
      </div>,
      this.container
    );
  }
}

DragAndDrop.propTypes = {
  target: PropTypes.string,
  onDrop: PropTypes.func,
};

DragAndDrop.defaultProps = {
  target: 'body',
  onDrop: () => {},
};
