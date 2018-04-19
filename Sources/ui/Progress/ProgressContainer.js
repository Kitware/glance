import React from 'react';
import PropTypes from 'prop-types';

import EventManager from './EventManager';

import style from './ProgressContainer.mcss';

/* eslint-disable jsx-a11y/mouse-events-have-key-events */
export default class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      percent: 0,
      message: '',
      messageVisible: true,
    };

    this.messageEl = null;
    this.unsubscribes = [];

    this.hideMessage = this.hideMessage.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    this.unsubscribes = [
      EventManager.on('percent', (percent) => this.setState({ percent })),
      EventManager.on('visible', (visible) => this.setState({ visible })),
      EventManager.on('message', (message) => this.setState({ message })),
    ];
  }

  componentDidUpdate() {
    if (!this.state.visible) {
      document.removeEventListener('mousemove', this.onMouseMove, true);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove, true);
    while (this.unsubscribes.length) {
      this.unsubscribes.pop()();
    }
  }

  onMouseMove(ev) {
    const x = ev.pageX;
    const y = ev.pageY;
    if (
      x < this.region.left ||
      x > this.region.right ||
      y < this.region.top ||
      y > this.region.bottom
    ) {
      document.removeEventListener('mousemove', this.onMouseMove, true);
      this.setState({ messageVisible: true });
    }
  }

  hideMessage() {
    const rect = this.messageEl.getBoundingClientRect();
    this.region = {
      top: rect.y,
      left: rect.x,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height,
    };

    document.addEventListener('mousemove', this.onMouseMove, true);
    this.setState({ messageVisible: false });
  }

  render() {
    const { color, height, minPercent } = this.props;

    const percent = Math.min(
      this.state.percent < minPercent ? minPercent : this.state.percent,
      100
    );

    const messageStyles = [
      style.messageText,
      this.state.messageVisible && this.state.visible
        ? style.messageVisible
        : '',
    ].join(' ');

    return (
      <div>
        <div
          className={style.bar}
          style={{
            background: color,
            height: this.state.visible ? height : 0,
            width: `${percent}%`,
          }}
        >
          <div
            className={style.leader}
            style={{
              boxShadow: `0 0 10px ${color}, 0 0 8px ${color}`,
            }}
          />
        </div>
        <div className={style.messageBox}>
          <div
            ref={(r) => {
              this.messageEl = r;
            }}
            className={messageStyles}
            onMouseOver={this.hideMessage}
          >
            {this.state.message}
            <div className={style.spinner} />
          </div>
        </div>
      </div>
    );
  }
}

Progress.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  minPercent: PropTypes.number,
};

Progress.defaultProps = {
  color: 'black',
  height: '3px',
  minPercent: 5,
};
