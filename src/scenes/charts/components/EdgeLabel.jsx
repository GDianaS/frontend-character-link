import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function EdgeLabel({ edge, onClose, onSave }) {
  const [relationshipType, setRelationshipType] = useState(
    edge.data?.relationshipType || ''
  );
  const [description, setDescription] = useState(
    edge.data?.description || ''
  );

  const relationshipTypes = [
    { value: 'family', label: '👨‍👩‍👧 Família', color: '#ef4444' },
    { value: 'romantic', label: '💕 Romântico', color: '#ec4899' },
    { value: 'friendship', label: '🤝 Amizade', color: '#3b82f6' },
    { value: 'rivalry', label: '⚔️ Rivalidade', color: '#f59e0b' },
    { value: 'enemy', label: '💀 Inimigo', color: '#dc2626' },
    { value: 'mentor', label: '🎓 Mentor', color: '#8b5cf6' },
    { value: 'colleague', label: '💼 Colega', color: '#6b7280' },
    { value: 'alliance', label: '🤝 Aliança', color: '#10b981' },
    { value: 'conflict', label: '⚡ Conflito', color: '#f97316' },
    { value: 'master-apprentice', label: '👨‍🏫 Mestre-Aprendiz', color: '#6366f1' },
    { value: 'parent-child', label: '👨‍👦 Pai/Mãe-Filho(a)', color: '#ef4444' },
    { value: 'siblings', label: '👫 Irmãos', color: '#14b8a6' },
    { value: 'lovers', label: '💑 Amantes', color: '#ec4899' },
    { value: 'ex-lovers', label: '💔 Ex-amantes', color: '#9ca3af' },
    { value: 'unrequited', label: '💘 Amor não correspondido', color: '#f472b6' },
    { value: 'other', label: '❓ Outro', color: '#6b7280' }
  ];

  const handleSubmit = () => {
    if (!relationshipType) {
      alert('Por favor, selecione um tipo de relacionamento');
      return;
    }

    const selectedType = relationshipTypes.find(t => t.value === relationshipType);
    onSave(edge.id, selectedType?.label || relationshipType, description);
    onClose();
  };

  const getTypeColor = (value) => {
    return relationshipTypes.find(t => t.value === value)?.color || '#6b7280';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Definir Relacionamento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tipo de Relacionamento */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-600">
              Tipo de Relacionamento *
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
              {relationshipTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setRelationshipType(type.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition text-left ${
                    relationshipType === type.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição Opcional */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Ex: Melhores amigos desde a infância..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Preview */}
          {relationshipType && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Preview da conexão:</p>
              <div className="flex items-center gap-3">
                <div className="w-16 h-10 bg-blue-200 rounded flex items-center justify-center text-xs font-medium">
                  Node 1
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: getTypeColor(relationshipType) }}
                  >
                    {relationshipTypes.find(t => t.value === relationshipType)?.label}
                  </div>
                </div>
                <div className="w-16 h-10 bg-pink-200 rounded flex items-center justify-center text-xs font-medium">
                  Node 2
                </div>
              </div>
            </div>
          )}
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
            disabled={!relationshipType}
            className="px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EdgeLabel;