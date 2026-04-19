import { RootLayout } from "@/components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CatalogPage, HomePage, LoginPage, RegisterPage } from "@/pages";
import cats from "@/assets/cats.png";

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
          path: "/catalog",
          Component: CatalogPage,
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
          path: "/listing-form",
          // Component: ListingFormPage,
        },
        {
          path: "*",
          element: (
            <div className="flex flex-col items-center px-4 pt-8">
              <img
                src={cats}
                alt="404котики"
                className="max-h-100 rounded-xl opacity-90 shadow-xl"
              />
            </div>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
