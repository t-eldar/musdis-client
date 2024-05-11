import "@styles/variables.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "@components/layout";
import { SandboxPage } from "@pages/sandbox";
import { ReleasePage } from "@pages/release-page";
import { ReleasesPage } from "@pages/releases-page";
import { ArtistsPage } from "@pages/artists-page";
import { ArtistPage } from "@pages/artist-page";
import { NavbarItem } from "@components/navbar/Navbar";
import { TbHome, TbUser } from "react-icons/tb";
import { SignInPage } from "@pages/sign-in-page";
import SignUpPage from "@pages/sign-up-page";
import { ProfilePage } from "@pages/profile-page";
import withUser from "@hoc/with-user";
import WithUser from "@components/wrappers/with-user";

const App = () => {
  const navbarItems: NavbarItem[] = [
    {
      icon: <TbHome />,
      link: "/",
    },
    {
      icon: <TbUser />,
      link: "/profile",
    },
  ];
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <WithUser>
          <Layout navbarItems={navbarItems} />
        </WithUser>
      ),
      children: [
        { path: "/sandbox", element: <SandboxPage /> },

        { path: "", element: <div>main</div> },

        { path: "/sign-in", element: <SignInPage /> },
        { path: "/sign-up", element: <SignUpPage /> },
        { path: "/profile", element: <ProfilePage /> },

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
