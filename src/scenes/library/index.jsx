import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { chartService, workService } from '../../services/api';
import { DocumentTextIcon, EllipsisVerticalIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import ChartActionsMenu from '../../components/ChartActionsMenu';

// Componente Menu de Ações
// function ActionMenu({ chartId }) {
//     const [isOpen, setIsOpen] = useState(false);

//     const handleEdit = () => {
//         console.log('Editar chart:', chartId);
//         setIsOpen(false);
//     };

//     const handleRename = () => {
//         console.log('Renomear chart:', chartId);
//         setIsOpen(false);
//     };

//     const handleDelete = () => {
//         console.log('Deletar chart:', chartId);
//         setIsOpen(false);
//     };

//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition"
//             >
//                 <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
//             </button>

//             {isOpen && (
//                 <>
//                     <div 
//                         className="fixed inset-0 z-10" 
//                         onClick={() => setIsOpen(false)}
//                     />
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
//                         <button
//                             onClick={handleEdit}
//                             className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition rounded-t-lg"
//                         >
//                             <PencilSquareIcon className="w-4 h-4" />
//                             Editar
//                         </button>
//                         <button
//                             onClick={handleRename}
//                             className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
//                         >
                            
//                             <DocumentTextIcon className="w-4 h-4" />
//                             Renomear
//                         </button>
//                         <button
//                             onClick={handleDelete}
//                             className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition rounded-b-lg"
//                         >
//                             <TrashIcon className="w-4 h-4" />
//                             Deletar
//                         </button>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }


function ChartsTable() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    try {
      const response = await chartService.getMyCharts();
      setCharts(response.data.data.charts);
    } catch (error) {
      console.error('Erro ao carregar charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chartId) => {
    if (!confirm('Tem certeza que deseja deletar este chart?')) return;

    try {
      await chartService.delete(chartId);
      setCharts(charts.filter(c => c._id !== chartId));
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar chart');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <p className="text-center py-12 text-gray-500">Carregando...</p>;
  }

  if (charts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Você ainda não criou nenhum chart</p>
        <button
          onClick={() => navigate('/charts/create')}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Criar Primeiro Chart
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Título
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Obras
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Personagens
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Criado em
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Modificado
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {charts.map((chart) => (
            <tr 
              key={chart._id}
              className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => navigate(`/charts/${chart._id}`)}
            >
              <td className="py-4 px-4">
                <span className="font-medium text-gray-800">{chart.title}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1">
                  {chart.works.map((work) => (
                    <span
                      key={work._id}
                      className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                    >
                      {work.title}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {chart.stats.totalNodes}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {formatDate(chart.createdAt)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {formatDate(chart.updatedAt)}
                </span>
              </td>
              <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                {/* <ActionMenu 
                  chartId={chart._id}
                  onDelete={() => handleDelete(chart._id)}
                /> */}
                <ChartActionsMenu
                  chart={chart}
                  onEdit={() => navigate(`/charts/${chart._id}`)}
                  onRename={() => console.log("Renomear:", chart._id)}
                  onDelete={() => handleDelete(chart._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function Library() {
  return (
    <div className="flex-1 p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Minha Biblioteca</h1>
        <div className="flex gap-3">
          <SearchBar />
          <button
            onClick={() => window.location.href = '/charts/create'}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Novo Chart
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* ... Favoritos ... */}

        {/* Meus Charts */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Charts</h2>
          <ChartsTable />
        </div>
      </div>
    </div>
  );
}

export default Library;