import "./App.css";
import "@styles/variables.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "@components/layout";
import { SandboxPage } from "@pages/sandbox";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <div>main</div> },
        { path: "/sandbox", element: <SandboxPage /> },
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
