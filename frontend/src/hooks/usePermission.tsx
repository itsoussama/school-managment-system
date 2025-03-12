import { PERMISSIONS } from "@config/permissions";
import { useAppSelector } from "./useReduxEvent";

export function usePermission(action: string) {
  const user = useAppSelector((state) => state.userSlice.user);
  return (
    user &&
    PERMISSIONS[user.role[0].name as keyof typeof PERMISSIONS]?.includes(action)
  );
}
