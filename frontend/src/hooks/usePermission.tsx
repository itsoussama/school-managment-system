import { useAppSelector } from "./useReduxEvent";
import { Roles } from "@src/middleware/withPermission";

export function usePermission(role: Roles | Roles[]): boolean {
  const user = useAppSelector((state) => state.userSlice.user);

  if (user) {
    if (Array.isArray(role)) {
      return user.role?.some((userRole) =>
        role.includes(userRole.name as Roles),
      );
    } else {
      return user.role[0].name?.includes(role);
    }
  }

  return false;
}
