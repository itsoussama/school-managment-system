import { createBrowserRouter } from "react-router-dom";
import "@src/App.css";
import Login from "@src/auth/login";
import { MainRouter } from "@pages/routes";
import NotFoundPage from "./pages/fallback/notFoundPage";

export const routes = createBrowserRouter([
  {
    index: true,
    path: "/login",
    element: <Login />,
  },
  MainRouter,
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

// path: i18n.t("teachers", { ns: "path" }), :=> this snipet will translate the path namespace
