import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import NavigationBar from "../components/Navbar";
import { Toaster } from "../components/ui/toaster";
  
export const Route = createRootRoute({
  component: () => (
    <div className="">
      <NavigationBar />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </div>
  ),
});
