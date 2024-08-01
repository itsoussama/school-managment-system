import { createBrowserRouter } from "react-router-dom";
import "@src/App.css";
import Admin from "./admin";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
  },
]);
