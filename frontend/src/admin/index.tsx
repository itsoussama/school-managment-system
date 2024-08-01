import { Layout } from "@src/layout/layout";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
