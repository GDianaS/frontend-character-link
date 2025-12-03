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
    fanfic: "fanfic",
  };

  const tags = Object.keys(categoryMap);

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
    onApplyFilters({ sortBy: "az", selectedTags: [] });
  };

  return (
    <div className="
      w-full max-w-[270px] 
      p-6 
      bg-white 
      rounded-3xl 
      shadow-[0_4px_20px_rgba(0,0,0,0.06)]
      border border-gray-100
      space-y-8
      transition
      duration-300
      hover:shadow-[0_6px_28px_rgba(0,0,0,0.08)]
    ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-gray-800">
          Filtros
        </h2>

        {(sortBy !== "az" || selectedTags.length > 0) && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-red-500 hover:text-red-600 font-medium underline-offset-2 hover:underline transition"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Ordenação */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Ordenar por</h3>
        <div className="h-[1px] bg-gray-200 mb-2" />

        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.id}
              className={`
                flex items-center justify-between p-3 
                rounded-xl cursor-pointer border 
                transition-all duration-200
                ${
                  sortBy === option.id
                    ? "bg-myown-primary-50 border-myown-primary-300 text-myown-primary-700 shadow-sm"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
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
                className="w-4 h-4 accent-myown-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Categorias */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Categorias</h3>
        <div className="h-[1px] bg-gray-200 mb-1" />

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                  shadow-sm border 
                  ${
                    isSelected
                      ? "bg-myown-primary-500 border-myown-primary-600 text-white hover:bg-myown-primary-600 hover:shadow-md"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
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
            <span className="
              bg-myown-primary-100 
              text-myown-primary-700 
              font-bold 
              px-3 py-1 
              rounded-full
            ">
              {selectedTags.length}
            </span>
          </div>
        )}

        <button
          onClick={() => {
            const englishTags = selectedTags.map((t) => categoryMap[t]);
            onApplyFilters({ sortBy, selectedTags: englishTags });
          }}
          className="
            w-full
            bg-myown-primary-500 
            hover:bg-myown-primary-600
            active:bg-myown-primary-700
            text-white font-semibold 
            py-3 rounded-xl 
            transition-all
            shadow-md hover:shadow-lg
          "
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default Filtro;

