import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { DocumentTextIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

// Componente Menu de Ações
function ActionMenu({ chartId }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = () => {
        console.log('Editar chart:', chartId);
        setIsOpen(false);
    };

    const handleRename = () => {
        console.log('Renomear chart:', chartId);
        setIsOpen(false);
    };

    const handleDelete = () => {
        console.log('Deletar chart:', chartId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition rounded-t-lg"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                            Editar
                        </button>
                        <button
                            onClick={handleRename}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                            
                            <DocumentTextIcon className="w-4 h-4" />
                            Renomear
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition rounded-b-lg"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Deletar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Componente Tabela de Charts
function ChartsTable() {
    const charts = [
        {
            id: 1,
            title: "Mapa de Personagens - Harry Potter",
            relatedWorks: ["Harry Potter - Pedra Filosofal", "Harry Potter - Câmara Secreta"],
            createdAt: "2024-01-15",
            updatedAt: "2024-11-20"
        },
        {
            id: 2,
            title: "Relacionamentos - Senhor dos Anéis",
            relatedWorks: ["O Senhor dos Anéis - A Sociedade do Anel"],
            createdAt: "2024-02-10",
            updatedAt: "2024-11-25"
        },
        {
            id: 3,
            title: "Universo Marvel - Vingadores",
            relatedWorks: ["Vingadores", "Capitão América", "Homem de Ferro"],
            createdAt: "2024-03-05",
            updatedAt: "2024-11-28"
        }
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-bold">
                            Título
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-bold">
                            Obras Relacionadas
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-bold">
                            Criado em
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-bold">
                            Modificado em
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-bold">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {charts.map((chart) => (
                        <tr 
                            key={chart.id} 
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td className="py-2 px-4">
                                <span className="font-medium text-gray-800 text-sm">
                                    {chart.title}
                                </span>
                            </td>
                            <td className="py-2 px-4">
                                <div className="flex flex-wrap gap-1">
                                    {chart.relatedWorks.map((work, index) => (
                                        <span 
                                            key={index}
                                            className="inline-block bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded-full"
                                        >
                                            {work}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="py-2 px-4">
                                <span className="text-[12px] text-gray-600">
                                    {formatDate(chart.createdAt)}
                                </span>
                            </td>
                            <td className="py-2 px-4">
                                <span className="text-[12px] text-gray-600">
                                    {formatDate(chart.updatedAt)}
                                </span>
                            </td>
                            <td className="py-2 px-4">
                                <ActionMenu chartId={chart.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



function Library(){
    
    return (
        <div className="flex-1 p-8 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Minha Biblioteca</h1>
                <SearchBar/>
            </div>

            {/* Container Principal */}
            <div className="flex flex-col bg-white rounded-2xl shadow-md p-6">
                {/* Favoritos */}
                <div>
                    <h2>Favoritos:</h2>
                </div>

                {/* Meus Charts */}
                <div>
                    <h2>Meus Charts:</h2>
                    <ChartsTable />
                </div>

            </div>
        </div>
    );
}

export default Library;