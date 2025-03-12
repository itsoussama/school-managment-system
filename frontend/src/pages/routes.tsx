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
            <WithPermission action="add_administrator">
              <AddAdministrators />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission action="view_administrators">
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
            <WithPermission action="add_teacher">
              <AddTeacher />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission action="view_teachers">
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
            <WithPermission action="add_student">
              <AddStudent />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission action="view_students">
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
            <WithPermission action="add_parent">
              <AddParent />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission action="view_parents">
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
            <WithPermission action="budget_management">
              <BudgetManagement />
            </WithPermission>
          ),
        },
        {
          path: "fee/manage",
          element: (
            <WithPermission action="fee_management">
              <FeeManagement />
            </WithPermission>
          ),
        },
        {
          path: "payroll/manage",
          element: (
            <WithPermission action="payroll_management">
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
            <WithPermission action="add_resource">
              <AddResources />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission action="view_resources">
              <ViewResources />
            </WithPermission>
          ),
        },
        {
          path: "maintenance-requests",
          element: (
            <WithPermission action="manage_resources_requests">
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
            <WithPermission action="add_classroom">
              <AddClassroom />
            </WithPermission>
          ),
        },
        {
          path: "manage",
          element: (
            <WithPermission action="view_classrooms">
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
            <WithPermission action="data_export">
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
                <WithPermission action="general_settings">
                  <GeneralSettings />
                </WithPermission>
              ),
            },
            {
              path: "school-levels",
              element: (
                <WithPermission action="school_levels_config">
                  <SchoolLevels />
                </WithPermission>
              ),
            },
            {
              path: "subjects",
              element: (
                <WithPermission action="subjects_config">
                  <Subjects />
                </WithPermission>
              ),
            },
            {
              path: "timetable",
              element: (
                <WithPermission action="timetable_config">
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
