import React from 'react';
import PropTypes from 'prop-types';

import style from './Progress.mcss';

function Progress(props) {
  const percent =
    props.percent < props.minPercent ? props.minPercent : props.percent;

  const barClasses = [style.bar];
  if (!props.visible) {
    barClasses.push(style.hidden);
  }

  return (
    <div className={style.container}>
      <div
        className={barClasses.join(' ')}
        style={{
          background: props.color,
          height: props.visible ? props.height : 0,
          width: `${percent * 100}%`,
        }}
      >
        <div
          className={style.leader}
          style={{
            boxShadow: `0 0 10px ${props.color}, 0 0 8px ${props.color}`,
          }}
        />
      </div>
    </div>
  );
}

Progress.propTypes = {
  visible: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.string,
  percent: PropTypes.number,
  minPercent: PropTypes.number,
};

Progress.defaultProps = {
  visible: false,
  color: 'black',
  height: '3px',
  percent: 0.0,
  minPercent: 0.05,
};

export default Progress;
