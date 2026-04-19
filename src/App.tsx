import { RootLayout } from "@/components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  CatalogPage,
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from "@/pages";
import cats from "@/assets/cats.png";
import { PrivateOnlyRoute, PublicOnlyRoute } from "./features";

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
          element: <PublicOnlyRoute />,
          children: [
            { path: "/login", Component: LoginPage },
            { path: "/register", Component: RegisterPage },
          ],
        },

        {
          element: <PrivateOnlyRoute />,
          children: [
            {
              path: "/listing-form",
              // Component: ListingFormPage,
            },
            { path: "profile", Component: ProfilePage },
            // { path: "favorite", Component: FavoritePage },
            // { path: "messages", Component: MessagesPage },
          ],
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
