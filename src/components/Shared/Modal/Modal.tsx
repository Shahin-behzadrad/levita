import classes from "./Modal.module.scss";
import Button from "../Button";
import { ReactNode } from "react";

import Text from "../Text";
import { X } from "lucide-react";

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: number;
}

const Modal = ({
  title,
  maxWidth,
  isOpen,
  onClose,
  children,
  actions,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={classes.container}>
      <div className={classes.modalOverlay} onClick={onClose} />
      <div className={classes.modal} style={{ maxWidth: maxWidth }}>
        <div className={classes.modalHeader}>
          <Text value={title} className={classes.modalTitle} />
          {Boolean(onClose) && (
            <Button onClick={onClose} className={classes.closeIcon}>
              <X />
            </Button>
          )}
        </div>
        <div id="modal-scrollable" className={classes.modalBody}>
          {children}
        </div>
        {actions && <div className={classes.modalActions}>{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
