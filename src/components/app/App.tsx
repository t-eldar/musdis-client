import "@styles/variables.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "@components/layout";
import { SandboxPage } from "@pages/sandbox";
import { ReleasePage } from "@pages/release-page";
import { ReleasesPage } from "@pages/releases-page";
import { ArtistsPage } from "@pages/artists-page";
import { ArtistPage } from "@pages/artist-page";
import { NavbarItem } from "@components/navbar/Navbar";
import { TbHome } from "react-icons/tb";
import { SignInPage } from "@pages/sign-in-page";
import SignUpPage from "@pages/sign-up-page";

const App = () => {
  const navbarItems: NavbarItem[] = [
    {
      icon: <TbHome />,
      link: "/",
    },
    {
      icon: <TbHome />,
      link: "/",
    },
  ];
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout navbarItems={navbarItems} />,
      children: [
        { path: "/sandbox", element: <SandboxPage /> },

        { path: "", element: <div>main</div> },

        { path: "/sign-in", element: <SignInPage /> },
        { path: "/sign-up", element: <SignUpPage /> },

        { path: "/releases", element: <ReleasesPage /> },
        { path: "/releases/:releaseSlug", element: <ReleasePage /> },

        { path: "/artists", element: <ArtistsPage /> },
        { path: "/artists/:artistIdOrSlug", element: <ArtistPage /> },

        // { path: "/profile", element: <ProfilePage /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
