import { RouteAuthorization } from "@components/routeAuthorization";
import Admin from "@admin/index";
import AddTeacher from "@admin/pages/teachers/addTeacher";
import { ViewTeachers } from "@admin/pages/teachers/viewTeachers";
import AddStudent from "@admin/pages/students/addStudent";
import { ViewStudents } from "@admin/pages/students/viewStudents";
import AddParent from "@admin/pages/parents/addParent";
import { ViewParents } from "@admin/pages/parents/viewParents";
import Dashboard from "@admin/pages/dashboard";

export const AdminRouter = {
  path: "/",
  element: <Admin />,
  loader: RouteAuthorization,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
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
};
