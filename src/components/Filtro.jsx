import { useState } from "react";

function Filtro({ onApplyFilters }) {
  const [sortBy, setSortBy] = useState("az");
  const [selectedTags, setSelectedTags] = useState([]);

  const sortOptions = [
    { id: "az", label: "A–Z" },
    { id: "recent", label: "Recentes" },
    { id: "favorites", label: "Popularidade" },
  ];

  const categoryMap = {
  livro: "book",
  filme: "movie",
  série: "serie",
  mangá: "manga",
  ebook: "ebook",
  novel: "novel",
  hq: "comic",
  teatro: "theater",
  audiobook: "audiobook",
  fanfic: "fanfic"
};

const tags = [
  "livro",
  "filme",
  "série",
  "mangá",
  "ebook",
  "novel",
  "hq",
  "teatro",
  "audiobook",
  "fanfic"
];

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSortBy("az");
    setSelectedTags([]);
  };

  return (
    <div className="w-200 max-w-[250px] p-6 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>

        {(sortBy !== "az" || selectedTags.length > 0) && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Ordenação */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Ordenar por</h3>
        <div className="h-px bg-gray-200 mb-3" />

        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition 
                ${
                  sortBy === option.id
                    ? "bg-myown-primary-50 border-myown-primary-400 text-myown-primary-600 shadow-sm"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }
              `}
            >
              <span className="font-medium">{option.label}</span>
              <input
                type="radio"
                name="sort"
                value={option.id}
                checked={sortBy === option.id}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-4 h-4 text-myown-primary-600 focus:ring-myown-primary-400"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Categorias */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias</h3>
        <div className="h-px bg-gray-200 mb-3" />

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition shadow-sm
                  ${
                    isSelected
                      ? "bg-myown-primary-500 text-white hover:bg-myown-primary-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rodapé */}
      <div className="pt-4 border-t border-gray-200 space-y-4">
        {selectedTags.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tags ativas:</span>
            <span className="bg-myown-primary-100 text-myown-primary-700 font-bold px-3 py-1 rounded-full">
              {selectedTags.length}
            </span>
          </div>
        )}

        <button
            onClick={() => {
                const englishTags = selectedTags.map(tag => categoryMap[tag]);
                onApplyFilters({ sortBy, selectedTags: englishTags });
            }}
            className="w-full bg-myown-primary-500 hover:bg-myown-primary-600 text-white font-semibold py-3 rounded-xl transition shadow-md hover:shadow-lg"
            >
            Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default Filtro;
