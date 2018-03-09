import React from 'react';
import PropTypes from 'prop-types';

import UI from '../../ui';
import style from './AnnotationControl.mcss';

const { FaIcon, Button } = UI;

export default class LengthRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.activate = this.activate.bind(this);
    this.delete = this.delete.bind(this);
  }

  activate() {
    this.props.activate(this.props.item);
  }

  delete() {
    this.props.delete(this.props.item);
  }

  render() {
    return (
      <div
        className={
          this.props.item.active ? style.activeLineItem : style.lineItem
        }
        onClick={this.activate}
      >
        <FaIcon
          type="text-width"
          style={{ color: this.props.item.visible ? 'black' : 'lightgray' }}
        />
        <span>{this.props.item.length}</span>
        <Button
          className="fa fa-trash-alt"
          style={{
            borderRadius: '50%',
            fontSize: '10px',
            width: '25px',
            height: '25px',
            lineHeight: '0px',
          }}
          onClick={this.delete}
        />
      </div>
    );
  }
}

LengthRenderer.propTypes = {
  item: PropTypes.object.isRequired,
  activate: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
};
