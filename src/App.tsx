import { RootLayout } from "@/components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  CatalogPage,
  FavoritePage,
  HomePage,
  ListingFormPage,
  LoginPage,
  MessagesPage,
  ProductDetailPage,
  ProfileEditPage,
  ProfilePage,
  RegisterPage,
  TransactionsPage,
  UserProfilePage,
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
          path: "/product/:id",
          Component: ProductDetailPage,
        },
        {
          path: "/profile/:id",
          Component: UserProfilePage,
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
              Component: ListingFormPage,
            },
            { path: "my-profile", Component: ProfilePage },
            { path: "my-profile/edit", Component: ProfileEditPage },
            { path: "favorite", Component: FavoritePage },
            { path: "messages", Component: MessagesPage },
            { path: "transactions", Component: TransactionsPage },
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
