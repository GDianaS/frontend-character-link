import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import FormCreateWork from "./components/FormCreateWork";
import { useNavigate } from "react-router-dom";

function WorkCreate(){

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1)
    };

    return(
        <div className="flex flex-col bg-white shadow-md rounded-2xl p-4 mt-2">
            {/* Voltar */}
            <button 
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 text-gray-800 hover:text-gray-900 transition">
                <ChevronLeftIcon className="size-6 text-gray-800 hover:text-gray-900 transition"/>
            <span className="font-medium">Voltar</span>
            </button>

            <h2 className="px-4 pt-2">Cadastrar Nova Obra:</h2>
            <FormCreateWork/>
            
        </div>
    )
};



export default WorkCreate;