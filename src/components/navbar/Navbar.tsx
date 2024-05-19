import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Button from "@components/ui/button";
import Logo from "@components/logo";

export type NavbarItem = {
  icon: JSX.Element;
} & (
  | {
      link: string;
    }
  | {
      onClick: () => void;
    }
);

type NavbarProps = {
  items: NavbarItem[];
};

export const Navbar = ({ items }: NavbarProps) => {
  return (
    <div className={styles.container}>
      {items.map((item, index) =>
        "link" in item ? (
          <NavLink key={index} className={styles.item} to={item.link}>
            {item.icon}
          </NavLink>
        ) : (
          <Button key={index} className={styles.item} onClick={item.onClick}>
            {item.icon}
          </Button>
        )
      )}
    </div>
  );
};

export default Navbar;
