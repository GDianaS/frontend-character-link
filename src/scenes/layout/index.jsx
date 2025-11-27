import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Outlet } from "react-router-dom";

const Layout = () => {
    return(
        <div className="flex bg-myown-bg-50 min-h-screen">
            <div className="p-2 h-screen sticky top-0">
                <Sidebar /> 
            </div>
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;