import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Test } from "@/pages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Test />,
    },
    {
      path: "*",
      element: (
        <h1 className="pt-4 text-center text-3xl">404: Страница не найдена</h1>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
