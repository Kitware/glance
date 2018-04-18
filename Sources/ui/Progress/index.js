import React from 'react';
import PropTypes from 'prop-types';

import style from './Progress.mcss';

/* eslint-disable jsx-a11y/mouse-events-have-key-events */
export default class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageVisible: true,
    };

    this.messageEl = null;

    this.hideMessage = this.hideMessage.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidUpdate() {
    if (!this.props.visible) {
      document.removeEventListener('mousemove', this.onMouseMove, true);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove, true);
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
    const { visible, color, height, percent, minPercent, message } = this.props;

    const outPercent = percent < minPercent ? minPercent : percent;

    const messageStyles = [
      style.messageText,
      this.state.messageVisible && visible ? style.messageVisible : '',
    ].join(' ');

    return (
      <div>
        <div
          className={style.bar}
          style={{
            background: color,
            height: visible ? height : 0,
            width: `${outPercent * 100}%`,
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
            {message}
            <div className={style.spinner} />
          </div>
        </div>
      </div>
    );
  }
}

Progress.propTypes = {
  visible: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.string,
  percent: PropTypes.number,
  minPercent: PropTypes.number,
  message: PropTypes.string,
};

Progress.defaultProps = {
  visible: false,
  color: 'black',
  height: '3px',
  percent: 0.0,
  minPercent: 0.05,
  message: '',
};
