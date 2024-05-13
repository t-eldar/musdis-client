import styles from "./Alert.module.css";

import * as Toast from "@radix-ui/react-toast";
import { useAlertStore } from "@stores/use-alert-store";
import { combineClassNames } from "@utils/style-utils";
import { TbInfoCircleFilled } from "react-icons/tb";

const Alert = () => {
  const state = useAlertStore((s) => s.state);
  const open = useAlertStore((s) => s.open);
  const setOpen = useAlertStore((s) => s.setOpen);

  if (!state) {
    return;
  }

  const variantClass =
    state.variant === "warning"
      ? styles.warning
      : state.variant === "success"
      ? styles.success
      : styles.info;
  return (
    <>
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className={combineClassNames(styles.root, variantClass)}
      >
        <Toast.Title className={styles.title}>
          <TbInfoCircleFilled /> {state.title}
        </Toast.Title>
        <Toast.Description className={styles.description}>
          {state.message}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className={styles.viewport} />
    </>
  );
};

export default Alert;
