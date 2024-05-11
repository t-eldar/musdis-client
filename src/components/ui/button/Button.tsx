import { combineClassNames } from "@utils/style-utils";
import styles from "./Button.module.css";

import { ComponentProps, forwardRef } from "react";

type ButtonProps = ComponentProps<"button">;

type ButtonRef = HTMLButtonElement;

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <button
      className={combineClassNames(styles.button, className)}
      ref={ref}
      {...rest}
    />
  );
});

export default Button;
