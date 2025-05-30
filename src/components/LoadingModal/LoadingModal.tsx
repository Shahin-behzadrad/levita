import styles from "./LoadingModal.module.scss";

const LoadingModal = ({ content = "loading..." }: { content?: string }) => (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{content}</p>
    </div>
  </div>
);

export default LoadingModal;
