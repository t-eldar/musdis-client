import styles from "./Layout.module.css";

import { AudioPlayerOverlay } from "@components/audio-player-overlay";
import PageLoader from "@components/loaders/page-loader";
import Logo from "@components/logo";
import { Navbar } from "@components/navbar";
import { NavbarItem } from "@components/navbar/Navbar";
import { Alert } from "@components/ui/alert";
import { PropsWithChildren, Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

type LayoutProps = PropsWithChildren & {
  navbarItems: NavbarItem[];
  userNavbarItems: NavbarItem[];
};

const Layout = ({ navbarItems, children, userNavbarItems }: LayoutProps) => {
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles["navbar-container"]}>
        <div className={styles.logo}>
          <Logo size="small" clickable />
        </div>
        <div className={styles.navbar}>
          <Navbar items={navbarItems} />
          <Navbar items={userNavbarItems} />
        </div>
      </div>

      <div className={styles.content}>
        <Suspense fallback={<PageLoader />}>{children ?? <Outlet />}</Suspense>
        <Alert />
        {isOverlayActive && <div className={styles["extra-footer"]} />}
        <AudioPlayerOverlay onActiveChange={setIsOverlayActive} />
      </div>
    </div>
  );
};

export default Layout;
