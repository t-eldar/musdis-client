import "@styles/variables.css";

import { Layout } from "@components/layout";
import { NavbarItem } from "@components/navbar/Navbar";
import { RequireAuthorization } from "@components/wrappers/require-authorization";
import { WithUser } from "@components/wrappers/with-user";
import { TbBrandCodesandbox, TbHome, TbLogout, TbUser } from "react-icons/tb";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import * as Toast from "@radix-ui/react-toast";
import { lazy } from "react";
import useSignOut from "@hooks/use-sign-out";

const ArtistPage = lazy(() => import("@pages/artists/artist-page"));
const ArtistsPage = lazy(() => import("@pages/artists/artists-page"));
const CreateArtistPage = lazy(
  () => import("@pages/artists/create-artist-page")
);
const CreateReleasePage = lazy(
  () => import("@pages/releases/create-release-page")
);
const ProfilePage = lazy(() => import("@pages/profile-page"));
const ReleasePage = lazy(() => import("@pages/releases/release-page"));
const ReleasesPage = lazy(() => import("@pages/releases/releases-page"));
const SandboxPage = lazy(() => import("@pages/sandbox"));
const SignInPage = lazy(() => import("@pages/sign-in-page"));
const SignUpPage = lazy(() => import("@pages/sign-up-page"));
const UpdateArtistPage = lazy(
  () => import("@pages/artists/update-artist-page")
);

const App = () => {
  const signOut = useSignOut();
  const navbarItems: NavbarItem[] = [
    {
      icon: <TbHome />,
      link: "/",
    },
    {
      icon: <TbUser />,
      link: "/profile",
    },
    {
      icon: <TbBrandCodesandbox />,
      link: "/sandbox",
    },
    {
      icon: <TbLogout />,
      onClick: () => signOut(),
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
        {
          path: "/profile",
          element: (
            <RequireAuthorization>
              <ProfilePage />
            </RequireAuthorization>
          ),
        },

        { path: "/releases", element: <ReleasesPage /> },
        { path: "/releases/:releaseSlug", element: <ReleasePage /> },

        { path: "/artists", element: <ArtistsPage /> },
        {
          path: "/artists/create-artist",
          element: (
            <RequireAuthorization>
              <CreateArtistPage />
            </RequireAuthorization>
          ),
        },

        { path: "/artists/:artistIdOrSlug", element: <ArtistPage /> },
        {
          path: "artists/:artistIdOrSlug/create-release",
          element: (
            <RequireAuthorization>
              <CreateReleasePage />
            </RequireAuthorization>
          ),
        },
        {
          path: "/artists/:artistIdOrSlug/update-artist",
          element: (
            <RequireAuthorization>
              <UpdateArtistPage />
            </RequireAuthorization>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <RouterProvider router={router} />
      </Toast.Provider>
    </>
  );
};

export default App;
