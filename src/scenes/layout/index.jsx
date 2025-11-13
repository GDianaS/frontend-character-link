import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Outlet } from "react-router-dom";

const Layout = () => {
    return(
        <div className="flex h-screen">
            {/* <Sidebar/> */}
            <main className="flex-1 p-4 overflow-y-auto bg-[#f3f3ff] relative">
                <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 -z-10] flex justify-center items-end'>
                    <div className='w-[450px] h-[450px] bg-linear-to-b from-[#fa39ad] to-[#fe6c4c] rounded-full blur-[120px]'>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;