import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ICONS 
import { Menu, User, Building2 } from "lucide-react";
import { Bell } from "lucide-react";
import { IoMoon } from "react-icons/io5";
import { LuSunMedium } from "react-icons/lu";

// COMPONENTS 
import { useTheme } from "@/context/ThemeContext";

const Navbar = ({ onToggleSidebar }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();


  return (
    <header className="flex items-center justify-between px-4 py-2">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600" />
          {/* <h1 className="text-lg font-semibold text-gray-800">
            RealEstate &nbsp; {formattedRole}
          </h1> */}
          <h1 className="text-lg font-semibold text-gray-800">
          </h1>
        </div>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        {/* <div className="text-xl bg-gray-200 p-2 rounded-full cursor-pointer">
          {theme === "light" ? <IoMoon onClick={toggleTheme} /> : <LuSunMedium onClick={toggleTheme}/>}
        </div> */}
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-300 bg-gray-200 cursor-pointer"
            onClick={() => { console.log("test") }}
          >
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-300 bg-gray-200 cursor-pointer"
          onClick={() => navigate("/userprofile")}
        >
          <User className="w-5 h-5 text-gray-600" />
        </button>


      </div>
    </header>
  );
};

export default Navbar;
