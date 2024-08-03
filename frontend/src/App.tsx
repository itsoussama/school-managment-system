import { createBrowserRouter } from "react-router-dom";
import "@src/App.css";
import Admin from "@admin/index";
import AddTeacher from "@admin/pages/teacher/addTeacher";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
    children: [
      {
        path: "teacher",
        children: [
          {
            path: "new",
            element: <AddTeacher />,
          },
        ],
      },
    ],
  },
]);
