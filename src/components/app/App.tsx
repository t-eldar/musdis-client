import "@styles/variables.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "@components/layout";
import { SandboxPage } from "@pages/sandbox";
import { ReleasePage } from "@pages/release-page";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <div>main</div> },
        { path: "/sandbox", element: <SandboxPage /> },
        { path: "/releases/:releaseSlug", element: <ReleasePage /> },
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
