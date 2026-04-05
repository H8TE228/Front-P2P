import { RootLayout } from "@/components/layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, Test } from "@/pages";

function App() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/test",
          element: <Test />,
        },
        {
          path: "*",
          element: (
            <div className="mb-20 px-4 pt-8">
              <h1 className="text-center text-3xl">
                404: Страница не найдена
              </h1>
            </div>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
