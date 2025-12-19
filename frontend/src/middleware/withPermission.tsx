import { usePermission } from "@src/hooks/usePermission";
import { Navigate } from "react-router-dom";

export type Roles =
  | "Administrator"
  | "Administrator Staff"
  | "Student"
  | "Teacher"
  | "Parent";
interface WithPermissionProps {
  role: Roles | Roles[]; // The required role permission
  children: React.ReactNode;
}

const WithPermission = ({ role, children }: WithPermissionProps) => {
  const hasPermission = usePermission(role); // Check if user has permission
  // const navigation = useNavigate();

  if (!hasPermission) return <Navigate to="/" />; // Hide the item if permission is denied

  return children;
};

export default WithPermission;
