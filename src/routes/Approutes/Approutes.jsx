import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
    Navigate,
} from "react-router-dom";

// MainLayout
import Mainlayout from "@/mainlayout/Mainlayout";

// Dashboard
import Dashboard from "@/dashboard/Dashboard";


const Approutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Mainlayout />}>
                <Route index element={<Dashboard />} />
            </Route>
        </Routes>
    )
}

export default Approutes