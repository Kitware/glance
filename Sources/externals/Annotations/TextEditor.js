import React from 'react';
import PropTypes from 'prop-types';

import UI from '../../ui';
import style from './AnnotationControl.mcss';

const { FaIcon, Button } = UI;

const BUTTON_STYLE = {
  fontSize: '10px',
  width: '25px',
  height: '25px',
  lineHeight: '0',
  borderRadius: '50%',
  margin: '0 10px',
};

const ICON_STYLE = {
  margin: '0 10px',
};

export default function TextEditor(props) {
  return (
    <div className={style.lineItem}>
      <FaIcon type="font" style={ICON_STYLE} />
      <input
        type="text"
        style={{
          flex: 1,
        }}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      <Button className="fa fa-check" style={BUTTON_STYLE} />
    </div>
  );
}

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
