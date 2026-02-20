import React, { createContext, useState, useContext, useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => sessionStorage.getItem("role") || null);
  const [CommonIsLoading, setCommonIsLoading] = useState(false);

  useEffect(() => {
    if (role) {
      sessionStorage.setItem("role", role);
    } else {
      sessionStorage.removeItem("role");
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, CommonIsLoading, setCommonIsLoading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
};