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
import GeneralSettings from "./pages/configuration/school/generalSettings";
import GradesSections from "./pages/configuration/school/gradesSections";
import Timetable from "./pages/configuration/school/timetable";
import Subjects from "./pages/configuration/school/subjects";
import Profile from "./pages/profile/profile";
import Preference from "./pages/profile/preference";
import AddAdministrators from "./pages/administrators/addAdministrators";
import { ViewAdministrators } from "./pages/administrators/viewAdministrators";

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
      path: "profile",
      element: <Profile />,
    },
    {
      path: "preference",
      element: <Preference />,
    },
    {
      path: "administrators",
      children: [
        {
          path: "new",
          element: <AddAdministrators />,
        },
        {
          path: "manage",
          element: <ViewAdministrators />,
        },
      ],
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
        {
          path: "settings",
          children: [
            {
              path: "general",
              element: <GeneralSettings />,
            },
            {
              path: "grades-and-sections",
              element: <GradesSections />,
            },
            {
              path: "subjects",
              element: <Subjects />,
            },
            {
              path: "timetable",
              element: <Timetable />,
            },
          ],
        },
      ],
    },
  ],
};
