import React from "react";
import ReactDOM from "react-dom/client";
import "@src/index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "@src/App";
import "@lang/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@redux/store";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
