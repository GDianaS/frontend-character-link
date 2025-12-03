import { useEffect, useState } from 'react';
import Filtro from '../../components/Filtro';
import SearchBar from '../../components/SearchBar';
import WorkCard from '../../components/WorkCard';
import Pagination from '../../components/Pagination';
import { workService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/outline';


const Works = () => {

  const { getAll } = workService;
  const { user, isGuest } = useAuth();
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    sortBy: "az",
    selectedTags: []
  });

  // PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleWorks = filteredWorks.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await getAll();
        const loadedWorks = response.data.data.works;

        setWorks(loadedWorks);
        setFilteredWorks(loadedWorks);
      } catch (error) {
        console.error("Erro ao carregar obras", error);
      }
    };

    fetchWorks();
  }, []);

  // --- Função principal de filtragem ---
  const applyAllFilters = (search = searchTerm, filters = activeFilters) => {
    let result = [...works];

    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      result = result.filter(work =>
        work.title.toLowerCase().includes(lower) ||
        (work.author && work.author.toLowerCase().includes(lower))
      );
    }

    if (filters.selectedTags.length > 0) {
      result = result.filter(work =>
        filters.selectedTags.includes(work.category)
      );
    }

    if (filters.sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (filters.sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filters.sortBy === "favorites") {
      result.sort((a, b) => (b.favorites || 0) - (a.favorites || 0));
    }

    setFilteredWorks(result);
    setCurrentPage(1); // Reset da paginação ao filtrar
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyAllFilters(term, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyAllFilters(searchTerm, filters);
  };

  return (
    <div className="flex-1 p-8 min-h-screen">
      {/* Topo */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Obras</h1>
          {/* Badge de quantidade */}
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {filteredWorks.length}
          </span>
        </div>
        
        {/* Info de privacidade para convidados */}
        {isGuest && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <GlobeAltIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700">
              Visualizando apenas obras públicas
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Listagem */}
        <div className="flex-1">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-6">Obras:</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleWorks.map(work => (
              <div key={work._id} className="relative">
                <WorkCard data={work} />
                
                {/* Badge de privacidade */}
                {user && work.creator?._id === user.id && (
                  <div className="absolute top-2 right-2 z-10">
                    {work.isPublic ? (
                      <div 
                        className="flex items-center gap-1 px-2 py-1 bg-green-100 border border-green-300 rounded-lg shadow-sm"
                        title="Obra pública - visível para todos"
                      >
                        <GlobeAltIcon className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Público</span>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center gap-1 px-2 py-1 bg-amber-100 border border-amber-300 rounded-lg shadow-sm"
                        title="Obra privada - apenas você pode ver"
                      >
                        <LockClosedIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">Privado</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>

        {/* Filtros */}
        <div className="w-80">
          <Filtro onApplyFilters={handleApplyFilters} />
        </div>
      </div>
    </div>
  );
};

export default Works;
