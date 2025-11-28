import { useDnD } from '../DnDContext';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';


function Toolbar() {
  const [type, setType] = useDnD();
  
  const onDragStart = (event, nodeType, characterName) => {
    setType({ type: nodeType, name: characterName });
    event.dataTransfer.effectAllowed = 'move';
  };

  const characters = [
    { id: 1, name: "Personagem 1", color: "#A8C4F0" },
    { id: 2, name: "Personagem 2", color: "#FFB3D9" },
    { id: 3, name: "Personagem 3", color: "#C3B8F7" },
    { id: 4, name: "Personagem 4", color: "#8FD8D3" },
  ];

  return (
    <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-md p-4 min-w-[180px] max-w-[250px]">
      {/* Header */}
      {/* <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Harry Potter</h3>
          <ChevronDownIcon className="w-4 h-4 text-gray-600" />
        </div>
        <p className="text-sm text-gray-500">E a Pedra Filosofal</p>
      </div> */}

      {/* Obras Relacionadas */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm text-gray-700">Obras:</h3>
          <PlusIcon className="w-5 h-5 text-myown-terciary-500 cursor-pointer hover:text-myown-terciary-600" />
        </div>
        <div className="space-y-2">
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            Harry Potter - Pedra Filosofal
          </div>
        </div>
      </div>

      {/* Personagens */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm text-gray-700">Personagens:</h3>
          <PlusIcon className="w-5 h-5 text-myown-terciary-500 cursor-pointer hover:text-myown-terciary-600" />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-3">
            Arraste os personagens para o canvas →
          </p>
          {characters.map((character) => (
            <div
              key={character.id}
              className="px-3 py-2 border-2 rounded-lg cursor-grab hover:shadow-md transition"
              style={{ 
                borderColor: character.color, 
                backgroundColor: `${character.color}20`
              }}
              onDragStart={(event) => onDragStart(event, 'default', character.name)}
              draggable
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: character.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {character.name}
                </span>
              </div>
            </div>
          ))}
        </div>
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