import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chartService, workService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function ChartCreate() {
  const navigate = useNavigate();
  const { canSave } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    works: [],
    isPublic: false
  });
  const [availableWorks, setAvailableWorks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar obras ao montar componente
  useEffect(() => {
        loadWorks();
    }, []);


  const loadWorks = async () => {
    try {
      const response = await workService.getAll();
      setAvailableWorks(response.data.data.works);
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleWorkToggle = (workId) => {
    setFormData({
      ...formData,
      works: formData.works.includes(workId)
        ? formData.works.filter(id => id !== workId)
        : [...formData.works, workId]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSave()) {
      alert('Faça login para criar charts!');
      return;
    }

    if (!formData.title) {
      alert('Por favor, preencha o título');
      return;
    }

    setLoading(true);
    try {
      const response = await chartService.create({
        ...formData,
        flowData: {
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 }
        }
      });

      const chartId = response.data.data.chart._id;
      navigate(`/charts/${chartId}`);
    } catch (error) {
      console.error('Erro ao criar chart:', error);
      alert('Erro ao criar chart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Criar Novo Mapa de Relacionamentos
        </h2>

        {/* Formulário */}
        <div className="space-y-6">
          {/* Título */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Mapa de Personagens - Harry Potter"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descreva o objetivo deste mapa..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Selecionar Obras */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Obras Relacionadas
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
              {availableWorks.length === 0 ? (
                <p className="text-sm text-gray-400">Carregando obras...</p>
              ) : (
                <div className="space-y-2">
                  {availableWorks.map((work) => (
                    <label
                      key={work._id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.works.includes(work._id)}
                        onChange={() => handleWorkToggle(work._id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {work.title}
                        </p>
                        {work.subtitle && (
                          <p className="text-xs text-gray-500">{work.subtitle}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Você pode selecionar múltiplas obras para criar mapas que cruzam universos
            </p>
          </div>

          {/* Privacidade */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Tornar este chart público
                </span>
                <p className="text-xs text-gray-500">
                  Outros usuários poderão visualizar este mapa
                </p>
              </div>
            </label>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.title}
              className="px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Chart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartCreate;