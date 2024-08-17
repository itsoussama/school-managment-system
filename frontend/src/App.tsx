import { createBrowserRouter } from "react-router-dom";
import "@src/App.css";
import Admin from "@admin/index";
import AddTeacher from "@src/admin/pages/teachers/addTeacher";
import { ViewTeachers } from "./admin/pages/teachers/viewTeachers";
import AddStudent from "./admin/pages/students/addStudent";
import { ViewStudents } from "./admin/pages/students/viewStudents";
import AddParent from "./admin/pages/parents/addParent";
import { ViewParents } from "./admin/pages/parents/viewParents";

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
      {
        path: "students",
        children: [
          {
            path: "new",
            element: <AddStudent />,
          },
          {
            path: "manage",
            element: <ViewStudents />,
          },
        ],
      },
      {
        path: "parents",
        children: [
          {
            path: "new",
            element: <AddParent />,
          },
          {
            path: "manage",
            element: <ViewParents />,
          },
        ],
      },
    ],
  },
]);

// path: i18n.t("teachers", { ns: "path" }), :=> this snipet will translate the path namespace
