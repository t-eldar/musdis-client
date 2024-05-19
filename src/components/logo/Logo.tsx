import { combineClassNames } from "@utils/style-utils";
import styles from "./Logo.module.css";
import { useNavigate } from "react-router-dom";

type LogoProps = {
  className?: string;
  size: "small" | "medium" | "large";
  clickable: boolean;
};
const sizeMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};
const Logo = ({ className, size, clickable = false }: LogoProps) => {
  const sizeClassName = sizeMap[size];

  const navigate = useNavigate();
  return (
    <h1
      className={combineClassNames(
        styles.logo,
        className,
        sizeClassName,
        clickable ? styles.clickable : undefined
      )}
      onClick={clickable ? () => navigate("/") : undefined}
    >
      musdis
    </h1>
  );
};

export default Logo;
