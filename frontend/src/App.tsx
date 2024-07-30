import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@src/layout/layout";
import '@src/App.css'

export const routes = createBrowserRouter(
    [
        {
            path: '/',
            element: <Layout />
        }
    ]
) 