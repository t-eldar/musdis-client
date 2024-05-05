import { AudioPlayerOverlay } from "@components/audio-player-overlay";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Outlet />
      <AudioPlayerOverlay />
    </>
  );
};

export default Layout;
