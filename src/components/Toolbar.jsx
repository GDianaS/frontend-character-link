import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';

function RelatedWorks(){
    return(
        <div>
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm">Obras:</h3>
                <PlusIcon className="size-5"/>
            </div>
        </div>
    )
};

function DrawerCustom(){
    return(
        <div className="inline-flex" role="group">
            <button type="button" className="px-3 py-2 border text-sm">Personagens</button>
            <button type="button" className="px-3 py-2 border text-sm">Relacionamentos</button>
        </div>
    )
};

function Toolbar(){
    return(
        <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-sm m-4 p-4 min-w-[210px]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold">Título da Obra do Chart</h3>
                    <ChevronDownIcon className="size-4"/>
                </div>
                <p className="text-gray-500">Subtítulo</p>
            </div>

            <RelatedWorks/>
            {/* <DrawerCustom/> */}
            <p>Personagens:</p>
        </div>
    )
};


export default Toolbar;
