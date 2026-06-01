import React from 'react';
import './Modal.css';

// Это описание того, что наша функция принимает на вход
interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({ active, setActive, children }: ModalProps) => {
  return (
    // Если active = true, окно появляется. Если false — оно невидимо.
    <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
      {/* stopPropagation нужно, чтобы окно не закрывалось при клике на сам контент */}
      <div className="modal_content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;