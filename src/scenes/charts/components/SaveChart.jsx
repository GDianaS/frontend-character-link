import { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { workService } from '../../../services/api';

function SaveChart({ onClose, onSave, preSelectedWorks = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    works: preSelectedWorks, // Usa as obras já selecionadas na Toolbar
    isPublic: false
  });
  const [availableWorks, setAvailableWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWorks(availableWorks);
    } else {
      const filtered = availableWorks.filter(work =>
        work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorks(filtered);
    }
  }, [searchQuery, availableWorks]);

  const loadWorks = async () => {
    try {
      const response = await workService.getAll();
      setAvailableWorks(response.data.data.works);
      setFilteredWorks(response.data.data.works);
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

  const handleSubmit = async () => {
    if (!formData.title) {
      alert('Por favor, preencha o título');
      return;
    }

    if (formData.works.length === 0) {
      alert('Por favor, selecione pelo menos uma obra');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      alert('Erro ao salvar chart');
    } finally {
      setLoading(false);
    }
  };

  const getWorkById = (id) => availableWorks.find(w => w._id === id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Salvar Mapa de Relacionamentos</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Título do Mapa *
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

          {/* Obras Selecionadas */}
          {formData.works.length > 0 && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Obras Selecionadas ({formData.works.length})
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.works.map(workId => {
                  const work = getWorkById(workId);
                  return work ? (
                    <span
                      key={workId}
                      className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {work.title}
                      <button
                        onClick={() => handleWorkToggle(workId)}
                        className="hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Buscar e Adicionar Mais Obras */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Adicionar Mais Obras (opcional)
            </label>
            
            {/* Campo de Busca */}
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, subtítulo ou autor..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Lista de Obras */}
            <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
              {filteredWorks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  {searchQuery ? 'Nenhuma obra encontrada' : 'Carregando obras...'}
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredWorks.map((work) => (
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {work.title}
                        </p>
                        {work.subtitle && (
                          <p className="text-xs text-gray-500 truncate">{work.subtitle}</p>
                        )}
                        {work.author && (
                          <p className="text-xs text-gray-400">por {work.author}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {work.category}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Você pode criar mapas que cruzam múltiplos universos
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
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title || formData.works.length === 0}
            className="px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Chart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveChart;