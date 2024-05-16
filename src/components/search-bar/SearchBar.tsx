import { Button } from "@components/ui/button";
import styles from "./SearchBar.module.css";

import { TextField } from "@components/ui/text-field";
import { combineClassNames } from "@utils/style-utils";
import { ComponentProps, useLayoutEffect, useRef, useState } from "react";
import { TbSearch } from "react-icons/tb";

type SearchBarProps = ComponentProps<"span"> & {
  value: string;
  setValue: (value: string) => void;
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch, value, setValue, ...rest }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const { className, ...props } = rest;

  function handleSearch() {
    onSearch(value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch(value);
    }
  }

  useLayoutEffect(() => {
    inputRef.current?.addEventListener("focusin", () => {
      setFocused(true);
    });
    inputRef.current?.addEventListener("focusout", () => {
      setFocused(false);
    });
  }, []);

  return (
    <span
      className={combineClassNames(
        styles.container,
        focused ? styles.focused : "",
        className
      )}
      {...props}
    >
      <TextField
        onKeyDown={handleKeyDown}
        ref={inputRef}
        className={styles["text-field"]}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder="Search..."
      />
      <Button className={styles["search-button"]} onClick={handleSearch}>
        <TbSearch />
      </Button>
    </span>
  );
};

export default SearchBar;
