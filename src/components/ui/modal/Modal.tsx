import styles from "./Modal.module.css";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@components/ui/button";
import { TbX } from "react-icons/tb";

type ModalProps = Dialog.DialogProps;

const Modal = ({ children, ...rest }: ModalProps) => {
  return (
    <Dialog.Root {...rest}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles["dialog-overlay"]} />
        <Dialog.Content className={styles["dialog-content"]}>
          {children}
          <Dialog.Close asChild>
            <Button className={styles["icon-button"]}>
              <TbX color="var(--accent)" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
