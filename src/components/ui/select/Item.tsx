import styles from "./Select.module.css";

import { forwardRef } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { combineClassNames } from "@utils/style-utils";
import { TbCheck } from "react-icons/tb";

const Item = forwardRef<HTMLDivElement, RadixSelect.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <RadixSelect.Item
        className={combineClassNames(styles.item, className || "")}
        ref={forwardedRef}
        {...props}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className={styles["indicator"]}>
          <TbCheck />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  }
);

export default Item;
