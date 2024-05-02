import styles from "./Select.module.css";
import * as RxSelect from "@radix-ui/react-select";
import { TbChevronDown } from "react-icons/tb";
import { TbChevronUp } from "react-icons/tb";

type SelectProps = RxSelect.SelectProps & {
  placeholder?: string;
};

const Select = ({ placeholder, children, ...rest }: SelectProps) => {
  return (
    <RxSelect.Root {...rest}>
      <RxSelect.Trigger className={styles["trigger"]}>
        <RxSelect.Value placeholder={placeholder} />
        <RxSelect.Icon className={styles["icon"]}>
          <TbChevronDown />
        </RxSelect.Icon>
      </RxSelect.Trigger>
      <RxSelect.Portal>
        <RxSelect.Content className={styles["content"]}>
          <RxSelect.ScrollUpButton className={styles["scroll-button"]}>
            <TbChevronUp />
          </RxSelect.ScrollUpButton>
          <RxSelect.Viewport className={styles["viewport"]}>
            <RxSelect.Group>
              <RxSelect.Label className={styles.label}>
                {placeholder}
              </RxSelect.Label>
              {children}
            </RxSelect.Group>
          </RxSelect.Viewport>
          <RxSelect.ScrollDownButton className={styles["scroll-button"]}>
            <TbChevronDown />
          </RxSelect.ScrollDownButton>
        </RxSelect.Content>
      </RxSelect.Portal>
    </RxSelect.Root>
  );
};

export default Select;
