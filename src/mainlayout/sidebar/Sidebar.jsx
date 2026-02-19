import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

// APIS 
import { userLogout } from "@/apis/login/login";

// ICONS 
import { FiChevronDown, FiChevronsRight } from "react-icons/fi";
import { BiData } from "react-icons/bi";
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  Building,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { FaCircle } from "react-icons/fa";
import { LuBuilding2 } from "react-icons/lu";


const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const handleLogout = async () => {
    try {
      const response = await userLogout();

      if (response?.status) {
        toast.success(response?.message || "Logged out successfully!");
      } else {
        toast.error(response?.message || "Logout failed on server!");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Something went wrong while logging out.");
    } finally {
      sessionStorage.clear("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      setRole(null);
      navigate("/login");
    }
  };

  const menu = [
    {
      id: "1",
      name: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      type: "single",
      path: "/",
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "2",
      name: "stock-management",
      label: "Stock Management",
      icon: Boxes,
      type: "dropdown",
      subMenu: [
        { label: "Request Material", path: "/requestmaterial" },
        { label: "Requisition Report", path: "/requistionreport" },
        { label: "Manage Inventory", path: "/inventory" },
        { label: "Transfer Inventory", path: "/transferinventoryreport" },
      ],
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "3",
      name: "accounts",
      label: "Accounts",
      icon: FileSpreadsheet,
      type: "dropdown",
      subMenu: [
        { label: "Invoice", path: "/invoice" },
        { label: "GRN", path: "/managegrn" },
      ],
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "4",
      name: "projects",
      label: "Projects",
      icon: Building,
      type: "dropdown",
      subMenu: [
        { label: "Manage Projects", path: "/managesite" },
      ],
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "5",
      label: "Company",
      name: "admin",
      icon: LuBuilding2,
      type: "dropdown",
      subMenu: [
        { label: "Manage Company", path: "/managecompany" },
      ],
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "6",
      label: "User Management",
      name: "user-management",
      icon: Users,
      type: "dropdown",
      subMenu: [
        { label: "Manage user", path: "/manageuser" },
        { label: "Manage vendor", path: "/managevendor", subMenuRoles: ["SUPER_ADMIN"], },
      ],
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    // {
    //   id: "6",
    //   label: "Client Management",
    //   name: "client-management",
    //   icon: Users,
    //   type: "dropdown",
    //   subMenu: [
    //     { label: "Manage Residential", path: "/generateresidentialunits" },
    //     { label: "Manage Client", path: "/manageclient", subMenuRoles: ["SUPER_ADMIN"], },
    //   ],
    //   roles: ["ADMIN", "SUPER_ADMIN"],
    // },
    {
      id: "7",
      label: "Manage Bid",
      name: "managebidadmin",
      icon: BiData,
      type: "dropdown",
      subMenu: [
        { label: "Manage Bid", path: "/managebidall" },
        { label: "Purchase Order", path: "/purchaseorder" },
      ],
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "8",
      name: "settings",
      label: "Settings",
      icon: Settings,
      type: "dropdown",
      subMenu: [
        { label: "Manage Material", path: "/mainmaterial" },
        { label: "Manage Units", path: "/manageunits" },
        { label: "Notification", path: "/notification" },
        { label: "Payment & HSN", path: "/settings" },
      ],
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "9",
      name: "logout",
      label: "Logout",
      icon: LogOut,
      type: "single",
      onClick: handleLogout,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
  ];


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDropdownClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const isActiveRoute = (path) => location.pathname === path;
  const handleLinkClick = (parentIndex) => {
    if (windowWidth < 768) {
      setIsOpen(false);

      if (openDropdown !== parentIndex) {
        setOpenDropdown(null);
      }
    }
  };

  return (
    <motion.div
      onMouseEnter={() => windowWidth >= 768 && setIsOpen(true)}
      onMouseLeave={() => {
        if (windowWidth >= 768) {
          setIsOpen(false);
          setOpenDropdown(null);
        }
      }}
      className={`
    sticky top-0 h-[95vh] shrink-0 flex flex-col bg-white
    shadow-sm mt-4 transition-all duration-500 ease-in-out
  `}
      style={{
        position: windowWidth < 768 ? "absolute" : "sticky",
        width:
          windowWidth < 768
            ? isOpen
              ? "235px"
              : "0px"
            : isOpen
              ? "235px"
              : "75px",
        left: 0,
        top: 50,
        height: "100vh",
        zIndex: 50,
      }}
    >
      <div className="flex-1 overflow-y-auto height-cal scrollbar-hide px-2 mb-0 md:mb-18">
        {menu.map((item, index) => {
          const Icon = item.icon;

          const isActive =
            isActiveRoute(item.path) ||
            item.subMenu?.some((sub) => isActiveRoute(sub.path));
          const isExpanded = openDropdown === index;

          return (
            <motion.div layout key={index} className="group relative">
              {item.type === "single" ? (
                item.path ? (
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`relative flex w-full items-center rounded-md py-3 transition-all duration-200 ${isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    <div
                      className={`grid place-content-center text-lg shrink-0 transition-all duration-300 ${isOpen ? "w-10 ml-2.5" : "w-15"
                        }`}
                    >
                      <Icon size={20} />
                    </div>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden whitespace-nowrap font-medium ml-1 text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={`relative flex w-full items-center rounded-md py-3 transition-all duration-200 ${isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    <div
                      className={`grid place-content-center text-lg shrink-0 transition-all duration-300 ${isOpen ? "w-10 ml-2.5" : "w-15"
                        }`}
                    >
                      <Icon size={20} />
                    </div>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden whitespace-nowrap font-medium ml-1 text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </button>
                )
              ) : (
                <>
                  <div
                    onClick={() => handleDropdownClick(index)}
                    className={`relative flex w-full items-center rounded-md py-3 transition-all duration-200 ${isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    <div
                      className={`grid place-content-center text-lg shrink-0 transition-all duration-300 ${isOpen ? "w-10 ml-2.5" : "w-15"
                        }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <AnimatePresence mode="wait">
                        {isOpen && (
                          <motion.span
                            key={item.name}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden whitespace-nowrap font-medium ml-1 text-sm"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        {isOpen && (
                          <motion.div
                            key={`${item.name}-arrow`}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              rotate: isExpanded ? 180 : 0,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              type: "spring",
                              stiffness: 150,
                              damping: 15,
                            }}
                            className="mr-2"
                          >
                            <FiChevronDown />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && isOpen && (
                      <motion.div
                        key="submenu-wrapper"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.45,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: -5 }}
                          animate={{ y: 0 }}
                          exit={{ y: -5 }}
                          transition={{ duration: 0.3 }}
                          className=" mt-1 flex flex-col space-y-1"
                        >
                          {item.subMenu.map((sub, i) => (
                            <Link
                              key={i}
                              to={sub.path}
                              onClick={() => handleLinkClick(index)}
                              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-all duration-200 ${isActiveRoute(sub.path)
                                ? "bg-indigo-50 text-indigo-600 font-medium"
                                : "text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ml-4 ${isActiveRoute(sub.path)
                                  ? "bg-indigo-600"
                                  : "bg-slate-400"
                                  }`}
                              >
                                {" "}
                                <FaCircle
                                  size={6}
                                  className={
                                    isActiveRoute(sub.path)
                                      ? "text-indigo-600"
                                      : "text-slate-400"
                                  }
                                />
                              </span>
                              <span className="whitespace-nowrap font-medium ml-1 text-sm">
                                {sub.label}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// --- Logo ---
const Logo = () => (
  <motion.div
    layout
    className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
  >
    <svg
      width="24"
      height="auto"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-slate-50"
    >
      <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
      <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
    </svg>
  </motion.div>
);

// --- Toggle Button ---
const ToggleClose = ({ open, setOpen }) => (
  <button
    onClick={() => setOpen((pv) => !pv)}
    className="border-t border-slate-300 hover:bg-slate-100 transition-all duration-300"
  >
    <div className="flex items-center p-2">
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="grid size-10 place-content-center text-lg"
      >
        <FiChevronsRight />
      </motion.div>
      <AnimatePresence mode="wait">
        {open && (
          <motion.span
            key="hide"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-xs font-medium text-slate-700"
          >
            Hide
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  </button>
);

export default Sidebar;
