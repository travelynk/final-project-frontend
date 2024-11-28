import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import NavigationBar from "../components/Navbar";

export const Route = createRootRoute({
  component: () => (
    <>
      <NavigationBar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
