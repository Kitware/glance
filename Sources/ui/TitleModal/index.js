import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-modal';

import FaIcon from '../FaIcon';

import style from './TitleModal.mcss';

function TitleModal(props) {
  return (
    <Modal
      className={style.modal}
      overlayClassName={style.overlay}
      ariaHideApp={false}
      {...props}
    >
      <div className={style.title}>{props.title}</div>
      <button className={style.close} onClick={props.onRequestClose}>
        <FaIcon type="times" />
      </button>
      <div className={style.content}>{props.children}</div>
    </Modal>
  );
}

TitleModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.object,
  onRequestClose: PropTypes.func,
};

TitleModal.defaultProps = {
  title: '',
  children: null,
  onRequestClose: () => {},
};

export default TitleModal;
