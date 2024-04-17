import styles from "./Button.module.css";

import { ComponentProps, forwardRef } from "react";

type ButtonProps = ComponentProps<"button">;

type ButtonRef = HTMLButtonElement;

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  return <button className={styles.button} ref={ref} {...props} />;
});

export default Button;
