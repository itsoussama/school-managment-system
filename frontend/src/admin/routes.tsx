import { RouteAuthorization } from "@components/routeAuthorization";
import Admin from "@admin/index";
import AddTeacher from "@admin/pages/teachers/addTeacher";
import { ViewTeachers } from "@admin/pages/teachers/viewTeachers";
import AddStudent from "@admin/pages/students/addStudent";
import { ViewStudents } from "@admin/pages/students/viewStudents";
import AddParent from "@admin/pages/parents/addParent";
import { ViewParents } from "@admin/pages/parents/viewParents";
import Dashboard from "@admin/pages/dashboard";
import DataManagement from "@admin/pages/configuration/dataManagement";
import AddResources from "./pages/resources/addResources";
import { ViewResources } from "./pages/resources/viewResources";
import MaintenanceRequests from "./pages/resources/maintenanceRequests";

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
    {
      path: "resources",
      children: [
        {
          path: "new",
          element: <AddResources />,
        },
        {
          path: "manage",
          element: <ViewResources />,
        },
        {
          path: "maintenance-requests",
          element: <MaintenanceRequests />,
        },
      ],
    },
    {
      path: "configuration",
      children: [
        {
          path: "data-management",
          element: <DataManagement />,
        },
      ],
    },
  ],
};
