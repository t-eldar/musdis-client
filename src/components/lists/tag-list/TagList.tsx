import { ComponentProps } from "react";
import styles from "./TagList.module.css";
import { combineClassNames } from "@utils/style-utils";

type TagListProps = ComponentProps<"ul"> & {
  tags: {
    name: string;
    slug: string;
  }[];
  onTagClick?: (tag: { name: string; slug: string }) => void;
};

const TagList = ({ tags, onTagClick, ...rest }: TagListProps) => {
  const { className, ...props } = rest;

  return (
    <ul className={combineClassNames(styles.list, className)} {...props}>
      {tags.map((tag) => (
        <li
          key={tag.slug}
          className={styles.item}
          onClick={() => onTagClick?.(tag)}
        >
          {tag.name}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
