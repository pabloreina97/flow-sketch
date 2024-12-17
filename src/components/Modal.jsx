import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ title, isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2 className='modal-title'>{title}</h2>
        <div className='modal-body'>{children}</div>
        <div className='modal-actions'>
          <button className='modal-button cancel' onClick={onClose}>
            Cancelar
          </button>
          <button className='modal-button confirm' onClick={onConfirm}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
