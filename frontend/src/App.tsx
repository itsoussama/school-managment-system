import { createBrowserRouter } from "react-router-dom";
import "@src/App.css";
import Login from "@src/auth/login";
import { AdminRouter } from "@admin/routes";

export const routes = createBrowserRouter([
  {
    index: true,
    path: "/login",
    element: <Login />,
  },
  AdminRouter,
]);

// path: i18n.t("teachers", { ns: "path" }), :=> this snipet will translate the path namespace
