import { usePermission } from "@src/hooks/usePermission";
import { Navigate, useNavigate } from "react-router-dom";

interface WithPermissionProps {
  action: string; // The required action permission
  children: React.ReactNode;
}

const WithPermission = ({ action, children }: WithPermissionProps) => {
  const hasPermission = usePermission(action); // Check if user has permission
  // const navigation = useNavigate();

  if (!hasPermission) return <Navigate to="/" />; // Hide the item if permission is denied

  return children;
};

export default WithPermission;
