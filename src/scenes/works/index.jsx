import { useEffect, useState } from 'react';
import Filtro from '../../components/Filtro';
import SearchBar from '../../components/SearchBar';
import WorkCard from '../../components/WorkCard';
import { workService } from '../../services/api';

const Works = () => {

  const { getAll } = workService;
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await getAll();
        const loadedWorks = response.data.data.works;

        setWorks(loadedWorks);
        setFilteredWorks(loadedWorks); // inicialmente sem filtro
      } catch (error) {
        console.error("Erro ao carregar obras", error);
      }
    };

    fetchWorks();
  }, []);

  // Filtro
  const handleApplyFilters = ({sortBy, selectedTags}) => {
    let result = [...works];

    // ---- FILTRAR POR TAGS ----
    if (selectedTags.length > 0) {
      result = result.filter(work =>
        selectedTags.includes(work.category)  // ou work.tags
      );
    }

    // ---- ORDENAR ----
    if (sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "favorites") {
      result.sort((a, b) => (b.favorites || 0) - (a.favorites || 0));
    }

    setFilteredWorks(result);

  }
  
  return (
    <div className="flex-1 p-8 min-h-screen flex-col">
      <div className="flex">
        <h1>Obras</h1>
        <SearchBar/>
      </div>

      <div className='flex gap-4'>
        <div className="flex flex-col bg-white rounded-2xl shadow-md p-4">
          <h2>Obras:</h2>
          <div className="grid grid-cols-6 gap-4">

            {filteredWorks.map(work => (
              <WorkCard key={work._id} data={work} />
            ))}

          </div>
        </div>

          {/* Filtro */}
        <Filtro onApplyFilters={handleApplyFilters} />
        
      </div>
    </div>
    
  );
};

export default Works;
