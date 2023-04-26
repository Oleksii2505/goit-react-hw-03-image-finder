import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import { ModalOverlay, ModalContentWindow } from './Modal.styled';
import { Component } from 'react';
const modalRoot = document.querySelector('#modal-root');

// export const Modal = ({ closeModal, largeImage }) => {
//   return createPortal(
//     <ModalOverlay
//       onClick={() => {
//         closeModal();
//       }}
//     >
//       <ModalContentWindow>
//         <img src={largeImage} alt="tag" />
//       </ModalContentWindow>
//     </ModalOverlay>,
//     modalRoot
//   );
// };
export class Modal extends Component {
  
 componentDidMount() {
    window.addEventListener("keydown", this.closeModalOnEsc);
 }

 componentWillUnmount() {
   window.removeEventListener("keydown", this.closeModalOnEsc);
 }

 closeModalOnEsc = event => {
     if (event.code === 'Escape') {
         this.props.onClose();
     }
 }

 closeModalOnClickBackdrop = event => {
     if (event.target === event.currentTarget) {
         this.props.onClose();
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

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  largeImage: PropTypes.string.isRequired,
};