import { createBrowserRouter } from "react-router-dom";
import "@src/App.css";
import Admin from "@admin/index";
import AddTeacher from "@src/admin/pages/teachers/addTeacher";
import { ViewTeachers } from "./admin/pages/teachers/viewTeachers";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
    children: [
      {
        path: "teachers",
        children: [
          {
            path: "new",
            element: <AddTeacher />,
          },
          {
            path: "manage",
            element: <ViewTeachers />,
          },
        ],
      },
    ],
  },
]);

// path: i18n.t("teachers", { ns: "path" }), :=> this snipet will translate the path namespace
