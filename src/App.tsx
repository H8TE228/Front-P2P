import { RootLayout } from "@/components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage } from "@/pages";

function App() {
  const router = createBrowserRouter([
    {
      Component: RootLayout,
      children: [
        {
          path: "/",
          Component: HomePage,
        },
        {
          path: "/login",
          Component: LoginPage,
        },
        {
          path: "/register",
          Component: RegisterPage,
        },
        {
          path: "*",
          element: (
            <div className="min-h-[calc(100vh-416px)] px-4 pt-8">
              <h1 className="text-center text-3xl">404: Страница не найдена</h1>
            </div>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
