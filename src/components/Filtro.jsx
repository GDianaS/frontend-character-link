import { useState } from "react";

function Filtro() {
    const [sortBy, setSortBy] = useState('az');
    const [selectedTags, setSelectedTags] = useState([]);

    const sortOptions = [
        { id: 'az', label: 'A–Z' },
        { id: 'recent', label: 'Mais Recentes' },
        { id: 'favorites', label: 'Mais Favoritados' }
    ];

    const tags = [
        'livro',
        'filme', 
        'série',
        'mangá',
        'ebook',
        'novel',
        'hq',
        'teatro',
        'audiobook',
        'fanfic',
        'anime',
        'podcast'
    ];

    // const nomeFunção = (parâmetro) => {}
    const handleTagToggle = (tag) => {
        // marca ou desmarca uma categoria
        // se já estiver -> remove da lista
        // se não estiver -> adiciona na lista
        setSelectedTags( prevTag => 
            prevTag.includes(tag) ? prevTag.filter(t => t !== tag) : [...prevTag, tag]
        );
    };

    // limpar filtros
    const handleClearFilters = () => {
        setSortBy('az');
        setSelectedTags([]);
    };


  return (
    <div className="w-72">
        <h2>Filtros:</h2>
        {
            (sortBy !== 'az' || selectedTags.length > 0) && (
                <button
                onClick={handleClearFilters}
                >Limpar
                </button>
            )}
        
        {/* Ordenação */}
            <h3>Ordenar por:</h3>
            <div className="h-px bg-gray-200 mb-4"/>
            <div>
                {sortOptions.map((option)=>(
                    <label 
                        key={option.id}
                        className={`flex items-center justify-between p-3 cursor-pointer transition ${sortBy == option.id ? 'bg-myown-primary-200 border-2 border-myown-primary-500' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}`}>
                            <input
                                type="radio"
                                name="sort"
                                value={option.id}
                                checked={sortBy === option.id}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span>{option.label}</span>
                    </label>
                ))}
            </div>

        {/* Categorias */}
            <div>
                <h3>Categorias:</h3>
                <div className="h-px bg-gray-200 mb-4"/>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            isSelected
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {tag}
                        </button>
                        );
                    })}
                </div>
            </div>

            {/* Badge de Filtros Ativos e Botão Aplicar */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                {/* Contador de Tags */}
                {selectedTags.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tags ativas:</span>
                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">
                    {selectedTags.length}
                    </span>
                </div>
                )}

                {/* Botão Aplicar Filtro */}
                <button
                onClick={() => {
                    console.log('Filtros aplicados:', { sortBy, selectedTags });
                    // Aqui você pode chamar uma função do componente pai
                    // onApplyFilters({ sortBy, selectedTags });
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
                >
                Aplicar Filtros
                </button>
            </div>

    </div>
  );
}

export default Filtro;
