import { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom'

// CUSTOM COMPONENTS
import Navbar from './navbar/Navbar'
import Sidebar from './sidebar/Sidebar'

const Mainlayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth < 1024;
            setIsMobile(isNowMobile);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
                <div
                    className={`flex-1 transition-all duration-300 overflow-auto p-4 rounded-tl-3xl shadow-inner popf
                                   ${isMobile ? "ml-0" : sidebarOpen ? "ml-0" : "ml-0"}
                        `}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Mainlayout