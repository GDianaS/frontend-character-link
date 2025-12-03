import { useState, useEffect } from 'react';
import { useDnD } from '../DnDContext';
import { PlusIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { workService } from '../../../services/api';

function Toolbar({ chartId, onWorksChange, initialWorks = [] }) {
  const [type, setType] = useDnD();
  const [selectedWorks, setSelectedWorks] = useState([]);
  const [availableWorks, setAvailableWorks] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [showWorkSelector, setShowWorkSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar obras ao montar o componente
  useEffect(() => {
    loadWorks();
  }, []);

  // Configurar obras iniciais quando editar um chart existente
  useEffect(() => {
    if (initialWorks.length > 0) {
      const workIds = initialWorks.map(w => w._id);
      setSelectedWorks(workIds);
    }
  }, [initialWorks]);

  // Carregar personagens quando obras mudarem
  useEffect(() => {
    if (selectedWorks.length > 0) {
      loadCharacters();
    } else {
      setCharacters([]);
    }
  }, [selectedWorks]);

  // Notificar componente pai sobre mudanças nas obras
  useEffect(() => {
    if (onWorksChange) {
      onWorksChange(selectedWorks);
    }
  }, [selectedWorks, onWorksChange]);

  const loadWorks = async () => {
    try {
      const response = await workService.getAll();
      setAvailableWorks(response.data.data.works);
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
    }
  };

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const allCharacters = [];
      
      for (const workId of selectedWorks) {
        const response = await workService.getCharacters(workId);
        allCharacters.push(...response.data.data.characters);
      }
      
      setCharacters(allCharacters);
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragStart = (event, character) => {
    setType({ 
      type: 'default', 
      name: character.name,
      characterId: character._id,
      color: character.defaultColor || '#A8C4F0'
    });
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddWork = (workId) => {
    if (!selectedWorks.includes(workId)) {
      setSelectedWorks([...selectedWorks, workId]);
    }
    setShowWorkSelector(false);
    setSearchTerm('');
  };

  const handleRemoveWork = (workId) => {
    setSelectedWorks(selectedWorks.filter(id => id !== workId));
  };

  const getWorkById = (id) => {
    return availableWorks.find(w => w._id === id);
  };

  // Filtrar obras disponíveis pela pesquisa e remover já selecionadas
  const filteredWorks = availableWorks.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase());
    const notSelected = !selectedWorks.includes(work._id);
    return matchesSearch && notSelected;
  });

  return (
    <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-md p-4 min-w-[250px] max-w-[300px] max-h-[90vh] overflow-y-auto">
      
      {/* Obras Relacionadas */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm text-gray-700">Obras Relacionadas:</h3>
          <button
            onClick={() => setShowWorkSelector(!showWorkSelector)}
            className={`p-1 rounded transition ${
              showWorkSelector 
                ? 'bg-purple-100 text-purple-600' 
                : 'hover:bg-gray-100 text-purple-500'
            }`}
            title={showWorkSelector ? 'Fechar' : 'Adicionar obra'}
          >
            {showWorkSelector ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <PlusIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Seletor de Obras com Pesquisa */}
        {showWorkSelector && (
          <div className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
            {/* Campo de Pesquisa */}
            <div className="p-2 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar obras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de Obras Filtradas */}
            <div className="max-h-48 overflow-y-auto">
              {filteredWorks.length > 0 ? (
                filteredWorks.map((work) => (
                  <button
                    key={work._id}
                    onClick={() => handleAddWork(work._id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {work.imageCover && (
                        <img
                          src={work.imageCover}
                          alt={work.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{work.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{work.category}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-xs text-gray-400 text-center">
                  {searchTerm ? 'Nenhuma obra encontrada' : 'Todas as obras já foram adicionadas'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Obras Selecionadas */}
        <div className="space-y-2">
          {selectedWorks.length === 0 ? (
            <p className="text-xs text-gray-400 italic">
              Nenhuma obra selecionada
            </p>
          ) : (
            selectedWorks.map((workId) => {
              const work = getWorkById(workId);
              return work ? (
                <div
                  key={workId}
                  className="flex items-center justify-between text-xs bg-purple-50 p-2 rounded-lg group hover:bg-purple-100 transition"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {work.imageCover && (
                      <img
                        src={work.imageCover}
                        alt={work.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{work.title}</p>
                      <p className="text-gray-500 capitalize truncate">{work.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWork(workId)}
                    className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition"
                    title="Remover obra"
                  >
                    <XMarkIcon className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ) : null;
            })
          )}
        </div>
      </div>

      {/* Personagens */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm text-gray-700">
            Personagens ({characters.length}):
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          </div>
        ) : characters.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-8">
            {selectedWorks.length === 0 
              ? 'Selecione uma obra para ver os personagens' 
              : 'Nenhum personagem encontrado nas obras selecionadas'}
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-3">
              Arraste os personagens para o canvas →
            </p>
            {characters.map((character) => (
              <div
                key={character._id}
                className="px-3 py-2 border-2 rounded-lg cursor-grab hover:shadow-md transition active:cursor-grabbing"
                style={{ 
                  borderColor: character.defaultColor || '#A8C4F0', 
                  backgroundColor: `${character.defaultColor || '#A8C4F0'}20`
                }}
                onDragStart={(event) => onDragStart(event, character)}
                draggable
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: character.defaultColor || '#A8C4F0' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {character.name}
                    </p>
                    {character.alias && character.alias.length > 0 && (
                      <p className="text-xs text-gray-500 truncate">
                        aka {character.alias[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dica */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          💡 Dica: Conecte personagens e clique na conexão para definir o relacionamento
        </p>
      </div>
    </div>
  );
}

export default Toolbar;