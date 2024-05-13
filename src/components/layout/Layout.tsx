import styles from "./Layout.module.css";

import { AudioPlayerOverlay } from "@components/audio-player-overlay";
import PageLoader from "@components/loaders/page-loader";
import { Navbar } from "@components/navbar";
import { NavbarItem } from "@components/navbar/Navbar";
import { Alert } from "@components/ui/alert";
import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

type LayoutProps = {
  navbarItems: NavbarItem[];
};

const Layout = ({ navbarItems }: LayoutProps) => {
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar items={navbarItems} />
      </div>

      <div className={styles.content}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
        <Alert />
        {isOverlayActive && <div className={styles["extra-footer"]} />}
      </div>

      <AudioPlayerOverlay onActiveChange={setIsOverlayActive} />
    </div>
  );
};

export default Layout;
