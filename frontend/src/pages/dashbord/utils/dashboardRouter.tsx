import { Navigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { ROLES } from "@src/config/roles";
import AdminDashbord from "../adminDashbord";

const DashboardRouter = () => {
  const userRole = useAppSelector(
    (state) => state.userSlice.user?.role[0].name,
  ); // Get role from Redux

  switch (userRole) {
    case ROLES[0]:
      return <AdminDashbord />;
    // case ROLES[2]:
    //   return <TeacherDashboard />;
    // case ROLES[3]:
    //   return <StudentDashboard />;
    // case ROLES[4]:
    //   return <ParentDashboard />;
    default:
      return <Navigate to="/unauthorized" />;
  }
};

export default DashboardRouter;
