import { Navigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { ROLES } from "@src/config/roles";
import AdminDashbord from "../adminDashbord";

const DashboardRouter = () => {
  const user = useAppSelector((state) => state.userSlice.user); // Get role from Redux

  if (user.role) {
    switch (user.role[0]?.name) {
      case ROLES[0]:
        return <AdminDashbord />;
      // case ROLES[2]:
      //   return <TeacherDashboard />;
      // case ROLES[3]:
      //   return <StudentDashboard />;
      // case ROLES[4]:
      //   return <ParentDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  }
};

export default DashboardRouter;
