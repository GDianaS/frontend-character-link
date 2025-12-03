import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chartService } from '../../services/api';
import ChartActionsMenu from './../../components/ChartActionsMenu'


export default function ChartsTable() {
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
      setCharts(prev => prev.filter(c => c._id !== chartId));
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar chart');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR');

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="h-6 w-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
    <div
      className="
        overflow-visible 
        max-h-[480px] 
        min-h-[260px]
        pr-1
      "
    >
      <table className="w-full text-sm overflow-visible">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Obras</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Personagens</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Criado em</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Modificado</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>

        <tbody>
          {charts.map((chart) => (
            <tr
              key={chart._id}
              className="
                hover:bg-gray-50 
                transition-colors 
                cursor-pointer
              "
              onClick={() => navigate(`/charts/${chart._id}`)}
            >
              <td className="py-4 px-4 font-medium text-gray-900">{chart.title}</td>

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

              <td className="py-4 px-4 text-gray-600">{chart.stats.totalNodes}</td>
              <td className="py-4 px-4 text-gray-600">{formatDate(chart.createdAt)}</td>
              <td className="py-4 px-4 text-gray-600">{formatDate(chart.updatedAt)}</td>

              <td
                className="py-4 px-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
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
