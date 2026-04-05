import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Test } from "@/pages";
import { LoginForm, RegisterForm } from "@/components";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Test,
    },
    {
      path: "login",
      Component: LoginForm,
    },
    {
      path: "register",
      Component: RegisterForm,
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
