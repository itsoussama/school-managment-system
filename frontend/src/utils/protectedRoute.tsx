// import { useAppSelector } from "@hooks/useReduxEvent";
import { redirect } from "react-router-dom";

export async function ProtectedRoute() {
  const auth = window.localStorage.getItem("accessToken");
  if (!auth) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return redirect("/login");
  }
  return null;
}
