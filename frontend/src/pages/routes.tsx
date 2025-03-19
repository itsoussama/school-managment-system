import Main from ".";
import DashboardRouter from "./dashbord/utils/dashboardRouter";
import Profile from "./profile/profile";
import Preference from "./profile/preference";
import AddAdministrators from "./administrators/addAdministrators";
import { ViewAdministrators } from "./administrators/viewAdministrators";
import { ProtectedRoute } from "@src/utils/protectedRoute";
import WithPermission from "@src/middleware/withPermission";
import AddTeacher from "./teacher/addTeacher";
import { ViewTeachers } from "./teacher/viewTeachers";
import AddStudent from "./student/addStudent";
import { ViewStudents } from "./student/viewStudents";
import AddParent from "./parent/addParent";
import { ViewParents } from "./parent/viewParents";
import BudgetManagement from "./finance/budgetManagement";
import FeeManagement from "./finance/feeManagement";
import PayrollManagement from "./finance/payrollManagement";
import AddResources from "./resource/addResources";
import { ViewResources } from "./resource/viewResources";
import MaintenanceRequests from "./resource/maintenanceRequests";
import AddClassroom from "./classrooms/addClassroom";
import { ViewClassrooms } from "./classrooms/viewClassrooms";
import DataManagement from "./configuration/dataManagement";
import GeneralSettings from "./configuration/school/generalSettings";
import SchoolLevels from "./configuration/school/schoolLevels";
import Subjects from "./configuration/school/subjects";
import Timetable from "./configuration/school/timetable";

export const MainRouter = {
  path: "/",
  element: <Main />,
  loader: ProtectedRoute,
  children: [
    {
      index: true,
      element: <DashboardRouter />,
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
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <AddAdministrators />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <ViewAdministrators />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "teachers",
      children: [
        {
          path: "new",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <AddTeacher />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <ViewTeachers />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "students",
      children: [
        {
          path: "new",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <AddStudent />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <ViewStudents />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "parents",
      children: [
        {
          path: "new",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <AddParent />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <ViewParents />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "finance",
      children: [
        {
          path: "budget/manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <BudgetManagement />
            </WithPermission>
          ),
        },
        {
          path: "fee/manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <FeeManagement />
            </WithPermission>
          ),
        },
        {
          path: "payroll/manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <PayrollManagement />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "resources",
      children: [
        {
          path: "new",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <AddResources />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <ViewResources />
            </WithPermission>
          ),
        },
        {
          path: "maintenance-requests",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <MaintenanceRequests />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "classrooms",
      children: [
        {
          path: "new",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <AddClassroom />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <ViewClassrooms />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "configuration",
      children: [
        {
          path: "data-management",
          element: (
            <WithPermission role={["Administrator", "Administrator Staff"]}>
              <DataManagement />
            </WithPermission>
          ),
        },
        {
          path: "settings",
          children: [
            {
              path: "general",
              element: (
                <WithPermission role={["Administrator", "Administrator Staff"]}>
                  <GeneralSettings />
                </WithPermission>
              ),
            },
            {
              path: "school-levels",
              element: (
                <WithPermission role={["Administrator", "Administrator Staff"]}>
                  <SchoolLevels />
                </WithPermission>
              ),
            },
            {
              path: "subjects",
              element: (
                <WithPermission role={["Administrator", "Administrator Staff"]}>
                  <Subjects />
                </WithPermission>
              ),
            },
            {
              path: "timetable",
              element: (
                <WithPermission role={["Administrator", "Administrator Staff"]}>
                  <Timetable />
                </WithPermission>
              ),
            },
          ],
        },
      ],
    },
  ],
};
