import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';

function SearchBar({ onSearch }) {

    const [value, setValue] = useState("");

    const handleChange = (e) => {
        const term = e.target.value;
        setValue(term);
        onSearch(term);  // envia para o Works
    };

    const clearSearch = () => {
        setValue("");
        onSearch(""); // limpa resultado no pai
    };

    return(
        <div className="flex items-center border-gray-300 border-2 rounded-full shadow-sm p-2 gap-2 bg-white min-w-[300px]">
            <MagnifyingGlassIcon className="size-6 text-gray-400"/>

            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Buscar por obra ou autor..."
                className="outline-none w-full text-[12px]"
            />

            {value && (
                <XCircleIcon 
                    onClick={clearSearch}
                    className="size-5 text-gray-400 cursor-pointer hover:text-gray-600"
                />
            )}
        </div>
    )
}

export default SearchBar;
