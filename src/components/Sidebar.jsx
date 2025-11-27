import {ArrowRightStartOnRectangleIcon, BookOpenIcon, CursorArrowRaysIcon, HomeIcon, PuzzlePieceIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const menuItems = [
    {
        icon:<HomeIcon className="size-6"/>,
        label:'Dashboard',
        path:''
    },
    {
        icon:<SparklesIcon className="size-6"/>,
        label:'Obras',
        path:'works'
    },
    {
        icon:<CursorArrowRaysIcon className="size-6"/>,
        label:'Charts',
        path:'charts'
    },
    {
        icon:<BookOpenIcon className="size-6"/>,
        label:'Minha Biblioteca',
        path:'library'
    },
    {
        icon:<PuzzlePieceIcon className="size-6"/>,
        label:'Sobre',
        path:'about'
    }
]

export default function Sidebar(){
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState(0);

    const handleNavigation = (index, path) => {
        setActiveItem(index);
        navigate(`/${path}`);
    };


    return(
        <nav className="flex flex-col bg-white rounded-2xl shadow-md w-60 h-full p-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-6 mb-6 border-b-2 border-myown-bg-50">
                <div className="w-10 h-10 rounded-full bg-myown-primary-500 flex items-center justify-center">
                    <UserIcon className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Gabriela Sousa</p>
                    <p className="text-xs text-gray-500">gabrielasousa@gmail.com</p>
                </div>
            </div>

            {/* Body */}
            <ul className="flex flex-col gap-2 flex-1">
                {menuItems.map((item, index) => {
                    const isActive = activeItem === index;

                    return(
                        <li 
                            key={index}
                            onClick={() => handleNavigation(index, item.path)}
                            className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all ${
                                isActive 
                                    ? 'bg-purple-50 text-myown-secundary-500' 
                                    : 'text-black hover:bg-gray-50'
                            }`}
                        >
                            <div className={`w-5 h-5 ${isActive ? 'text-myown-secundary-500' : ''}`}>{item.icon}</div>
                            <span className="font-medium text-sm">{item.label}</span>
                        </li>
                    );
                })}
            </ul>

            {/* Footer */}
            <div className="flex items-center gap-3 cursor-pointer p-3 pt-6 mt-6 border-t-2 border-myown-bg-50 hover:bg-gray-50 rounded-lg transition-all">
                <ArrowRightStartOnRectangleIcon className="size-6 text-primary-700" />
                <span className="font-medium text-sm">Sair</span>
            </div>
        </nav>
    )
}