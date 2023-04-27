import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Component } from 'react';
import { ModalOverlay, ModalContentWindow } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    largeImage: PropTypes.string.isRequired,
};
  
 componentDidMount() {
    window.addEventListener("keydown", this.closeModalOnEsc);
 }

 componentWillUnmount() {
   window.removeEventListener("keydown", this.closeModalOnEsc);
 }

 closeModalOnEsc = event => {
     if (event.code === 'Escape') {
         this.props.closeModal();
     }
 }

 closeModalOnClickBackdrop = event => {
     if (event.target === event.currentTarget) {
         this.props.closeModal();
     }
 }

 render () {
  const { largeImage} = this.props;
  return createPortal(
        <ModalOverlay
        onClick={this.closeModalOnClickBackdrop}
        >
          <ModalContentWindow>
            <img src={largeImage} alt="tag" />
          </ModalContentWindow>
        </ModalOverlay>,
        modalRoot
      );
 }

}
