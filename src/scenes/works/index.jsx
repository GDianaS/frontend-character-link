import { useEffect, useState } from 'react';
import Filtro from '../../components/Filtro';
import SearchBar from '../../components/SearchBar';
import WorkCard from '../../components/WorkCard';
import Pagination from '../../components/Pagination';
import { workService } from '../../services/api';

const Works = () => {

  const { getAll } = workService;

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
    setCurrentPage(1); // 🔥 Reset da paginação ao filtrar
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
    <div className="flex-1 p-8 min-h-screen flex-col">

      {/* Topo */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Obras</h1>

          {/* Badge de quantidade */}
          <span className="px-3 py-1 text-sm font-semibold bg-myown-primary-100 text-myown-primary-700 rounded-full shadow-sm">
            {filteredWorks.length}
          </span>
        </div>

        <SearchBar onSearch={handleSearch}/>
      </div>

      <div className='flex gap-4'>

        {/* Listagem */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg mb-4 font-semibold">Obras:</h2>

          <div className="grid grid-cols-6 gap-4">
            {visibleWorks.map(work => (
              <WorkCard key={work._id} data={work} />
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
        <Filtro onApplyFilters={handleApplyFilters}/>
      </div>
    </div>
  );
};

export default Works;
