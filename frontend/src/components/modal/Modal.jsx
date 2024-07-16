import styles from './Modal.module.css';

// eslint-disable-next-line react/prop-types
const Modal = ({ children, onClose, icon }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <img className={styles.modalImg} src={icon} alt="" />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
