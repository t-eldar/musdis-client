import styles from "./TextField.module.css";

import { ComponentProps, forwardRef } from "react";

/** Text field props. */
export type TextFieldProps = Omit<ComponentProps<"input">, "type"> & {
  type: "text" | "password" | "email" | "number" | "tel" | "url";
};

/** Text field ref. */
export type TextFieldRef = HTMLInputElement;

/**
 * Creates a text input field component with the specified props.
 *
 * @param {TextFieldProps} props - the properties for the text field
 * @return {JSX.Element} the input element with the specified class and props
 */
export const TextField = forwardRef<TextFieldRef, TextFieldProps>(
  (props, ref) => {
    return <input ref={ref} className={styles.input} {...props} />;
  }
);

export default TextField;
