import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline'

function SearchBar(){
    return(
        <div className="flex items-center border-gray-300 border-2 rounded-full shadow-sm p-2 gap-2 bg-white min-w-[300px]">
        <MagnifyingGlassIcon
            className="size-6 text-gray-400"/>

            <input
                type="text"
                placeholder="Buscar..."
                className=" outline-none w-full text-[12px]"
                />

        {/* <XCircleIcon
            className="size-6 text-gray-400"/> */}
    
        </div>
    )
}

export default SearchBar;