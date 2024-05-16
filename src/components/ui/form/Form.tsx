import { ComponentProps, forwardRef } from "react";

type FormProps = ComponentProps<"form">;

type FormRef = HTMLFormElement;

/**
 * Form with default attributes built for use with "react-hook-form"
 */
const Form = forwardRef<FormRef, FormProps>((props, ref) => {
  function checkKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }
  return (
    <form ref={ref} {...props} onKeyDown={(e) => checkKeyDown(e)} noValidate>
      {props.children}
    </form>
  );
});

export default Form;
