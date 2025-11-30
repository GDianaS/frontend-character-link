import { useState, useEffect } from 'react';
import { useDnD } from '../DnDContext';
import {workService, characterService} from '../../../services/api'
import { ChevronDownIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';


function Toolbar({ chartId }) {
  const [type, setType] = useDnD();
  const [selectedWorks, setSelectedWorks] = useState([]);
  const [availableWorks, setAvailableWorks] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [showWorkSelector, setShowWorkSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar obras disponíveis
  useEffect(() => {
    loadWorks();
  }, []);

  // Carregar personagens quando obras são selecionadas
  useEffect(() => {
    if (selectedWorks.length > 0) {
      loadCharacters();
    }
  }, [selectedWorks]);

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
  };

  const handleRemoveWork = (workId) => {
    setSelectedWorks(selectedWorks.filter(id => id !== workId));
  };

  const getWorkById = (id) => {
    return availableWorks.find(w => w._id === id);
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-md p-4 min-w-[250px] max-w-[300px] max-h-[90vh] overflow-y-auto">
      
      {/* Obras Relacionadas */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm text-gray-700">Obras Relacionadas:</h3>
          <button
            onClick={() => setShowWorkSelector(!showWorkSelector)}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <PlusIcon className="w-5 h-5 text-purple-500" />
          </button>
        </div>

        {/* Seletor de Obras */}
        {showWorkSelector && (
          <div className="mb-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {availableWorks.map((work) => (
              <button
                key={work._id}
                onClick={() => handleAddWork(work._id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition border-b border-gray-100 last:border-0"
                disabled={selectedWorks.includes(work._id)}
              >
                <p className="font-medium text-gray-800">{work.title}</p>
                {work.subtitle && (
                  <p className="text-xs text-gray-500">{work.subtitle}</p>
                )}
              </button>
            ))}
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
                  className="flex items-center justify-between text-xs bg-purple-50 p-2 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{work.title}</p>
                    {work.subtitle && (
                      <p className="text-gray-500 truncate">{work.subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveWork(workId)}
                    className="ml-2 p-1 hover:bg-red-100 rounded transition"
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
          <p className="text-xs text-gray-400">Carregando personagens...</p>
        ) : characters.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            Selecione uma obra para ver os personagens
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
          💡 Dica: Conecte personagens arrastando de um node para outro
        </p>
      </div>
    </div>
  );
}

export default Toolbar;





// function Toolbar() {
//   const [type, setType] = useDnD();
  
//   const onDragStart = (event, nodeType, characterName) => {
//     setType({ type: nodeType, name: characterName });
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   const characters = [
//     { id: 1, name: "Personagem 1", color: "#A8C4F0" },
//     { id: 2, name: "Personagem 2", color: "#FFB3D9" },
//     { id: 3, name: "Personagem 3", color: "#C3B8F7" },
//     { id: 4, name: "Personagem 4", color: "#8FD8D3" },
//   ];

//   return (
//     <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-md p-4 min-w-[180px] max-w-[250px]">
//       {/* Header */}
//       {/* <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h3 className="font-bold text-gray-800">Harry Potter</h3>
//           <ChevronDownIcon className="w-4 h-4 text-gray-600" />
//         </div>
//         <p className="text-sm text-gray-500">E a Pedra Filosofal</p>
//       </div> */}

//       {/* Obras Relacionadas */}
//       <div className="pb-4 border-b border-gray-200">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="font-semibold text-sm text-gray-700">Obras:</h3>
//           <PlusIcon className="w-5 h-5 text-myown-terciary-500 cursor-pointer hover:text-myown-terciary-600" />
//         </div>
//         <div className="space-y-2">
//           <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
//             Harry Potter - Pedra Filosofal
//           </div>
//         </div>
//       </div>

//       {/* Personagens */}
//       <div className="flex-1 overflow-auto">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="font-semibold text-sm text-gray-700">Personagens:</h3>
//           <PlusIcon className="w-5 h-5 text-myown-terciary-500 cursor-pointer hover:text-myown-terciary-600" />
//         </div>
        
//         <div className="space-y-2">
//           <p className="text-xs text-gray-500 mb-3">
//             Arraste os personagens para o canvas →
//           </p>
//           {characters.map((character) => (
//             <div
//               key={character.id}
//               className="px-3 py-2 border-2 rounded-lg cursor-grab hover:shadow-md transition"
//               style={{ 
//                 borderColor: character.color, 
//                 backgroundColor: `${character.color}20`
//               }}
//               onDragStart={(event) => onDragStart(event, 'default', character.name)}
//               draggable
//             >
//               <div className="flex items-center gap-2">
//                 <div 
//                   className="w-3 h-3 rounded-full" 
//                   style={{ backgroundColor: character.color }}
//                 />
//                 <span className="text-sm font-medium text-gray-700">
//                   {character.name}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Dica */}
//       <div className="pt-4 border-t border-gray-200">
//         <p className="text-xs text-gray-500 italic">
//           💡 Dica: Conecte personagens arrastando de um node para outro
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Toolbar;