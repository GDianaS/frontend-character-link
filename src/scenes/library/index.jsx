import SearchBar from '../../components/SearchBar';
import { PlusIcon } from '@heroicons/react/24/outline';
import ChartsTable from './ChartsTable';

function Library() {
  return (
    <div className="flex-1 p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Minha Biblioteca</h1>

        <div className="flex gap-3">
          <SearchBar />

          <button
            onClick={() => window.location.href = '/charts/create'}
            className="
              bg-purple-600 text-white px-4 py-2 rounded-xl 
              hover:bg-purple-700 transition flex items-center gap-2 shadow-sm
            "
          >
            <PlusIcon className="w-5 h-5" />
            Novo Chart
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* seção de charts */}
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-visible">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Charts</h2>
          <ChartsTable />
        </div>
      </div>
    </div>
  );
}

export default Library;
