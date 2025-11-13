import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {Bars3Icon, HomeIcon, CursorArrowRaysIcon, FilmIcon, UserCircleIcon} from '@heroicons/react/24/solid'

const menuItems = [
    {
        icon:<HomeIcon className="size-6"/>,
        label:'Início',
        path:''
    },
    {
        icon:<FilmIcon className="size-6"/>,
        label:'Obras',
        path:'works'
    },
    {
        icon:<CursorArrowRaysIcon className="size-6"/>,
        label:'Charts',
        path:'charts'
    }
]

export default function Sidebar(){

    const navigate = useNavigate();

    const [open, setOpen] = useState(false)

    return(
        <nav className={`shadow-md h-screen p-2 flex flex-col duration-500 ${open ? 'w-60':'w-16'}`}>
            {/* Header */}
            <div className="px-3 py-2 h-20 flex justify-between items-center">
                <h2 className={`${open ? '':'hidden'}`}>Character Link</h2>
                <Bars3Icon className="size-6 cursor-pointer" onClick={() => setOpen(!open)}/>
            </div>

            {/* Body */}
             <ul className="flex-1">
                {menuItems.map((item, index) => {
                    return(
                        <li key={index} onClick={()=>navigate(`/${item.path}`)}
                        className="px-3 py-2 my-2 hover:bg-amber-600 rounded-md duration-300 cursor-pointer flex gap-2 items-center group">
                            <div>{item.icon}</div>
                            <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>{item.label}</p>
                            <p className={`${open && 'hidden' } absolute left-32 shadow-md rounded-md w-0 p-0  overflow-hidden group-hover:w-fit group-hover:p-2`}>{item.label}</p>
                        </li>
                    );
                })}
            </ul>

            {/* Footer */}
            <div className="flex items-center gap-2 px-3 py-2">
                <div>
                    <UserCircleIcon className="size-6"/>
                </div>
                <div className={`leading-5 ${!open && 'w-0 translate-x-24 duration-500'} overflow-hidden`}>
                    <p>Gabriela</p>
                    <span className="text-xs">gabriela@gmail.com</span>
                </div>
            </div>
           
        </nav>
    )
}