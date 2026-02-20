import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PageNotFound from "@/NotFound/PageNotFound";

// CONTEXT
import Loader from "@/components/ui/Loader";

import { useRoleContext } from "@/context/RoleContext";


const routePermissions = [
  {
    name: "COMMON",
    paths: [
      "/",
    ],
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "PURCHASE_MANAGER",
    paths: ["/invoice"],
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "PROJECT_MANAGER",
    paths: ["/requestmaterial"],
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

const PermissionRoute = () => {
  const { role, setRole, CommonIsLoading } = useRoleContext();

  console.log("Current Role in PermissionRoute:", role);
  const { pathname } = useLocation();

  // const isAllowed = useMemo(() => {
  //   if (!role) return false;

  //   return routePermissions.some(
  //     (group) => group.roles.includes(role) && group.paths.includes(pathname)
  //   );
  // }, [role, pathname]);

  if (CommonIsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // if (role === null || role === undefined) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  // if (isAllowed === false) {
  //   return <PageNotFound />;
  // }

  return <Outlet />;
};

export default PermissionRoute;
