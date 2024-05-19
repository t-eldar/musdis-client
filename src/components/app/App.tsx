import "@styles/variables.css";

import { Layout } from "@components/layout";
import { NavbarItem } from "@components/navbar/Navbar";
import { RequireAuthorization } from "@components/wrappers/require-authorization";
import { WithUser } from "@components/wrappers/with-user";
import { useSignOut } from "@hooks/use-sign-out";
import { lazy } from "react";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { TbHome, TbLogin2, TbLogout, TbLogout2, TbUser, TbUsersGroup } from "react-icons/tb";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import * as Toast from "@radix-ui/react-toast";
import { useAuthStore } from "@stores/auth-store";

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

const SignInPage = lazy(() => import("@pages/sign-in-page"));
const SignUpPage = lazy(() => import("@pages/sign-up-page"));
const UpdateArtistPage = lazy(
  () => import("@pages/artists/update-artist-page")
);
const UpdateReleasePage = lazy(
  () => import("@pages/releases/update-release-page")
);

const HomePage = lazy(() => import("@pages/home-page"));
const NotFoundPage = lazy(() => import("@pages/not-found-page"));

const App = () => {
  const signOut = useSignOut();

  const user = useAuthStore((s) => s.user);

  const navbarItems: NavbarItem[] = [
    { icon: <TbHome />, link: "/" },
    { icon: <MdOutlineLibraryMusic />, link: "/releases" },
    { icon: <TbUsersGroup />, link: "/musicians" },
  ];

  const userNavbarItems: NavbarItem[] = user
    ? [
        { icon: <TbUser />, link: "/profile" },
        { icon: <TbLogout2 />, onClick: () => signOut() },
      ]
    : [
        {
          icon: <TbLogin2 />,
          link: "/sign-in",
        },
      ];
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <WithUser>
          <Layout navbarItems={navbarItems} userNavbarItems={userNavbarItems} />
        </WithUser>
      ),
      errorElement: (
        <WithUser>
          <Layout navbarItems={navbarItems} userNavbarItems={userNavbarItems}>
            <NotFoundPage />
          </Layout>
        </WithUser>
      ),
      children: [
        { path: "/not-found", element: <NotFoundPage /> },

        { path: "", element: <HomePage /> },

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
        {
          path: "/releases/:releaseSlug/update",
          element: <UpdateReleasePage />,
        },

        { path: "/musicians", element: <ArtistsPage /> },
        {
          path: "/musicians/create-musician",
          element: (
            <RequireAuthorization>
              <CreateArtistPage />
            </RequireAuthorization>
          ),
        },

        { path: "/musicians/:artistIdOrSlug", element: <ArtistPage /> },
        {
          path: "musicians/:artistIdOrSlug/create-release",
          element: (
            <RequireAuthorization>
              <CreateReleasePage />
            </RequireAuthorization>
          ),
        },
        {
          path: "/musicians/:artistIdOrSlug/update-musician",
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
