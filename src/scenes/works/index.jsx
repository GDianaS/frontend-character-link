import Filtro from '../../components/Filtro';
import SearchBar from '../../components/SearchBar';
import WorkCard from '../../components/WorkCard';

const Works = () => {
  
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
            <WorkCard category="book"/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex bg-white rounded-2xl shadow-md p-4">
          <Filtro/>
        </div>
      </div>
      {/* Resultados */}
    </div>
    
  );
};

export default Works;